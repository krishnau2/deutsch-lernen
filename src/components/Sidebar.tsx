import { NavLink, useLocation } from 'react-router-dom';
import {
  IconVocabulary, IconBook2, IconSchool,
  IconApple, IconBuilding, IconShirt,
  IconUsers, IconBriefcase, IconBus,
} from '@tabler/icons-react';

const VERB_FILTERS = [
  { label: 'Regular',   dotClass: 'dot-regular' },
  { label: 'Irregular', dotClass: 'dot-irregular' },
  { label: 'Trennbar',  dotClass: 'dot-trennbar' },
];

const NOUN_CATEGORIES = [
  { id: 'obst-gemuese', label: 'Obst & Gemüse', icon: <IconApple size={15} /> },
  { id: 'wohnung',      label: 'Wohnung',        icon: <IconBuilding size={15} /> },
  { id: 'kleidung',     label: 'Kleidung',        icon: <IconShirt size={15} /> },
  { id: 'familie',      label: 'Familie',         icon: <IconUsers size={15} /> },
  { id: 'berufe',       label: 'Berufe',          icon: <IconBriefcase size={15} /> },
  { id: 'verkehr',      label: 'Verkehr',         icon: <IconBus size={15} /> },
  { id: 'schule',       label: 'Schule',          icon: <IconSchool size={15} /> },
];

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  const location = useLocation();
  const isArticles = location.pathname === '/articles';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><span>DE</span></div>
        <div>
          <div className="logo-text">Deutsch Lernen</div>
          <div className="logo-sub">A1.1 · Schritte Plus Neu</div>
        </div>
      </div>

      <NavLink to="/"        className={({ isActive }) => `nav-item ${isActive && !isArticles ? 'active' : ''}`}>
        <IconVocabulary size={18} /> Conjugation
      </NavLink>
      <NavLink to="/articles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <IconBook2 size={18} /> Articles
      </NavLink>

      <div className="sidebar-divider" />

      {!isArticles ? (
        <>
          <div className="nav-label">Verb types</div>
          {VERB_FILTERS.map(f => (
            <div key={f.label} className="filter-item">
              <span className={`badge-dot ${f.dotClass}`} />
              {f.label}
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="nav-label">Categories</div>
          {NOUN_CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className={`cat-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.icon} {cat.label}
            </div>
          ))}
        </>
      )}
    </aside>
  );
}
