# File Converter Web Application

A modern web application for converting files between different formats, built with React frontend and Flask backend.

## Features

- **Audio Conversion**: MP3 ↔ WAV ↔ M4A
- **Image Conversion**: JPEG ↔ PNG ↔ SVG
- **Document Conversion**: PDF ↔ Word, PDF → PNG
- **Drag & Drop Interface**: Modern, intuitive file upload
- **Real-time Progress**: Visual feedback during conversion
- **Secure File Handling**: Automatic cleanup after download
- **Responsive Design**: Works on desktop and mobile

## Project Structure

```
web_app/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── converter/          # Conversion modules (copied from original)
│   ├── uploads/            # Temporary upload storage
│   └── outputs/            # Temporary output storage
└── frontend/               # React application
    ├── public/             # Static files
    ├── src/                # React source code
    │   ├── components/     # React components
    │   ├── App.js          # Main app component
    │   └── index.js        # App entry point
    ├── package.json        # Node.js dependencies
    └── tailwind.config.js  # Tailwind CSS config
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- FFmpeg (for audio conversions)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd web_app/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Copy converter modules:**
   ```bash
   cp -r ../../converter ./
   ```

6. **Start Flask server:**
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd web_app/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST /api/upload
Upload a file and get available conversion options.

**Request:** Multipart form data with file
**Response:**
```json
{
  "file_id": "uuid",
  "filename": "example.mp3",
  "file_type": "audio",
  "available_conversions": ["mp3_to_wav", "mp3_to_m4a"]
}
```

### POST /api/convert
Convert an uploaded file.

**Request:**
```json
{
  "file_id": "uuid",
  "conversion_type": "mp3_to_wav"
}
```

**Response:**
```json
{
  "success": true,
  "output_filename": "example.wav",
  "download_url": "/api/download/uuid_example.wav"
}
```

### GET /api/download/<filename>
Download a converted file.

### GET /api/health
Health check endpoint.

## Deployment

### Backend Deployment (Heroku)

1. **Create Procfile:**
   ```
   web: gunicorn app:app
   ```

2. **Add gunicorn to requirements.txt:**
   ```
   gunicorn==21.2.0
   ```

3. **Deploy to Heroku:**
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

### Frontend Deployment (Netlify/Vercel)

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Update API URL:**
   - Change proxy in package.json to your backend URL
   - Or use environment variables for production

## Environment Variables

### Backend
- `FLASK_ENV`: Set to `production` for production
- `MAX_CONTENT_LENGTH`: Maximum file size (default: 100MB)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)

## Security Considerations

- Files are stored temporarily and automatically cleaned up
- File size limits prevent abuse
- CORS is configured for frontend domain
- Input validation on all endpoints
- Secure filename handling

## Troubleshooting

### Common Issues

1. **FFmpeg not found:**
   - Install FFmpeg: https://ffmpeg.org/download.html
   - Add to system PATH

2. **CORS errors:**
   - Ensure backend is running on correct port
   - Check CORS configuration in Flask app

3. **File upload fails:**
   - Check file size limits
   - Verify supported file types
   - Ensure upload directory exists

4. **Conversion fails:**
   - Check FFmpeg installation
   - Verify file format compatibility
   - Check server logs for detailed errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 