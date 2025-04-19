import React from 'react';

interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
      <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
      <p className="text-sm text-red-700">
        {message}
      </p>
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Visit a news article and TruthLens will analyze it for credibility automatically.
        </p>
      </div>
    </div>
  );
};

export default ErrorState; 