# File Converter Web Application

A modern web application for converting various file formats including images, audio, and documents. Built with React frontend and Flask backend.

## Features

- **Image Conversion**: Convert between JPG, PNG, SVG, and other image formats
- **Audio Conversion**: Convert between MP3, WAV, M4A, and other audio formats  
- **Document Conversion**: Convert between PDF, DOCX, and other document formats
- **Drag & Drop Interface**: Easy file upload with drag and drop functionality
- **Multi-language Support**: English and Danish language options
- **Real-time Progress**: Track conversion progress in real-time
- **Batch Processing**: Convert multiple files at once

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios for API calls
- React Dropzone for file uploads
- React Icons

### Backend
- Flask (Python)
- Flask-CORS
- FFmpeg for audio/video conversion
- Pillow for image processing
- PyMuPDF for PDF operations
- python-docx for document processing

## Prerequisites

- Python 3.8+
- Node.js 16+
- FFmpeg (see installation instructions below)

## Installation

1. **Clone the repository**
   ```bash
   git clone (https://github.com/dannibannidew/file-converter-app)
   cd FileConverter
   ```

2. **Install FFmpeg**
   - Download FFmpeg from: https://ffmpeg.org/download.html
   - Extract to the project root directory
   - Ensure `ffmpeg.exe` and `ffprobe.exe` are in the `ffmpeg-master-latest-win64-gpl/bin/` folder
   - Or use the provided FFmpeg files (not included in repository due to size)

3. **Install Python dependencies**
   ```bash
   cd web_app/backend
   pip install -r requirements.txt
   ```

4. **Install Node.js dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd web_app/backend
   python app.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd web_app/frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to use the application

### Production Build

1. **Build the frontend**
   ```bash
   cd web_app/frontend
   npm run build
   ```

2. **Serve the production build**
   The backend can serve the built React app in production mode.

## Project Structure

```
FileConverter/
├── web_app/
│   ├── backend/
│   │   ├── app.py                 # Main Flask application
│   │   ├── converter/             # Conversion modules
│   │   │   ├── audio_converter.py
│   │   │   ├── image_converter.py
│   │   │   └── pdf_converter.py
│   │   ├── uploads/               # Uploaded files (gitignored)
│   │   ├── outputs/               # Converted files (gitignored)
│   │   └── requirements.txt       # Python dependencies
│   └── frontend/
│       ├── src/
│       │   ├── components/        # React components
│       │   ├── App.js            # Main App component
│       │   └── translations.js   # Language translations
│       ├── package.json          # Node.js dependencies
│       └── tailwind.config.js    # Tailwind configuration
├── ffmpeg-master-latest-win64-gpl/ # FFmpeg binaries (not in repo)
├── ico/                          # Application icons
└── README.md                     # This file
```

## API Endpoints

- `POST /upload` - Upload files for conversion
- `POST /convert` - Convert uploaded files
- `GET /download/<filename>` - Download converted files
- `GET /terms/<language>` - Get terms and conditions

## Supported File Formats

### Images
- Input: JPG, PNG, SVG, BMP, TIFF
- Output: JPG, PNG, SVG

### Audio
- Input: MP3, WAV, M4A, FLAC, OGG
- Output: MP3, WAV, M4A

### Documents
- Input: PDF, DOCX, DOC
- Output: PDF, DOCX

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FFmpeg for audio/video conversion capabilities
- React community for the excellent frontend framework
- Flask community for the Python web framework 
