import React from 'react';
import { FiMusic, FiImage, FiFileText, FiArrowRight } from 'react-icons/fi';

const ConversionOptions = ({ 
  availableConversions, 
  onConversionSelect, 
  selectedConversion, 
  isConverting 
}) => {
  const getConversionIcon = (conversionType) => {
    if (conversionType.includes('mp3') || conversionType.includes('wav') || conversionType.includes('m4a')) {
      return <FiMusic className="text-purple-500" />;
    } else if (conversionType.includes('png') || conversionType.includes('jpeg') || conversionType.includes('svg')) {
      return <FiImage className="text-green-500" />;
    } else {
      return <FiFileText className="text-blue-500" />;
    }
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

  const getConversionDescription = (conversionType) => {
    const descriptions = {
      'mp3_to_wav': 'Convert MP3 audio to uncompressed WAV format',
      'wav_to_mp3': 'Convert WAV audio to compressed MP3 format',
      'mp3_to_m4a': 'Convert MP3 to M4A (AAC) format',
      'wav_to_m4a': 'Convert WAV to M4A (AAC) format',
      'm4a_to_mp3': 'Convert M4A to MP3 format',
      'm4a_to_wav': 'Convert M4A to WAV format',
      'jpeg_to_png': 'Convert JPEG image to PNG with transparency support',
      'png_to_jpeg': 'Convert PNG image to JPEG format',
      'png_to_svg': 'Convert PNG image to SVG vector format',
      'jpeg_to_svg': 'Convert JPEG image to SVG vector format',
      'pdf_to_word': 'Convert PDF document to editable Word format',
      'word_to_pdf': 'Convert Word document to PDF format',
      'pdf_to_png': 'Convert PDF first page to PNG image',
    };
    return descriptions[conversionType] || 'Convert file to different format';
  };

  if (availableConversions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Conversions</h2>
        <p className="text-gray-600">No conversion options available for this file type.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Choose Conversion</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableConversions.map((conversionType) => (
          <button
            key={conversionType}
            onClick={() => onConversionSelect(conversionType)}
            disabled={isConverting}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedConversion === conversionType
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } ${isConverting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getConversionIcon(conversionType)}
                <div>
                  <h3 className="font-medium text-gray-800">
                    {formatConversionName(conversionType)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getConversionDescription(conversionType)}
                  </p>
                </div>
              </div>
              <FiArrowRight className="text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversionOptions; 