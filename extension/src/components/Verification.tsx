import React from 'react';

interface ArticleData {
  title: string;
  content: string;
  url: string;
}

interface AnalysisResult {
  credibilityScore: number;
  sentiment: string;
  biasTags: string[];
  sources: any[];
  trustLevel: 'high' | 'medium' | 'low';
}

interface AnalysisData {
  url: string;
  result: AnalysisResult;
  articleData: ArticleData;
}

interface VerificationProps {
  analysisData: AnalysisData;
  status: 'not_verified' | 'verifying' | 'verified' | 'failed';
  verificationData: any;
  onVerify: () => void;
}

const Verification: React.FC<VerificationProps> = ({ 
  analysisData, 
  status, 
  verificationData,
  onVerify 
}) => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Article Verification</h2>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm mb-3">
            Verify this article's credibility analysis to create a permanent record in our database.
          </p>

          {status === 'not_verified' && (
            <button 
              onClick={onVerify}
              className="btn btn-primary w-full"
            >
              Verify Article
            </button>
          )}

          {status === 'verifying' && (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-truthlens-primary"></div>
              <p className="mt-2 text-sm text-gray-600">Verifying article...</p>
            </div>
          )}

          {status === 'verified' && verificationData && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-truthlens-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="font-medium">Successfully Verified!</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Verification ID:</span>
                  <span className="ml-1 truncate block">
                    {verificationData.id}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Timestamp:</span>
                  <span className="ml-1">
                    {new Date(verificationData.timestamp).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Credibility Score:</span>
                  <span className="ml-1">
                    {Math.round(verificationData.credibilityScore * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-truthlens-danger mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="font-medium">Verification Failed</h3>
              </div>
              
              <p className="text-sm mt-2">
                Please try again later. If the problem persists, contact support.
              </p>
              
              <button 
                onClick={onVerify}
                className="btn btn-primary mt-3 w-full"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">What is Article Verification?</h2>
        <div className="bg-gray-100 rounded-lg p-4 text-sm">
          <p className="mb-2">
            TruthLens allows you to create a verified record of analyzed news articles.
          </p>
          <p className="mb-2">
            When you verify an article:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The article's analysis is stored in our database</li>
            <li>The verification is timestamped and secured</li>
            <li>You can reference this verification in the future</li>
            <li>Others can check if the article has been analyzed</li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            Verified articles help build a database of trustworthy news sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verification; 