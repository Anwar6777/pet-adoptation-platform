import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import BrowsePetsPage from './pages/public/BrowsePetsPage';
import AuthPage from './pages/public/AuthPage';
import HomePage from './pages/public/HomePage';
import InfoPage from './pages/public/InfoPage';
import PetDetailsPage from './pages/public/PetDetailsPage';
import MyRequestsPage from './pages/user/MyRequestsPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserProfilePage from './pages/user/UserProfilePage';
import AdminLayout from './layouts/AdminLayout';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminPetsPage from './pages/admin/AdminPetsPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return <Routes><Route element={<MainLayout />}><Route path="/" element={<HomePage />} /><Route path="/pets" element={<BrowsePetsPage />} /><Route path="/pets/:id" element={<PetDetailsPage />} /><Route path="/how-it-works" element={<InfoPage />} /><Route path="/about" element={<InfoPage />} /><Route path="/contact" element={<InfoPage />} /><Route path="/privacy" element={<InfoPage />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<UserDashboardPage />} /><Route path="/my-requests" element={<MyRequestsPage />} /><Route path="/profile" element={<UserProfilePage />} /></Route><Route element={<ProtectedRoute adminOnly />}><Route path="/admin" element={<AdminLayout />}><Route index element={<AdminOverviewPage />} /><Route path="pets" element={<AdminPetsPage />} /><Route path="requests" element={<AdminRequestsPage />} /><Route path="users" element={<AdminUsersPage />} /><Route path="profile" element={<UserProfilePage />} /></Route></Route><Route path="*" element={<InfoPage />} /></Route><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage />} /></Routes>;
}

export default App;
