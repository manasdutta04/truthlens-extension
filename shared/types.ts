// Article data structure
export interface ArticleData {
  title: string;
  content: string;
  url: string;
  timestamp?: number; // When the article was analyzed
}

// Analysis results
export interface AnalysisResult {
  credibilityScore: number; // 0.0 to 1.0
  sentiment: 'positive' | 'negative' | 'neutral';
  biasTags: string[]; // e.g., ['political', 'left-leaning', 'opinion']
  sources: SourceReference[];
  trustLevel: 'high' | 'medium' | 'low';
  explanation?: string;
}

// Source reference for cross-verification
export interface SourceReference {
  url: string;
  title: string;
  publisher?: string;
  matchScore: number; // How closely this source matches the article (0.0 to 1.0)
}

// Blockchain verification metadata
export interface BlockchainVerification {
  txHash: string; // Transaction hash on the blockchain
  timestamp: number;
  articleHash: string; // SHA-256 hash of the article content
  ipfsHash?: string; // IPFS hash where the full metadata is stored
  metadata: {
    url: string;
    title: string;
    credibilityScore: number;
    publisher?: string;
  };
}

// User report for feedback
export interface UserReport {
  articleUrl: string;
  reason: 'incorrect_analysis' | 'missed_context' | 'factual_error' | 'other';
  comment?: string;
  userReference?: string; // Optional user identifier or email
  timestamp: number;
}

// API response formats
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Settings for the extension
export interface ExtensionSettings {
  autoAnalyze: boolean;
  notifyLowTrust: boolean;
  rememberHistory: boolean;
  preferredTheme?: 'light' | 'dark' | 'system';
} 