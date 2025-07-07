import React, { useState, useRef, useCallback, useEffect } from 'react';
import { getTranslation } from './translations';
import LanguageSelector from './components/LanguageSelector';
import TermsModal from './components/TermsModal';

function App() {
  const [language, setLanguage] = useState('en');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [conversionOptions, setConversionOptions] = useState({});
  const [selectedConversions, setSelectedConversions] = useState({});
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isMandatoryTerms, setIsMandatoryTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [convertingFiles, setConvertingFiles] = useState(new Set());
  const [conversionProgress, setConversionProgress] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Cleanup on page unload/refresh
    const handleBeforeUnload = () => {
      cleanupSession();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupSession();
    };
  }, []);

  const cleanupSession = async () => {
    try {
      await fetch('http://localhost:5000/api/cleanup-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch (error) {
      console.error('Error cleaning up session:', error);
    }
  };

  const handleFileUpload = useCallback(async (files) => {
    // Check if terms are accepted before allowing upload
    if (!termsAccepted) {
      setIsMandatoryTerms(true);
      setShowTermsModal(true);
      return;
    }

    const fileArray = Array.from(files);
    const newFiles = [];
    const newConversionOptions = {};
    
    for (const file of fileArray) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('session_id', sessionId);

      try {
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const fileData = {
            id: data.unique_filename,
            name: file.name,
            type: file.type,
            size: file.size,
            original_filename: data.filename,
            conversionOptions: getConversionOptions(file.name),
            convertedFiles: []
          };
          newFiles.push(fileData);
          newConversionOptions[data.unique_filename] = getConversionOptions(file.name);
        } else {
          alert(getTranslation(language, 'uploadFailed'));
        }
      } catch (error) {
        alert(getTranslation(language, 'networkError'));
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setConversionOptions(prev => ({ ...prev, ...newConversionOptions }));
    setSelectedConversions(prev => ({ ...prev }));
    setConvertedFiles([]);
  }, [termsAccepted, language, sessionId]);

  const getConversionOptions = (filename) => {
    const ext = filename.toLowerCase().split('.').pop();
    
    const options = {
      'pdf': ['pdf_to_word', 'pdf_to_png'],
      'docx': ['word_to_pdf'],
      'jpg': ['jpeg_to_png', 'jpeg_to_svg'],
      'jpeg': ['jpeg_to_png', 'jpeg_to_svg'],
      'png': ['png_to_jpeg', 'png_to_svg'],
      'svg': ['svg_to_png', 'svg_to_jpeg'],
      'mp3': ['mp3_to_wav', 'mp3_to_m4a'],
      'wav': ['wav_to_mp3', 'wav_to_m4a'],
      'm4a': ['m4a_to_mp3', 'm4a_to_wav']
    };

    return options[ext] || [];
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleConvert = async () => {
    if (Object.keys(selectedConversions).length === 0) return;

    setIsConverting(true);
    const newConvertedFiles = [];

    try {
      for (const [fileId, conversionType] of Object.entries(selectedConversions)) {
        if (!conversionType) continue;

        // Add to converting set
        setConvertingFiles(prev => new Set(prev).add(`${fileId}_${conversionType}`));
        
        // Start progress simulation
        const progressKey = `${fileId}_${conversionType}`;
        setConversionProgress(prev => ({ ...prev, [progressKey]: 0 }));
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setConversionProgress(prev => {
            const current = prev[progressKey] || 0;
            if (current < 90) { // Stop at 90% until conversion completes
              return { ...prev, [progressKey]: current + Math.random() * 15 };
            }
            return prev;
          });
        }, 200);

        const response = await fetch('http://localhost:5000/api/convert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unique_filename: fileId,
            conversion_type: conversionType
          }),
        });

        // Clear progress interval
        clearInterval(progressInterval);

        if (response.ok) {
          const data = await response.json();
          newConvertedFiles.push({
            ...data,
            fileId,
            originalName: uploadedFiles.find(f => f.id === fileId)?.name
          });
          
          // Set progress to 100% when complete
          setConversionProgress(prev => ({ ...prev, [progressKey]: 100 }));
        } else {
          alert(getTranslation(language, 'conversionFailed'));
        }
      }

      setConvertedFiles(newConvertedFiles);
    } catch (error) {
      alert(getTranslation(language, 'networkError'));
    } finally {
      setIsConverting(false);
      setConvertingFiles(prev => {
        const newSet = new Set(prev);
        for (const [fileId, conversionType] of Object.entries(selectedConversions)) {
          if (conversionType) {
            newSet.delete(`${fileId}_${conversionType}`);
          }
        }
        return newSet;
      });
      
      // Clear progress after a short delay
      setTimeout(() => {
        setConversionProgress({});
      }, 1000);
    }
  };

  const handleDownload = (convertedFile) => {
    const downloadUrl = `http://localhost:5000${convertedFile.download_url}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = convertedFile.clean_filename || convertedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (convertedFiles.length === 0) return;

    try {
      const response = await fetch('http://localhost:5000/api/download-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filenames: convertedFiles.map(file => file.output_filename)
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted_files.zip';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        alert(getTranslation(language, 'downloadError'));
      }
    } catch (error) {
      alert(getTranslation(language, 'networkError'));
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    setIsMandatoryTerms(false);
  };

  const handleTermsClose = () => {
    if (!isMandatoryTerms) {
      setShowTermsModal(false);
    }
  };

  const openTermsModal = () => {
    setIsMandatoryTerms(false);
    setShowTermsModal(true);
  };

  const resetApp = () => {
    setUploadedFiles([]);
    setConvertedFiles([]);
    setConversionOptions({});
    setSelectedConversions({});
  };

  const isConvertingFile = (fileId, conversionType) => {
    return convertingFiles.has(`${fileId}_${conversionType}`);
  };

  const getConversionProgress = (fileId, conversionType) => {
    const progressKey = `${fileId}_${conversionType}`;
    return conversionProgress[progressKey] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {getTranslation(language, 'title')}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {getTranslation(language, 'subtitle')}
          </p>
          <button
            onClick={openTermsModal}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {getTranslation(language, 'termsLink')}
          </button>
        </div>

        {/* File Upload Section */}
        {uploadedFiles.length === 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-6xl text-gray-400 mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {getTranslation(language, 'uploadTitle')}
              </h3>
              <p className="text-gray-500 mb-4">
                {getTranslation(language, 'uploadSubtitle')}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                {getTranslation(language, 'chooseFile')}
              </p>
              <p className="text-sm text-gray-400">
                {getTranslation(language, 'supportedFormats')}
              </p>
              <p className="text-sm text-gray-400">
                {getTranslation(language, 'maxSize')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".mp3,.wav,.m4a,.jpg,.jpeg,.png,.svg,.pdf,.docx"
              />
            </div>
          </div>
        )}

        {/* Uploaded Files Section */}
        {uploadedFiles.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {getTranslation(language, 'uploadedFile')} ({uploadedFiles.length})
                </h3>
                <button
                  onClick={resetApp}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  {getTranslation(language, 'uploadNewFile')}
                </button>
              </div>
              
              <div className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600">{file.type}</p>
                      </div>
                    </div>
                    
                    {conversionOptions[file.id] && conversionOptions[file.id].length > 0 ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {getTranslation(language, 'chooseConversion')}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {conversionOptions[file.id].map((option) => (
                            <button
                              key={option}
                              onClick={() => setSelectedConversions(prev => ({
                                ...prev,
                                [file.id]: option
                              }))}
                              disabled={isConvertingFile(file.id, option)}
                              className={`p-3 border rounded text-center text-sm transition-colors relative overflow-hidden ${
                                selectedConversions[file.id] === option
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : isConvertingFile(file.id, option)
                                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700 cursor-not-allowed'
                                  : 'border-gray-300 hover:border-blue-300'
                              }`}
                            >
                              {isConvertingFile(file.id, option) ? (
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    {getTranslation(language, 'converting')}
                                  </span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                                      style={{ width: `${getConversionProgress(file.id, option)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600">
                                    {Math.round(getConversionProgress(file.id, option))}%
                                  </span>
                                </div>
                              ) : (
                                getTranslation(language, option)
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {getTranslation(language, 'noConversionsAvailable')}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {Object.keys(selectedConversions).length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className={`w-full py-3 rounded-lg font-medium ${
                      isConverting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isConverting ? getTranslation(language, 'converting') : getTranslation(language, 'chooseConversion')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Converting Progress */}
        {isConverting && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {getTranslation(language, 'converting')}
              </h3>
              <p className="text-gray-600">
                {getTranslation(language, 'pleaseWait')}
              </p>
            </div>
          </div>
        )}

        {/* Download Section */}
        {convertedFiles.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="text-6xl text-green-500 mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {getTranslation(language, 'conversionComplete')}
                </h3>
                <p className="text-gray-600">
                  {convertedFiles.length} {getTranslation(language, 'successfullyConverted')}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  {getTranslation(language, 'fileConvertedSuccessfully')}
                </p>
                <p className="text-sm text-gray-600">
                  {getTranslation(language, 'clickDownloadToSave')}
                </p>
                <p className="text-sm text-gray-600">
                  {getTranslation(language, 'filesAutoDeleted')}
                </p>
              </div>

              <div className="space-y-4">
                {convertedFiles.map((convertedFile, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {getTranslation(language, 'outputFile')}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {convertedFile.clean_filename || convertedFile.filename}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDownload(convertedFile)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
                      >
                        {getTranslation(language, 'download')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleDownloadAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {getTranslation(language, 'downloadAll')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terms Modal */}
        <TermsModal
          isOpen={showTermsModal}
          onClose={handleTermsClose}
          language={language}
          onAccept={handleTermsAccept}
          isMandatory={isMandatoryTerms}
        />
      </div>
    </div>
  );
}

export default App; 