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

interface AnalysisProps {
  analysisData: AnalysisData;
}

const Analysis: React.FC<AnalysisProps> = ({ analysisData }) => {
  const { result, articleData } = analysisData;
  
  // Convert credibility score to percentage
  const credibilityPercentage = Math.round(result.credibilityScore * 100);
  
  // Determine trust level styles and icon
  let trustColor = 'text-truthlens-success';
  let trustIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
    </svg>
  );
  
  if (result.trustLevel === 'medium') {
    trustColor = 'text-truthlens-warning';
    trustIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    );
  } else if (result.trustLevel === 'low') {
    trustColor = 'text-truthlens-danger';
    trustIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    );
  }

  // Determine sentiment icon
  let sentimentIcon;
  switch (result.sentiment) {
    case 'positive':
      sentimentIcon = (
        <svg className="w-5 h-5 text-truthlens-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
    case 'negative':
      sentimentIcon = (
        <svg className="w-5 h-5 text-truthlens-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
    default:
      sentimentIcon = (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Credibility Analysis</h2>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className={`mr-2 ${trustColor}`}>
              {trustIcon}
            </div>
            <h3 className={`font-bold ${trustColor}`}>
              {result.trustLevel.charAt(0).toUpperCase() + result.trustLevel.slice(1)} Trust Level
            </h3>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className={`h-2.5 rounded-full ${
                result.trustLevel === 'high' ? 'bg-truthlens-success' : 
                result.trustLevel === 'medium' ? 'bg-truthlens-warning' : 
                'bg-truthlens-danger'
              }`} 
              style={{ width: `${credibilityPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            Score: {credibilityPercentage}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Content Analysis</h2>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-1">
              {sentimentIcon}
              <h3 className="ml-2 font-medium text-sm">Sentiment</h3>
            </div>
            <p className="text-sm">
              {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <svg className="w-5 h-5 text-truthlens-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <h3 className="ml-2 font-medium text-sm">Bias Tags</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {result.biasTags.map((tag, index) => (
                <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result.sources && result.sources.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Cross-Verification</h2>
          <div className="overflow-y-auto max-h-40 bg-gray-100 rounded-lg p-3">
            <ul className="space-y-2">
              {result.sources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-truthlens-primary hover:underline flex items-start"
                  >
                    <svg className="w-4 h-4 mr-1 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <span>{source.title || "Related Source"}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis; 