import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MenuPage from './pages/MenuPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(18,18,18,0.95)',
            color: '#F5F5F5',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.88rem',
            direction: 'rtl',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#FF8C00', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/"       element={<MenuPage />} />
        <Route path="/menu"   element={<MenuPage />} />
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
