import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NavigationPage } from './pages/NavigationPage';
import { HomePage } from './pages/HomePage';

/**
 * EXOA — Indoor Emergency Navigation Application
 *
 * Routes:
 * - /              → Home page with scanning instructions
 * - /nav?node=X    → Navigation view with route rendering
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nav" element={<NavigationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
