import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Analysis from './components/Analysis';
import Verification from './components/Verification';
import ReportForm from './components/ReportForm';
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

// Import config
import config from './utils/config';

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

// Main popup component
const Popup: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'verify' | 'report'>('analysis');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'not_verified' | 'verifying' | 'verified' | 'failed'>('not_verified');
  const [verificationData, setVerificationData] = useState<any>(null);

  useEffect(() => {
    console.log("Popup loaded. API URL:", config.apiUrl);
    
    // Get the current analysis result from the background script
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Request the analysis data directly from the background script
        // without requiring tab access first
        chrome.runtime.sendMessage({ action: 'getAnalysisResult' }, (response) => {
          console.log("Got response from background script:", response);
          
          if (response && response.data) {
            setAnalysisData(response.data);
            setLoading(false);
          } else {
            // Check current tab as a fallback if no analysis data is available
            try {
              chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (!tabs || !tabs[0] || !tabs[0].url) {
                  setError("Cannot analyze this page. Please navigate to a news article and try again.");
                  setLoading(false);
                  return;
                }
                
                console.log("Current tab:", tabs[0].url);
                // Still no analysis data, but at least we know the current tab
                setError("No analysis available for this page. This doesn't appear to be a news article or the analysis hasn't completed yet.");
                setLoading(false);
              });
            } catch (tabErr) {
              // Tabs API access failed
              console.error("Error accessing tab information:", tabErr);
              setError("No analysis available. Please navigate to a news article and try again.");
              setLoading(false);
            }
          }
        });
      } catch (err) {
        console.error("Error fetching analysis data:", err);
        setError(`Error fetching analysis data. Please try again.`);
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  const handleVerify = async () => {
    if (!analysisData) {
      setError("No analysis data to verify");
      return;
    }

    try {
      setVerificationStatus('verifying');
      
      console.log(`Verifying article: ${analysisData.url}`, analysisData);
      
      const response = await fetch(`${config.apiUrl}/api/save_verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: analysisData.url,
          title: analysisData.articleData.title,
          credibilityScore: analysisData.result.credibilityScore,
          trustLevel: analysisData.result.trustLevel,
          timestamp: Date.now()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Verification API error:", errorText);
        throw new Error(`API returned status: ${response.status}`);
      }

      const result = await response.json();
      setVerificationData(result);
      setVerificationStatus('verified');
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationStatus('failed');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (!analysisData) {
      return (
        <ErrorState message="No analysis data available. Please navigate to a news article and try again." />
      );
    }

    switch (activeTab) {
      case 'analysis':
        return <Analysis analysisData={analysisData} />;
      case 'verify':
        return (
          <Verification
            analysisData={analysisData}
            status={verificationStatus}
            verificationData={verificationData}
            onVerify={handleVerify}
          />
        );
      case 'report':
        return <ReportForm articleUrl={analysisData.url} />;
      default:
        return <Analysis analysisData={analysisData} />;
    }
  };

  // Debug button for development purposes
  const renderDebugButton = () => {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <button 
          className="text-xs text-gray-500 hover:text-gray-700 absolute bottom-1 right-1"
          onClick={() => {
            console.log("Debug info:", {
              config,
              analysisData,
              verificationStatus,
              verificationData
            });
            
            // Test API connection
            fetch(`${config.apiUrl}/health`)
              .then(res => res.json())
              .then(data => console.log("API Health:", data))
              .catch(err => console.error("API Health Error:", err));
          }}
        >
          Debug
        </button>
      );
    }
    return null;
  };

  return (
    <div className="w-96 p-4 font-sans bg-white">
      <div className="flex items-center mb-4">
        <div className="text-truthlens-primary font-bold text-2xl flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
            <rect width="24" height="24" fill="#3b82f6" />
            <text x="7" y="17" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="14">T</text>
          </svg>
          TruthLens
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 ${
              activeTab === 'analysis' ? 'border-truthlens-primary text-truthlens-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
          <button
            className={`py-2 px-1 border-b-2 ${
              activeTab === 'verify' ? 'border-truthlens-primary text-truthlens-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('verify')}
          >
            Verify
          </button>
          <button
            className={`py-2 px-1 border-b-2 ${
              activeTab === 'report' ? 'border-truthlens-primary text-truthlens-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('report')}
          >
            Report
          </button>
        </nav>
      </div>

      <div className="min-h-[350px]">
        {renderContent()}
      </div>

      <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between items-center">
        <div className="text-xs text-gray-500">TruthLens v1.0.0</div>
        <button 
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={() => chrome.runtime.sendMessage({ action: 'openSettings' })}
        >
          Settings
        </button>
      </div>
      
      {renderDebugButton()}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Popup />); 