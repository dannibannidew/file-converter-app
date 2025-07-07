import React from 'react';
import { getTranslation } from '../translations';

const LanguageSelector = ({ language, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">🌐</span>
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">{getTranslation(language, 'english')}</option>
        <option value="dk">{getTranslation(language, 'danish')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector; 