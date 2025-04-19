import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import config from './utils/config';

interface Settings {
  autoAnalyze: boolean;
  notifyLowTrust: boolean;
  rememberHistory: boolean;
  preferredTheme: 'light' | 'dark' | 'system';
  badgePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'none';
}

const defaultSettings: Settings = {
  autoAnalyze: true,
  notifyLowTrust: true,
  rememberHistory: true,
  preferredTheme: 'system',
  badgePosition: 'top-right'
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'settings' | 'guide'>('settings');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get('settings', (result) => {
      if (result.settings) {
        // Ensure backward compatibility with older settings
        setSettings({
          ...defaultSettings,
          ...result.settings
        });
      }
    });
  }, []);

  const handleSave = () => {
    // Save settings to storage
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  return (
    <div className="font-sans bg-gray-100 min-h-[100vh] p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-truthlens-primary text-white rounded-lg w-12 h-12 flex items-center justify-center">
              <span className="text-2xl font-bold">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">TruthLens</h1>
          </div>
          <div className="ml-auto text-sm text-gray-500">
            Version 1.0.0
          </div>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-truthlens-primary text-truthlens-primary'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-4 px-1 ${
                  activeTab === 'guide'
                    ? 'border-b-2 border-truthlens-primary text-truthlens-primary'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium`}
              >
                User Guide
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'settings' ? (
          <div>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="autoAnalyze"
                        name="autoAnalyze"
                        type="checkbox"
                        checked={settings.autoAnalyze}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-truthlens-primary focus:ring-truthlens-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="autoAnalyze" className="font-medium text-gray-700">
                        Automatically analyze news articles
                      </label>
                      <p className="text-gray-500">
                        TruthLens will automatically analyze articles when you visit news websites.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifyLowTrust"
                        name="notifyLowTrust"
                        type="checkbox"
                        checked={settings.notifyLowTrust}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-truthlens-primary focus:ring-truthlens-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifyLowTrust" className="font-medium text-gray-700">
                        Notify for low trust articles
                      </label>
                      <p className="text-gray-500">
                        Receive notifications when reading articles with low credibility scores.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="rememberHistory"
                        name="rememberHistory"
                        type="checkbox"
                        checked={settings.rememberHistory}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-truthlens-primary focus:ring-truthlens-primary"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="rememberHistory" className="font-medium text-gray-700">
                        Remember analyzed articles
                      </label>
                      <p className="text-gray-500">
                        Keep a history of analyzed articles for reference (stored locally).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="preferredTheme"
                      value={settings.preferredTheme}
                      onChange={handleSelectChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-truthlens-primary focus:border-truthlens-primary sm:text-sm rounded-md"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="badgePosition" className="block text-sm font-medium text-gray-700 mb-1">
                      Trust Badge Position
                    </label>
                    <select
                      id="badgePosition"
                      name="badgePosition"
                      value={settings.badgePosition}
                      onChange={handleSelectChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-truthlens-primary focus:border-truthlens-primary sm:text-sm rounded-md"
                    >
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="none">Don't Show</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Choose where the trust badge appears on web pages, or hide it completely.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">API Configuration</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    Currently connected to: <span className="font-medium">{config.apiUrl}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    This setting can only be changed by developers in the config file.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center">
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Settings
              </button>
              {saved && (
                <span className="ml-3 text-sm text-truthlens-success">Settings saved!</span>
              )}
            </div>
          </div>
        ) : (
          <div className="user-guide">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">TruthLens User Guide</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-truthlens-primary mb-3">Overview</h3>
              <p className="text-gray-700 mb-4">
                TruthLens is an AI-powered browser extension that helps you identify fake news and misinformation
                as you browse the web. It analyzes news articles in real-time and provides trustworthiness indicators
                to help you make informed decisions about the content you consume.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-truthlens-primary mb-3">Getting Started</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Browse to a news article</span> - TruthLens automatically
                  detects when you're reading a news article on supported websites.
                </li>
                <li>
                  <span className="font-medium">Look for the TruthLens badge</span> - A badge will appear in the
                  bottom-right corner of your screen when an article is analyzed.
                </li>
                <li>
                  <span className="font-medium">Check the trust level</span> - The badge color indicates the article's
                  credibility:
                  <div className="flex space-x-4 mt-2 ml-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-truthlens-success mr-2"></div>
                      <span>High Trust</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-truthlens-warning mr-2"></div>
                      <span>Medium Trust</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-truthlens-danger mr-2"></div>
                      <span>Low Trust</span>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="font-medium">View detailed analysis</span> - Click on the TruthLens icon in your
                  browser toolbar to see detailed analysis including credibility score, sentiment, and bias tags.
                </li>
              </ol>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-truthlens-primary mb-3">Features</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Real-time Credibility Analysis</h4>
                  <p className="text-gray-700">
                    TruthLens analyzes the article's content and provides a credibility score between 0 and 100%.
                    This score is based on factors like factual accuracy, source reliability, and writing style.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Sentiment Detection</h4>
                  <p className="text-gray-700">
                    Understand the emotional tone of the content (positive, negative, or neutral).
                    This helps identify potentially biased or sensationalist reporting.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Bias Identification</h4>
                  <p className="text-gray-700">
                    TruthLens detects potential biases in the article and categorizes them with tags
                    like political, factual, opinion, etc.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Source Verification</h4>
                  <p className="text-gray-700">
                    For some articles, TruthLens will provide links to related sources to help
                    cross-verify information.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-truthlens-primary mb-3">FAQ</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Why isn't TruthLens analyzing my article?</h4>
                  <p className="text-gray-700">
                    TruthLens works best on news articles from major publications. It may not detect
                    all article formats. Try refreshing the page or checking our supported sites list.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Is my data private?</h4>
                  <p className="text-gray-700">
                    Yes! TruthLens only sends article content to our AI analysis service. We do not
                    store your browsing history or personal information. All analysis is done in real-time
                    and only saved locally on your device if you enable the "Remember analyzed articles" option.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">How accurate is TruthLens?</h4>
                  <p className="text-gray-700">
                    TruthLens uses advanced AI models, but it's not perfect. Always use your own
                    judgment and consider multiple sources when evaluating information. We're constantly
                    improving our analysis algorithms.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-truthlens-primary mb-3">Support</h3>
              <p className="text-gray-700">
                For more support or to report issues, please visit our GitHub repository at{' '}
                <a 
                  href="https://github.com/manasdutta04/truthlens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-truthlens-primary hover:underline"
                >
                  github.com/manasdutta04/truthlens
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>TruthLens © 2025 - AI-powered fake news detection</p>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SettingsPage />
  </React.StrictMode>
); 