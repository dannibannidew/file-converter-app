from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
import uuid
import shutil
import zipfile
from werkzeug.utils import secure_filename
import mimetypes

# Configure ffmpeg for audio conversions
def configure_ffmpeg():
    """Configure ffmpeg path for audio conversions"""
    try:
        from pydub import AudioSegment
        
        # Check if we're in a cloud environment
        if os.environ.get('RAILWAY_ENVIRONMENT') or os.environ.get('RENDER') or os.environ.get('HEROKU'):
            # In cloud environment, use system ffmpeg
            print("Running in cloud environment, using system FFmpeg")
            return True
        
        # Local environment - try to use local ffmpeg
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(current_dir))
        ffmpeg_bin = os.path.join(project_root, 'ffmpeg-master-latest-win64-gpl', 'bin')
        
        if os.path.exists(ffmpeg_bin):
            # Add ffmpeg to system PATH
            if ffmpeg_bin not in os.environ.get('PATH', ''):
                os.environ['PATH'] = ffmpeg_bin + os.pathsep + os.environ.get('PATH', '')
            
            # Configure pydub to use local ffmpeg
            AudioSegment.converter = os.path.join(ffmpeg_bin, "ffmpeg.exe")
            AudioSegment.ffmpeg = os.path.join(ffmpeg_bin, "ffmpeg.exe")
            
            print(f"FFmpeg configured successfully: {ffmpeg_bin}")
            return True
        else:
            print(f"FFmpeg directory not found: {ffmpeg_bin}")
            return False
    except Exception as e:
        print(f"Error configuring ffmpeg: {e}")
        return False

# Configure ffmpeg before importing converters
configure_ffmpeg()

# Import converter functions
from converter.pdf_converter import convert_pdf_to_word, convert_word_to_pdf, convert_pdf_to_png
from converter.audio_converter import (
    convert_mp3_to_wav, convert_wav_to_mp3, convert_mp3_to_m4a,
    convert_wav_to_m4a, convert_m4a_to_mp3, convert_m4a_to_wav
)
from converter.image_converter import (
    convert_jpeg_to_png, convert_png_to_jpeg, convert_png_to_svg,
    convert_jpeg_to_svg, convert_svg_to_png, convert_svg_to_jpeg
)

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {
    'audio': {'mp3', 'wav', 'm4a'},
    'image': {'jpg', 'jpeg', 'png', 'svg'},
    'document': {'pdf', 'docx'}
}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

# Track uploaded files by session
uploaded_files = {}  # session_id -> list of file paths

def allowed_file(filename, file_type):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS.get(file_type, set())

def get_file_type(filename):
    """Detect file type based on extension"""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    if ext in ALLOWED_EXTENSIONS['audio']:
        return 'audio'
    elif ext in ALLOWED_EXTENSIONS['image']:
        return 'image'
    elif ext in ALLOWED_EXTENSIONS['document']:
        return 'document'
    else:
        return 'unknown'

def get_available_conversions(filename):
    """Get available conversion options for a file"""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    conversion_map = {
        '.pdf': ['pdf_to_word', 'pdf_to_png'],
        '.docx': ['word_to_pdf'],
        '.mp3': ['mp3_to_wav', 'mp3_to_m4a'],
        '.wav': ['wav_to_mp3', 'wav_to_m4a'],
        '.m4a': ['m4a_to_mp3', 'm4a_to_wav'],
        '.jpg': ['jpeg_to_png', 'jpeg_to_svg'],
        '.jpeg': ['jpeg_to_png', 'jpeg_to_svg'],
        '.png': ['png_to_jpeg', 'png_to_svg'],
        '.svg': ['svg_to_png', 'svg_to_jpeg'],
    }
    
    return conversion_map.get(f'.{ext}', [])

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Generate session ID if not provided
        session_id = request.form.get('session_id', str(uuid.uuid4()))
        
        # Create directories if they don't exist
        os.makedirs('uploads', exist_ok=True)
        os.makedirs('outputs', exist_ok=True)
        
        # Save file with unique name
        filename = secure_filename(file.filename or 'unknown')
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join('uploads', unique_filename)
        file.save(file_path)
        
        # Track uploaded file for this session
        if session_id not in uploaded_files:
            uploaded_files[session_id] = []
        uploaded_files[session_id].append(file_path)
        
        print(f"File uploaded: {file_path} for session: {session_id}")
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'unique_filename': unique_filename,
            'session_id': session_id
        })
        
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/convert', methods=['POST'])
def convert_file():
    """Convert a file to the specified format"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        unique_filename = data.get('unique_filename')
        conversion_type = data.get('conversion_type')
        
        if not unique_filename or not conversion_type:
            return jsonify({'error': 'Missing filename or conversion type'}), 400
        
        # Find the uploaded file
        input_path = os.path.join('uploads', unique_filename)
        
        if not os.path.exists(input_path):
            return jsonify({'error': 'Uploaded file not found'}), 404
        
        print(f"Starting conversion: {input_path} -> {conversion_type}")
        
        # Perform conversion
        conversion_functions = {
            'mp3_to_wav': convert_mp3_to_wav,
            'wav_to_mp3': convert_wav_to_mp3,
            'mp3_to_m4a': convert_mp3_to_m4a,
            'wav_to_m4a': convert_wav_to_m4a,
            'm4a_to_mp3': convert_m4a_to_mp3,
            'm4a_to_wav': convert_m4a_to_wav,
            'jpeg_to_png': convert_jpeg_to_png,
            'png_to_jpeg': convert_png_to_jpeg,
            'png_to_svg': convert_png_to_svg,
            'jpeg_to_svg': convert_jpeg_to_svg,
            'svg_to_png': convert_svg_to_png,
            'svg_to_jpeg': convert_svg_to_jpeg,
            'pdf_to_word': convert_pdf_to_word,
            'word_to_pdf': convert_word_to_pdf,
            'pdf_to_png': convert_pdf_to_png,
        }
        
        if conversion_type not in conversion_functions:
            return jsonify({'error': 'Unsupported conversion type'}), 400
        
        # Perform conversion
        output_path = conversion_functions[conversion_type](input_path)
        print(f"Conversion output path: {output_path}")
        print(f"Output path exists: {output_path and os.path.exists(output_path) if output_path else None}")
        
        if not output_path or not os.path.exists(output_path):
            return jsonify({'error': 'Conversion failed'}), 500
        
        # Move converted file to outputs directory with clean filename
        original_filename = unique_filename.split('_', 1)[1] if '_' in unique_filename else unique_filename
        original_name = os.path.splitext(original_filename)[0]
        
        # Get new extension based on conversion type
        new_extension = get_extension_for_conversion(conversion_type)
        clean_filename = f"{original_name}{new_extension}"
        
        # Create unique output filename
        output_filename = f"{uuid.uuid4()}_{clean_filename}"
        final_output_path = os.path.join('outputs', output_filename)
        
        # Copy instead of move to avoid issues with reconversion
        shutil.copy2(output_path, final_output_path)
        print(f"File copied successfully to: {final_output_path}")
        
        # Clean up the original converted file
        try:
            os.remove(output_path)
            print(f"Cleaned up original converted file: {output_path}")
        except Exception as e:
            print(f"Error cleaning up original file: {e}")
        
        print(f"Final file exists: {os.path.exists(final_output_path)}")
        
        return jsonify({
            'success': True,
            'output_filename': output_filename,
            'clean_filename': clean_filename,
            'download_url': f'/api/download/{output_filename}'
        })
        
    except Exception as e:
        print(f"Conversion error: {e}")
        return jsonify({'error': str(e)}), 500

def get_extension_for_conversion(conversion_type):
    """Get the file extension for a conversion type"""
    extension_map = {
        'pdf_to_word': '.docx',
        'word_to_pdf': '.pdf',
        'pdf_to_png': '.png',
        'jpeg_to_png': '.png',
        'png_to_jpeg': '.jpg',
        'png_to_svg': '.svg',
        'jpeg_to_svg': '.svg',
        'svg_to_png': '.png',
        'svg_to_jpeg': '.jpg',
        'mp3_to_wav': '.wav',
        'wav_to_mp3': '.mp3',
        'mp3_to_m4a': '.m4a',
        'wav_to_m4a': '.m4a',
        'm4a_to_mp3': '.mp3',
        'm4a_to_wav': '.wav'
    }
    return extension_map.get(conversion_type, '.converted')

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download a converted file and delete it after download"""
    try:
        file_path = os.path.join('outputs', filename)
        print(f"Looking for file: {file_path}")
        
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return jsonify({'error': 'File not found'}), 404
        
        print(f"File exists: {os.path.exists(file_path)}")
        
        # Send file and delete it after download
        response = send_file(file_path, as_attachment=True, download_name=filename)
        
        # Delete file after sending response
        def delete_after_response(response):
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"Deleted file after download: {file_path}")
            except Exception as e:
                print(f"Error deleting file: {e}")
            return response
        
        response.call_on_close(lambda: delete_after_response(response))
        return response
        
    except Exception as e:
        print(f"Download error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-zip', methods=['POST'])
def download_zip():
    """Download multiple files as zip and delete them after download"""
    try:
        data = request.get_json()
        filenames = data.get('filenames', [])
        
        if not filenames:
            return jsonify({'error': 'No files specified'}), 400
        
        # Create temporary zip file
        zip_filename = f"converted_files_{uuid.uuid4()}.zip"
        zip_path = os.path.join('outputs', zip_filename)
        
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for filename in filenames:
                file_path = os.path.join('outputs', filename)
                if os.path.exists(file_path):
                    zipf.write(file_path, filename)
        
        # Send zip file and delete all files after download
        response = send_file(zip_path, as_attachment=True, download_name=zip_filename)
        
        def delete_after_response(response):
            try:
                # Delete individual files
                for filename in filenames:
                    file_path = os.path.join('outputs', filename)
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        print(f"Deleted file after zip download: {file_path}")
                
                # Delete zip file
                if os.path.exists(zip_path):
                    os.remove(zip_path)
                    print(f"Deleted zip file after download: {zip_path}")
            except Exception as e:
                print(f"Error deleting files after zip download: {e}")
            return response
        
        response.call_on_close(lambda: delete_after_response(response))
        return response
        
    except Exception as e:
        print(f"Zip download error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/cleanup-session', methods=['POST'])
def cleanup_session():
    """Delete all uploaded files for a session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({'error': 'No session ID provided'}), 400
        
        deleted_count = 0
        if session_id in uploaded_files:
            for file_path in uploaded_files[session_id]:
                try:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        deleted_count += 1
                        print(f"Deleted uploaded file: {file_path}")
                except Exception as e:
                    print(f"Error deleting file {file_path}: {e}")
            
            # Remove session from tracking
            del uploaded_files[session_id]
        
        print(f"Cleaned up {deleted_count} files for session: {session_id}")
        return jsonify({'message': f'Cleaned up {deleted_count} files', 'deleted_count': deleted_count})
        
    except Exception as e:
        print(f"Cleanup error: {e}")
        return jsonify({'error': str(e)}), 500

def cleanup_old_files():
    """Clean up files older than 1 hour"""
    import time
    current_time = time.time()
    max_age = 3600  # 1 hour in seconds
    
    # Clean up uploads folder
    upload_dir = app.config['UPLOAD_FOLDER']
    if os.path.exists(upload_dir):
        for filename in os.listdir(upload_dir):
            file_path = os.path.join(upload_dir, filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > max_age:
                    try:
                        os.remove(file_path)
                        print(f"Cleaned up old upload file: {filename}")
                    except Exception as e:
                        print(f"Error cleaning up {filename}: {e}")
    
    # Clean up outputs folder
    output_dir = app.config['OUTPUT_FOLDER']
    if os.path.exists(output_dir):
        for filename in os.listdir(output_dir):
            file_path = os.path.join(output_dir, filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > max_age:
                    try:
                        os.remove(file_path)
                        print(f"Cleaned up old output file: {filename}")
                    except Exception as e:
                        print(f"Error cleaning up {filename}: {e}")

@app.route('/api/cleanup', methods=['POST'])
def manual_cleanup():
    """Manual cleanup endpoint"""
    cleanup_old_files()
    return jsonify({'message': 'Cleanup completed'})

@app.route('/api/terms/<filename>')
def get_terms(filename):
    """Get terms and conditions file"""
    try:
        # Only allow specific terms files
        if filename not in ['terms_and_condition_en.txt', 'terms_and_condition_dk.txt']:
            return jsonify({'error': 'Invalid terms file'}), 400
        
        terms_path = os.path.join(os.path.dirname(__file__), '..', '..', filename)
        if os.path.exists(terms_path):
            with open(terms_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content, 200, {'Content-Type': 'text/plain; charset=utf-8'}
        else:
            return jsonify({'error': 'Terms file not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Error reading terms: {str(e)}'}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Run initial cleanup
    cleanup_old_files()
    print("File Converter API started with automatic cleanup enabled")
    print("Files will be kept for 1 hour before automatic deletion")
    
    # Get port from environment variable (for cloud deployment)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 