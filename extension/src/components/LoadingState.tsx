import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-truthlens-primary"></div>
      <p className="mt-4 text-gray-600">Loading article analysis...</p>
    </div>
  );
};

export default LoadingState; 