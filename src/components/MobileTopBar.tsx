import { NavLink } from 'react-router-dom';

export default function MobileTopBar() {
  return (
    <div className="mobile-top-bar">
      <div className="mobile-logo">
        <div className="logo-icon"><span>DE</span></div>
        <span className="logo-text">Deutsch Lernen</span>
      </div>
      <div className="mobile-nav-tabs">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
        >
          Verben
        </NavLink>
        <NavLink
          to="/articles"
          className={({ isActive }) => `mobile-nav-tab${isActive ? ' active' : ''}`}
        >
          Artikel
        </NavLink>
      </div>
    </div>
  );
}
