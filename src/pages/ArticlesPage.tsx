import { useState, useMemo, useRef, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';
import nounsData from '../data/nouns.json';
import type { Noun, ArticleType } from '../types';

const nouns = nounsData as Noun[];

const CATEGORY_LABELS: Record<string, string> = {
  'obst-gemuese': 'Obst & Gemüse',
  'wohnung':      'Wohnung',
  'kleidung':     'Kleidung',
  'familie':      'Familie',
  'berufe':       'Berufe',
  'verkehr':      'Verkehr',
  'schule':       'Schule',
};

interface Props {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function ArticlesPage({ activeCategory, onCategoryChange: _onCategoryChange }: Props) {
  const [query, setQuery]                 = useState('');
  const [articleFilter, setArticleFilter] = useState<ArticleType | 'all'>('all');
  const [showDropdown, setShowDropdown]   = useState(false);
  const [highlightIdx, setHighIdx]        = useState(0);
  const [selectedNoun, setSelectedNoun]   = useState<Noun | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return nouns.filter(n =>
      n.german.toLowerCase().includes(q) ||
      n.english.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  // Search result for desktop banner (live from query)
  const searchResult = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();
    return nouns.find(n =>
      n.german.toLowerCase().startsWith(q) ||
      n.english.toLowerCase().startsWith(q)
    ) ?? null;
  }, [query]);

  // Nouns to display in the desktop grid
  const displayNouns = useMemo(() => {
    let list = activeCategory === 'all'
      ? nouns
      : nouns.filter(n => n.category === activeCategory);

    if (articleFilter !== 'all') {
      list = list.filter(n => n.article === articleFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(n =>
        n.german.toLowerCase().includes(q) ||
        n.english.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategory, articleFilter, query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (noun: Noun) => {
    setSelectedNoun(noun);
    setQuery('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); handleSelect(suggestions[highlightIdx]); }
    if (e.key === 'Escape')    { setShowDropdown(false); }
  };

  const abClass: Record<ArticleType, string> = {
    der: 'ab-der', die: 'ab-die', das: 'ab-das',
  };
  const baClass: Record<ArticleType, string> = {
    der: 'ba-der', die: 'ba-die', das: 'ba-das',
  };

  const toggleArticle = (art: ArticleType) => {
    setArticleFilter(prev => prev === art ? 'all' : art);
  };

  return (
    <div className="main-panel">
      {/* Top bar */}
      <div className="top-bar">
        <div className="search-row">
          <div className="search-wrap" ref={searchRef}>
            <IconSearch size={16} />
            <input
              className="search-input"
              type="text"
              placeholder="Search a noun, e.g. Tisch, apple…"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedNoun(null);
                setShowDropdown(true);
                setHighIdx(0);
              }}
              onFocus={() => { if (query) setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
            />
            {showDropdown && suggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {suggestions.map((n, i) => (
                  <div
                    key={n.id}
                    className={`autocomplete-item ${i === highlightIdx ? 'highlighted' : ''}`}
                    onMouseDown={() => handleSelect(n)}
                  >
                    <span className="ac-verb">{n.german}</span>
                    <span className="ac-eng">{n.english}</span>
                    <span className={`article-badge ${abClass[n.article]}`}>{n.article}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article filter tabs (desktop) */}
        <div className="tab-bar">
          {(['all', 'der', 'die', 'das'] as const).map(art => (
            <button
              key={art}
              className={`tab-btn ${articleFilter === art ? 'active' : ''}`}
              onClick={() => setArticleFilter(art)}
            >
              {art === 'all' ? 'All' : art === 'der' ? 'der (m)' : art === 'die' ? 'die (f)' : 'das (n)'}
            </button>
          ))}
        </div>
      </div>

      <div className="page-content">
        {/* Desktop: search result banner */}
        {searchResult && (
          <div className="article-search-result">
            <div className={`big-article ${baClass[searchResult.article]}`}>
              {searchResult.article}
            </div>
            <div>
              <div className="result-noun">{searchResult.german}</div>
              <div className="result-eng">{searchResult.english}</div>
              <div className="result-meta">
                Plural: {searchResult.plural} &nbsp;·&nbsp;
                Category: {CATEGORY_LABELS[searchResult.category] ?? searchResult.category}
              </div>
            </div>
          </div>
        )}

        {/* Mobile: selected noun result card */}
        {selectedNoun && (
          <div className="mobile-noun-result">
            <div className={`big-article ${baClass[selectedNoun.article]}`}>
              {selectedNoun.article}
            </div>
            <div className="result-noun">{selectedNoun.german}</div>
            <div className="result-eng">{selectedNoun.english}</div>
            <div className="result-meta">Pl: {selectedNoun.plural}</div>
          </div>
        )}

        {/* Article legend / filter pills (desktop) */}
        <div className="article-legend">
          {(['der', 'die', 'das'] as ArticleType[]).map(art => (
            <button
              key={art}
              className={`art-filter-btn ${articleFilter === art ? `active-${art}` : ''}`}
              onClick={() => toggleArticle(art)}
            >
              {art}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'inherit', opacity: 0.75 }}>
                {art === 'der' ? 'masculine' : art === 'die' ? 'feminine' : 'neuter'}
              </span>
            </button>
          ))}
        </div>

        {/* Desktop: noun grid */}
        {displayNouns.length === 0 ? (
          <div className="empty-state">
            <IconSearch size={40} style={{ color: '#BDBDBD', marginBottom: 12 }} />
            <p>No nouns found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="section-heading">
              {activeCategory === 'all'
                ? 'All categories'
                : CATEGORY_LABELS[activeCategory]}
              <span style={{ fontWeight: 400, color: 'var(--text-hint)' }}>
                &nbsp;({displayNouns.length})
              </span>
            </div>
            <div className="noun-grid">
              {displayNouns.map(noun => (
                <div key={noun.id} className="noun-card">
                  <span className={`article-badge ${abClass[noun.article]}`}>
                    {noun.article}
                  </span>
                  <div>
                    <div className="noun-de">{noun.german}</div>
                    <div className="noun-en">{noun.english}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
