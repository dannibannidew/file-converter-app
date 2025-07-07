import React from 'react';
import { FiLoader } from 'react-icons/fi';

const ConversionProgress = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center space-x-3">
        <FiLoader className="animate-spin text-blue-600 text-xl" />
        <div>
          <h3 className="text-lg font-medium text-gray-800">Converting your file...</h3>
          <p className="text-gray-600">Please wait while we process your file</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ConversionProgress; 