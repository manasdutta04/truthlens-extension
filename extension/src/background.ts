// Define types for our messages
interface AnalysisData {
  url: string;
  result: AnalysisResult;
  articleData: ArticleData;
}

interface ArticleData {
  title: string;
  content: string;
  url: string;
}

interface AnalysisResult {
  credibilityScore: number;
  sentiment: string;
  biasTags: string[];
  sources: string[];
  trustLevel: 'high' | 'medium' | 'low';
}

// In-memory cache for the current analysis result
let currentAnalysis: AnalysisData | null = null;

// Log the background script start
console.log("TruthLens: Background script started");

// Open settings page
function openSettingsPage() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('settings.html')
  });
}

// Listen for messages from the content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("TruthLens: Received message", message);
  
  try {
    if (message.action === 'saveAnalysisResult') {
      // Store the analysis result for use by the popup
      console.log("TruthLens: Saving analysis result", message.data);
      currentAnalysis = message.data;
      
      // Update the extension badge if credibility score is available
      if (message.data && message.data.result && message.data.result.credibilityScore !== undefined) {
        updateExtensionBadge(message.data.result.credibilityScore);
      } else {
        console.warn("TruthLens: Missing credibility score in data", message.data);
        // Reset the badge
        chrome.action.setBadgeText({ text: '' });
      }
      
      sendResponse({ success: true });
      return true;
    }
    
    if (message.action === 'getAnalysisResult') {
      // Return the current analysis result to the popup
      console.log("TruthLens: Returning analysis result", currentAnalysis);
      
      // If we have current analysis data, return it immediately
      if (currentAnalysis) {
        sendResponse({ data: currentAnalysis });
        return true;
      }
      
      // If no current analysis, check the active tab to see if we need to analyze it
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const activeTab = tabs && tabs.length > 0 ? tabs[0] : null;
          
          if (!activeTab || !activeTab.url) {
            console.warn("TruthLens: No active tab found when requesting analysis result");
            sendResponse({ data: null, error: "No active tab" });
            return;
          }
          
          // We have a tab but no analysis data for it
          console.log(`TruthLens: No analysis data for tab: ${activeTab.url}`);
          sendResponse({ data: null });
        });
      } catch (e) {
        console.error("TruthLens: Error querying tabs", e);
        sendResponse({ data: null, error: "Tab query error" });
      }
      
      return true;
    }
    
    if (message.action === 'openPopup') {
      // Not directly possible to programmatically open the popup
      // Instead, flash the extension icon to draw attention
      flashExtensionIcon();
      sendResponse({ success: true });
      return true;
    }
    
    if (message.action === 'clearAnalysisResult') {
      // Clear current analysis data
      console.log("TruthLens: Clearing analysis result");
      currentAnalysis = null;
      chrome.action.setBadgeText({ text: '' });
      sendResponse({ success: true });
      return true;
    }
    
    if (message.action === 'openSettings') {
      // Open the settings page
      openSettingsPage();
      sendResponse({ success: true });
      return true;
    }
    
    // Handle unknown messages
    console.warn("TruthLens: Unknown message action", message.action);
    sendResponse({ success: false, error: "Unknown action" });
  } catch (error) {
    console.error("TruthLens: Error processing message", error);
    sendResponse({ success: false, error: String(error) });
  }
  
  return false;
});

// Update the extension badge based on credibility score
function updateExtensionBadge(score: number) {
  try {
    console.log("TruthLens: Updating badge with score", score);
    
    // Set badge color based on score
    let color = '#10b981'; // Green for high trust
    
    if (score < 0.4) {
      color = '#ef4444'; // Red for low trust
    } else if (score < 0.7) {
      color = '#f59e0b'; // Yellow for medium trust
    }
    
    chrome.action.setBadgeBackgroundColor({ color });
    
    // Set badge text to percentage
    const percentage = Math.round(score * 100);
    chrome.action.setBadgeText({ text: `${percentage}%` });
  } catch (error) {
    console.error("TruthLens: Error updating badge", error);
    // Reset badge if there's an error
    chrome.action.setBadgeText({ text: '' });
  }
}

// Flash the extension icon to draw attention
function flashExtensionIcon() {
  try {
    // Change the icon to an "alert" version temporarily
    // Here we'd normally switch to a different icon, but for simplicity we'll just use the badge
    chrome.action.setBadgeText({ text: '!!!' });
    chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    
    // Reset after 1 second
    setTimeout(() => {
      // If we have a current analysis, restore its badge
      if (currentAnalysis && currentAnalysis.result) {
        updateExtensionBadge(currentAnalysis.result.credibilityScore);
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
    }, 1000);
  } catch (error) {
    console.error("TruthLens: Error flashing icon", error);
  }
}

// Initialize extension when installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('TruthLens extension installed or updated');
  
  // Clear the badge
  chrome.action.setBadgeText({ text: '' });
  
  // Initialize storage if needed
  chrome.storage.local.get('settings', (result) => {
    if (!result.settings) {
      // Set default settings
      chrome.storage.local.set({
        settings: {
          autoAnalyze: true,
          notifyLowTrust: true,
          rememberHistory: true,
          preferredTheme: 'system',
          badgePosition: 'top-right',
        }
      });
      console.log("TruthLens: Initialized default settings");
    } else {
      // Ensure existing settings have all the new fields (backward compatibility)
      const defaultSettings = {
        autoAnalyze: true,
        notifyLowTrust: true,
        rememberHistory: true,
        preferredTheme: 'system',
        badgePosition: 'top-right',
      };
      
      // Check if any new setting is missing
      const updatedSettings = { ...defaultSettings, ...result.settings };
      
      // Only update if there are differences
      if (JSON.stringify(updatedSettings) !== JSON.stringify(result.settings)) {
        chrome.storage.local.set({ settings: updatedSettings });
        console.log("TruthLens: Updated settings with new defaults");
      }
    }
  });

  // Create context menu items
  chrome.contextMenus.create({
    id: 'truthlens-settings',
    title: 'TruthLens Settings',
    contexts: ['action']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'truthlens-settings') {
    openSettingsPage();
  }
});

// Handle tab updates to reset the badge when navigating away from analyzed pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // If we have analysis data, check if it's for the current URL
    if (currentAnalysis && currentAnalysis.url) {
      // If URLs don't match, clear the badge
      if (tab.url !== currentAnalysis.url) {
        chrome.action.setBadgeText({ text: '' });
      }
    }
  }
}); 