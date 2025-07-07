import React from 'react';
import { FiDownload, FiCheckCircle } from 'react-icons/fi';

const DownloadSection = ({ convertedFile, originalFilename, conversionType }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    // Use the full backend URL
    link.href = `http://localhost:5000${convertedFile.download_url}`;
    link.download = convertedFile.output_filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatConversionName = (conversionType) => {
    const conversions = {
      'mp3_to_wav': 'MP3 → WAV',
      'wav_to_mp3': 'WAV → MP3',
      'mp3_to_m4a': 'MP3 → M4A',
      'wav_to_m4a': 'WAV → M4A',
      'm4a_to_mp3': 'M4A → MP3',
      'm4a_to_wav': 'M4A → WAV',
      'jpeg_to_png': 'JPEG → PNG',
      'png_to_jpeg': 'PNG → JPEG',
      'png_to_svg': 'PNG → SVG',
      'jpeg_to_svg': 'JPEG → SVG',
      'pdf_to_word': 'PDF → Word',
      'word_to_pdf': 'Word → PDF',
      'pdf_to_png': 'PDF → PNG',
    };
    return conversions[conversionType] || conversionType;
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <FiCheckCircle className="text-green-600 text-2xl" />
        <div>
          <h2 className="text-xl font-semibold text-green-800">Conversion Complete!</h2>
          <p className="text-green-600">
            Successfully converted {originalFilename} to {formatConversionName(conversionType)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Output File</h3>
            <p className="text-gray-600">{convertedFile.output_filename}</p>
          </div>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FiDownload />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="text-sm text-green-700">
        <p>✅ Your file has been converted successfully</p>
        <p>✅ Click the download button to save your converted file</p>
        <p>✅ Files are automatically deleted from our servers after download</p>
      </div>
    </div>
  );
};

export default DownloadSection; 