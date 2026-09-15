"""
RAG (Retrieval Augmented Generation) for local rules.
"""
import logging
import re
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class RuleFile:
    """Represents a rules markdown file."""
    name: str
    path: str
    keywords: list[str]
    content: str

    def get_relevance_score(self, query: str) -> float:
        """Calculate relevance score for a query."""
        score = 0
        query_lower = query.lower()

        # Check keyword matches
        for keyword in self.keywords:
            if keyword.lower() in query_lower:
                score += 10

        # Check content matches
        words = query_lower.split()
        for word in words:
            if len(word) > 3 and word in self.content.lower():
                score += 2

        return score

class LocalRAG:
    """Local RAG system for querying rules."""

    RULES_DIR = Path(__file__).parent.parent / 'rules'

    def __init__(self):
        self.rules: dict[str, RuleFile] = {}
        self._load_rules()

    def _load_rules(self):
        """Load all markdown rules from the rules directory."""
        if not self.RULES_DIR.exists():
            logger.warning(f"Rules directory not found: {self.RULES_DIR}")
            return

        for md_file in self.RULES_DIR.glob('*.md'):
            try:
                content = md_file.read_text(encoding='utf-8')
                keywords = self._extract_keywords(content)
                self.rules[md_file.stem] = RuleFile(
                    name=md_file.stem,
                    path=str(md_file),
                    keywords=keywords,
                    content=content
                )
                logger.info(f"Loaded rules: {md_file.stem}")
            except Exception as e:
                logger.error(f"Failed to load {md_file}: {e}")

    def _extract_keywords(self, content: str) -> list[str]:
        """Extract keywords from markdown content."""
        keywords = []

        # Extract all # headers
        headers = re.findall(r'^#\s+(.+)$', content, re.MULTILINE)
        keywords.extend([h.strip().lower() for h in headers if len(h) > 3])

        # Extract all ## headers
        subheaders = re.findall(r'^##\s+(.+)$', content, re.MULTILINE)
        keywords.extend([h.strip().lower() for h in subheaders if len(h) > 3])

        # Extract key terms (words with 4+ chars that appear frequently)
        words = re.findall(r'\b\w{4,}\b', content.lower())
        word_counts = {}
        for word in words:
            # Remove common stopwords
            if word not in ('the', 'and', 'for', 'with', 'this', 'that', 'from',
                           'have', 'what', 'when', 'where', 'which', 'while',
                           'about', 'these', 'their', 'there', 'their', 'they',
                           'their', 'would', 'could', 'should', 'those', 'than',
                           'then', 'into', 'over', 'such', 'only', 'also', 'are',
                           'was', 'but', 'not', 'all', 'any', 'can', 'had', 'has',
                           'how', 'may', 'new', 'now', 'old', 'see', 'too', 'use',
                           'via', 'why', 'yes', 'yet', 'get', 'got', 'its', 'let',
                           'one', 'our', 'out', 'say', 'she', 'yet', 'you'):
                word_counts[word] = word_counts.get(word, 0) + 1

        # Take top keywords by frequency
        sorted_keywords = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
        keywords.extend([word for word, count in sorted_keywords[:20]])

        return list(set(keywords))  # Remove duplicates

    def search(self, query: str, top_k: int = 3) -> list[RuleFile]:
        """Search for relevant rules."""
        if not self.rules:
            return []

        # Calculate relevance scores
        scored_rules = []
        for rule in self.rules.values():
            score = rule.get_relevance_score(query)
            if score > 0:
                scored_rules.append((score, rule))

        # Sort by score and return top_k
        scored_rules.sort(key=lambda x: x[0], reverse=True)
        return [rule for score, rule in scored_rules[:top_k]]

    def get_context(self, query: str, max_tokens: int = 2000) -> str:
        """Get relevant context for a query."""
        rules = self.search(query)

        if not rules:
            return ""

        context_parts = []
        total_tokens = 0

        for rule in rules:
            # Count approximate tokens (rough estimate: 4 chars per token)
            rule_tokens = len(rule.content) // 4
            if total_tokens + rule_tokens > max_tokens:
                break

            context_parts.append(f"## {rule.name}\n\n{rule.content[:500]}...")
            total_tokens += rule_tokens

        return "\n\n---\n\n".join(context_parts)

    def get_all_rules(self) -> list[str]:
        """Get all rule names."""
        return [rule.name for rule in self.rules.values()]

    def reload(self):
        """Reload all rules from disk."""
        self.rules.clear()
        self._load_rules()
        logger.info("Rules reloaded")


# Singleton instance
_rag_instance: LocalRAG | None = None

def get_rag() -> LocalRAG:
    """Get or create RAG instance."""
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = LocalRAG()
    return _rag_instance
