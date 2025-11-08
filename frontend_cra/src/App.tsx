import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MusicPage from './pages/MusicPage';
import VideosPage from './pages/VideosPage';
import TourPage from './pages/TourPage';
import MerchPage from './pages/MerchPage';
import SubscribePage from './pages/SubscribePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminHeroPage from './pages/admin/AdminHeroPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminMusicPage from './pages/admin/AdminMusicPage';
import AdminVideosPage from './pages/admin/AdminVideosPage';
import AdminTourPage from './pages/admin/AdminTourPage';
import AdminMerchPage from './pages/admin/AdminMerchPage';
import AdminSubscribersPage from './pages/admin/AdminSubscribersPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

const App = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="tour" element={<TourPage />} />
        <Route path="merch" element={<MerchPage />} />
        <Route path="subscribe" element={<SubscribePage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="hero" element={<AdminHeroPage />} />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="music" element={<AdminMusicPage />} />
          <Route path="videos" element={<AdminVideosPage />} />
          <Route path="tour" element={<AdminTourPage />} />
          <Route path="merch" element={<AdminMerchPage />} />
          <Route path="subscribers" element={<AdminSubscribersPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
