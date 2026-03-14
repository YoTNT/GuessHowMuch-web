import { useState } from 'react';
import type { NewsArticle } from '../types';
import { SentimentBadge } from './SentimentBadge';

interface NewsCardProps {
  articles: NewsArticle[];
}

function getSourceName(source: NewsArticle['source']): string {
  if (typeof source === 'string') return source;
  return source.name || 'Unknown';
}

function ArticleRow({ article, isLast }: { article: NewsArticle; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ padding: '12px 16px', borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ color: hovered ? 'var(--color-accent)' : 'var(--color-text)', textDecoration: 'none', fontSize: '13px', lineHeight: '1.4', flex: 1, transition: 'color 0.15s' }}
        >
          {article.title}
        </a>
        <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} />
      </div>
      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--color-muted)' }}>
        <span>{getSourceName(article.source)}</span>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export function NewsCard({ articles }: NewsCardProps) {
  if (articles.length === 0) {
    return (
      <div style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '4px', color: 'var(--color-muted)', fontSize: '12px' }}>
        no recent news found
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>recent news</span>
        <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>{articles.length} articles</span>
      </div>
      {articles.map((article, i) => (
        <ArticleRow key={article.id} article={article} isLast={i === articles.length - 1} />
      ))}
    </div>
  );
}
