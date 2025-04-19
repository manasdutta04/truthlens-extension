from pydantic import BaseModel
from typing import List, Optional

class SourceReference(BaseModel):
    url: str
    title: str
    publisher: Optional[str] = None
    matchScore: float

class ArticleData(BaseModel):
    title: str
    content: str
    url: str
    timestamp: Optional[int] = None

class AnalysisResult(BaseModel):
    credibilityScore: float  # 0.0 to 1.0
    sentiment: str  # 'positive', 'negative', 'neutral'
    biasTags: List[str]
    sources: List[SourceReference]
    trustLevel: str  # 'high', 'medium', 'low'
    explanation: Optional[str] = None 