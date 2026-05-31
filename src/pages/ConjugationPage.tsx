import { useState, useMemo, useRef, useEffect } from 'react';
import {
  IconSearch, IconTable, IconLayoutGrid,
  IconArrowsSplit, IconInfoCircle,
} from '@tabler/icons-react';
import verbsData from '../data/verbs.json';
import type { Verb } from '../types';
import ConjugationTable from '../components/ConjugationTable';
import ConjugationCards from '../components/ConjugationCards';

const verbs = verbsData as Verb[];

const TABS = [
  { id: 'all',        label: 'All verbs' },
  { id: 'sein-haben', label: 'sein / haben' },
  { id: 'common-a1',  label: 'Common A1 verbs' },
  { id: 'modal',      label: 'Modal verbs' },
  { id: 'movement',   label: 'Movement' },
  { id: 'daily-life', label: 'Daily life' },
];

export default function ConjugationPage() {
  const [query, setQuery]           = useState('');
  const [selectedVerb, setSelected] = useState<Verb>(verbs[0]);
  const [activeTab, setActiveTab]   = useState('all');
  const [viewMode, setViewMode]     = useState<'table' | 'cards'>('table');
  const [showDropdown, setShowDrop] = useState(false);
  const [highlightIdx, setHighIdx]  = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filtered suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return verbs.filter(v =>
      v.infinitive.toLowerCase().includes(q) ||
      v.english.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  // Tab-filtered verb list (for quick selection — not shown in UI but used by tab)
  const tabVerbs = useMemo(() =>
    activeTab === 'all' ? verbs : verbs.filter(v => v.category === activeTab),
    [activeTab]
  );

  // Select first verb of tab when tab changes
  useEffect(() => {
    if (tabVerbs.length > 0) setSelected(tabVerbs[0]);
  }, [activeTab]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (verb: Verb) => {
    setSelected(verb);
    setQuery('');
    setShowDrop(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); handleSelect(suggestions[highlightIdx]); }
    if (e.key === 'Escape')    { setShowDrop(false); }
  };

  const verb = selectedVerb;

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
              placeholder="Search a verb, e.g. sprechen…"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDrop(true); setHighIdx(0); }}
              onFocus={() => { if (query) setShowDrop(true); }}
              onKeyDown={handleKeyDown}
            />
            {showDropdown && suggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {suggestions.map((v, i) => (
                  <div
                    key={v.id}
                    className={`autocomplete-item ${i === highlightIdx ? 'highlighted' : ''}`}
                    onMouseDown={() => handleSelect(v)}
                  >
                    <span className="ac-verb">{v.infinitive}</span>
                    <span className="ac-eng">{v.english}</span>
                    <span className={`type-tag ${v.type}`}>{v.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Frequency tabs */}
        <div className="tab-bar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="page-content">
        {/* Verb header */}
        <div className="verb-header">
          <div style={{ flex: 1 }}>
            <div className="verb-title">{verb.infinitive}</div>
            <div className="verb-eng">{verb.english}</div>
            <div className="verb-tags">
              <span className={`type-tag ${verb.type}`}>{verb.type}</span>
              {verb.stemNote && (
                <span className="stem-note">
                  {verb.stemNote.split('→').map((part, i, arr) =>
                    i < arr.length - 1
                      ? <span key={i}>{part.trim()} → </span>
                      : <b key={i}>{part.trim()}</b>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="legend">
          {verb.type === 'irregular' && (
            <>
              <span className="legend-item">
                <span className="legend-swatch ls-vowel">e→i</span>
                <span>Vowel change</span>
              </span>
              <span className="legend-item">
                <span className="legend-swatch ls-ending">–st</span>
                <span>Regular ending</span>
              </span>
              <span className="legend-irr-note">
                <span className="irr-dot" />
                Gray row = irregular form
              </span>
            </>
          )}
          {verb.type === 'trennbar' && (
            <span className="legend-item">
              <span className="legend-swatch ls-trenn">/</span>
              <span>Trennbar split — prefix separates to end</span>
            </span>
          )}
          {verb.type === 'regular' && (
            <>
              <span className="legend-item">
                <span className="legend-swatch ls-ending">–e / –st / –t</span>
                <span>Regular endings</span>
              </span>
              <span className="legend-item" style={{ color: 'var(--text-hint)', fontSize: 12 }}>
                <IconInfoCircle size={14} />
                Regular verb — stem stays the same for all subjects
              </span>
            </>
          )}
        </div>

        {/* View toggle */}
        <div className="view-toggle">
          <span className="vt-label">View:</span>
          <button className={`vt-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
            <IconTable size={14} /> Table
          </button>
          <button className={`vt-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>
            <IconLayoutGrid size={14} /> Cards
          </button>
        </div>

        {/* Conjugation display */}
        {viewMode === 'table'
          ? <ConjugationTable verb={verb} />
          : <ConjugationCards verb={verb} />
        }

        {/* Trennbar tip */}
        {verb.type === 'trennbar' && verb.trennbarInfo && (
          <div className="trennbar-tip">
            <IconArrowsSplit size={18} />
            <div>
              <div>
                <b>Trennbar verb:</b> The prefix <b>„{verb.trennbarInfo.prefix}–"</b> detaches
                and moves to the <b>end</b> of the sentence.
              </div>
              <div className="trennbar-example">
                {verb.trennbarInfo.splitExample}
                <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>
                  — {verb.trennbarInfo.splitTranslation}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab verb list — quick-pick row */}
        {tabVerbs.length > 1 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-heading" style={{ marginBottom: 8 }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tabVerbs.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 99,
                    border: `1px solid ${v.id === verb.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: v.id === verb.id ? 'var(--accent-light)' : 'white',
                    color: v.id === verb.id ? 'var(--accent-dark)' : 'var(--text-secondary)',
                    fontWeight: v.id === verb.id ? 600 : 400,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-main)',
                  }}
                >
                  {v.infinitive}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
