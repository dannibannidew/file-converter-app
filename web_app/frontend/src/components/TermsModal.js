import React, { useState, useEffect } from 'react';
import { getTranslation } from '../translations';

const TermsModal = ({ isOpen, onClose, language, onAccept, isMandatory = false }) => {
  const [termsContent, setTermsContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTerms();
      setAccepted(false); // Reset acceptance when modal opens
    }
  }, [isOpen, language]);

  const loadTerms = async () => {
    setIsLoading(true);
    setError('');
    try {
      const filename = language === 'dk' ? 'terms_and_condition_dk.txt' : 'terms_and_condition_en.txt';
      const response = await fetch(`http://localhost:5000/api/terms/${filename}`);
      if (response.ok) {
        const content = await response.text();
        setTermsContent(content);
      } else {
        setError(getTranslation(language, 'termsNotAvailable'));
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Backend server is not available. Please run the backend locally or deploy it to a hosting service.');
      } else {
        setError(getTranslation(language, 'networkError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      onClose();
    }
  };

  const handleClose = () => {
    if (isMandatory && !accepted) {
      // If mandatory and not accepted, don't allow closing
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {getTranslation(language, 'termsAndConditions')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {termsContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer - only show checkbox and accept button when mandatory */}
        {isMandatory ? (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-start space-x-3 mb-4">
              <input
                type="checkbox"
                id="accept-terms"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="text-sm text-gray-700">
                {getTranslation(language, 'acceptTerms')}
              </label>
            </div>
            
            {!accepted && (
              <div className="text-red-600 text-sm mb-4">
                {getTranslation(language, 'mustAcceptTerms')}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleAccept}
                disabled={!accepted}
                className={`px-6 py-2 rounded font-medium ${
                  !accepted
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {getTranslation(language, 'acceptTerms')}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
              >
                {getTranslation(language, 'close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsModal; 