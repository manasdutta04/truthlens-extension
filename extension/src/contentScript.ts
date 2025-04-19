import './styles.css';
// Import config directly
import config from './utils/config';

// Type definitions
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

// Check if we're running in a Chrome extension context
const isExtensionContext = (): boolean => {
  return typeof chrome !== 'undefined' && 
         typeof chrome.runtime !== 'undefined' && 
         typeof chrome.runtime.sendMessage !== 'undefined';
};

// Safe wrapper for Chrome sendMessage
const safeSendMessage = (message: any, callback?: (response: any) => void): void => {
  if (isExtensionContext()) {
    try {
      if (callback) {
        chrome.runtime.sendMessage(message, callback);
      } else {
        chrome.runtime.sendMessage(message);
      }
    } catch (err) {
      console.error('TruthLens: Error sending message to extension', err);
    }
  } else {
    console.warn('TruthLens: Not running in extension context, cannot send message', message);
  }
};

// DOM manipulation utilities
function extractArticleContent(): ArticleData {
  try {
    console.log("TruthLens: Extracting article content...");
    
    // Get the page URL
    const url = window.location.href;
    
    // Get the article title
    let title = "";
    const titleElement = document.querySelector('h1');
    if (titleElement) {
      title = titleElement.textContent?.trim() || "";
    }
    
    if (!title) {
      // Try to get title from meta tags if H1 is not available
      const metaTitleElement = document.querySelector('meta[property="og:title"]');
      if (metaTitleElement) {
        title = metaTitleElement.getAttribute('content') || "";
      }
    }
    
    // If still no title, use document title
    if (!title) {
      title = document.title;
    }
    
    console.log("TruthLens: Extracted title:", title);
    
    // Get article content
    // This is a simplified approach; you might need to customize this for different news sites
    let content = "";
    
    // Try to find article by common selectors
    const articleSelectors = [
      'article',
      '[role="article"]',
      '.article-content',
      '.article-body',
      '.story-body',
      '.story-content',
      '.news-content',
      '.post-content',
      'main'
    ];
    
    let articleElement: Element | null = null;
    
    for (const selector of articleSelectors) {
      articleElement = document.querySelector(selector);
      if (articleElement) {
        console.log(`TruthLens: Found article using selector "${selector}"`);
        break;
      }
    }
    
    if (articleElement) {
      // Extract paragraphs from the article element
      const paragraphs = articleElement.querySelectorAll('p');
      content = Array.from(paragraphs)
        .map(p => p.textContent)
        .filter(text => text && text.trim().length > 0)
        .join('\n\n');
    } else {
      // Fallback: get all paragraphs
      console.log("TruthLens: Couldn't find article element, falling back to all paragraphs");
      const paragraphs = document.querySelectorAll('p');
      content = Array.from(paragraphs)
        .map(p => p.textContent)
        .filter(text => text && text.trim().length > 0)
        .join('\n\n');
    }
    
    console.log(`TruthLens: Extracted content length: ${content.length} characters`);
    
    if (content.length < 50) {
      console.warn("TruthLens: Extracted content is very short, might not be a news article");
    }
    
    return {
      title,
      content,
      url
    };
  } catch (error) {
    console.error("TruthLens: Error extracting article content", error);
    // Return basic info even if extraction partially fails
    return {
      title: document.title,
      content: "Error extracting content: " + (error instanceof Error ? error.message : String(error)),
      url: window.location.href
    };
  }
}

// Create and inject the floating badge
function createFloatingBadge() {
  const badge = document.createElement('div');
  badge.id = 'truthlens-badge';
  
  // First set a default position
  let positionClasses = 'top-4 right-4';
  
  // Try to get position from settings
  if (isExtensionContext()) {
    chrome.storage.local.get('settings', (result) => {
      if (result.settings && result.settings.badgePosition) {
        // Check if we should show the badge at all
        if (result.settings.badgePosition === 'none') {
          badge.style.display = 'none';
        } else {
          // Apply the correct position based on settings
          const position = result.settings.badgePosition;
          switch (position) {
            case 'top-right':
              positionClasses = 'top-4 right-4';
              break;
            case 'top-left':
              positionClasses = 'top-4 left-4';
              break;
            case 'bottom-right':
              positionClasses = 'bottom-4 right-4';
              break;
            case 'bottom-left':
              positionClasses = 'bottom-4 left-4';
              break;
            default:
              positionClasses = 'top-4 right-4'; // Default fallback
          }
          
          // Update badge classes
          badge.className = `truthlens-container fixed ${positionClasses} z-50 flex items-center gap-2`;
        }
      }
    });
  }
  
  // Set initial classes with default position
  badge.classList.add('truthlens-container', 'fixed', 'z-50', 'flex', 'items-center', 'gap-2');
  
  // Apply default position classes
  const positionClassList = positionClasses.split(' ');
  positionClassList.forEach(cls => badge.classList.add(cls));
  
  badge.innerHTML = `
    <div class="animate-pulse">
      <svg class="w-5 h-5 text-truthlens-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <span>Analyzing...</span>
  `;
  
  document.body.appendChild(badge);
  return badge;
}

// Update the badge with analysis results
function updateBadgeWithResult(badge: HTMLElement, result: AnalysisResult) {
  let badgeClass = '';
  let badgeIcon = '';
  let badgeText = '';
  
  // Clear any animation
  badge.classList.remove('animate-pulse');
  
  switch (result.trustLevel) {
    case 'high':
      badgeClass = 'badge-success';
      badgeIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`;
      badgeText = 'High Trust';
      break;
    case 'medium':
      badgeClass = 'badge-warning';
      badgeIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>`;
      badgeText = 'Medium Trust';
      break;
    case 'low':
      badgeClass = 'badge-danger';
      badgeIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`;
      badgeText = 'Low Trust';
      break;
  }
  
  // Get the current position classes
  const currentClassList = badge.className.split(' ');
  const positionClasses = currentClassList.filter(cls => 
    ['top-4', 'right-4', 'bottom-4', 'left-4'].includes(cls)
  ).join(' ');
  
  // Apply position and result classes
  badge.className = `truthlens-container fixed ${positionClasses} z-50 flex items-center gap-2 ${badgeClass}`;
  badge.innerHTML = `
    <div>${badgeIcon}</div>
    <span>${badgeText}</span>
  `;
  
  // Make badge clickable to open extension popup
  badge.style.cursor = 'pointer';
  badge.addEventListener('click', () => {
    safeSendMessage({ action: 'openPopup' });
  });
}

// Send article data to backend for analysis
async function analyzeArticle(articleData: ArticleData): Promise<AnalysisResult> {
  try {
    console.log("TruthLens: Analyzing article...", articleData);
    
    // Use the directly imported config instead of dynamic import
    const apiUrl = config.apiUrl;
    console.log(`TruthLens: Using API URL: ${apiUrl}`);
    
    // Make the API request
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TruthLens: API error (${response.status})`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log("TruthLens: Analysis result:", result);
    
    // Check if the result has the expected format
    if (!result.credibilityScore || !result.trustLevel) {
      console.error("TruthLens: Invalid response format", result);
      throw new Error("Invalid response format from API");
    }
    
    return result;
  } catch (error) {
    console.error("TruthLens: Error analyzing article", error);
    
    // For now, return a simulated result for demonstration
    // In production, you'd want to handle this differently
    return {
      credibilityScore: 0.5,
      sentiment: "neutral",
      biasTags: ["error"],
      sources: [],
      trustLevel: "medium"
    };
  }
}

// Main execution
(async function main() {
  try {
    console.log("TruthLens: Content script running on", window.location.href);
    
    // Check if extension APIs are available
    if (!isExtensionContext()) {
      console.warn("TruthLens: Not running in extension context. Chrome extension APIs unavailable.");
    } else {
      console.log("TruthLens: Extension context verified, chrome.runtime.sendMessage available");
    }
    
    console.log("TruthLens: Config loaded:", config);
    
    // Check if this is a news article page
    // This is a simplified check; you might want to add more criteria
    if (document.querySelector('article') || 
        document.querySelector('[role="article"]') ||
        document.querySelectorAll('p').length > 5) {
      
      console.log("TruthLens: Detected potential news article");
      
      // Wait for the page to fully load
      if (document.readyState !== 'complete') {
        console.log("TruthLens: Waiting for page to load completely...");
        await new Promise(resolve => window.addEventListener('load', resolve));
      }
      
      // Extract article content
      const articleData = extractArticleContent();
      
      // Create floating badge
      const badge = createFloatingBadge();
      
      // Analyze the article
      const result = await analyzeArticle(articleData);
      
      // Update the badge with the result
      updateBadgeWithResult(badge, result);
      
      // Send the result to the background script
      safeSendMessage({
        action: 'saveAnalysisResult',
        data: {
          url: articleData.url,
          result,
          articleData
        }
      }, response => {
        console.log("TruthLens: Background script response:", response);
      });
    } else {
      console.log("TruthLens: Not a news article, extension inactive");
    }
  } catch (error) {
    console.error("TruthLens: Error in main content script", error);
  }
})(); 