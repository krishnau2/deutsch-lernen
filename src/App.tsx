import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ConjugationPage from './pages/ConjugationPage';
import ArticlesPage from './pages/ArticlesPage';

function AppShell() {
  const [activeCategory, setActiveCategory] = useState('obst-gemuese');

  return (
    <div className="app-shell">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <Routes>
        <Route path="/" element={<ConjugationPage />} />
        <Route
          path="/articles"
          element={
            <ArticlesPage
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
