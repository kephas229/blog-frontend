import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

import { Home } from '../pages/public/Home';
import { ArticleDetail } from '../pages/public/ArticleDetail';
import { SearchResults } from '../pages/public/SearchResults';
import { NotFound } from '../pages/public/NotFound';

import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

import { Dashboard } from '../pages/admin/Dashboard';
import { Articles } from '../pages/admin/Articles';
import { CreateArticle } from '../pages/admin/CreateArticle';
import { Comments } from '../pages/admin/Comments';
import { Analytics } from '../pages/admin/Analytics';
import { Media } from '../pages/admin/Media';
import { Settings } from '../pages/admin/Settings';
import { Users } from '../pages/admin/Users';
import { Profile } from '../pages/admin/Profile';

const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/articles" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        {/* Redirect /admin vers dashboard (admin) ou articles (author) */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        {/* Accessible à tous les utilisateurs connectés */}
        <Route path="articles"        element={<Articles />} />
        <Route path="articles/create" element={<CreateArticle />} />
        <Route path="profile"         element={<Profile />} />

        {/* Réservé aux admins */}
        <Route path="dashboard"  element={<AdminOnly><Dashboard /></AdminOnly>} />
        <Route path="comments"   element={<AdminOnly><Comments /></AdminOnly>} />
        <Route path="analytics"  element={<AdminOnly><Analytics /></AdminOnly>} />
        <Route path="media"      element={<AdminOnly><Media /></AdminOnly>} />
        <Route path="settings"   element={<AdminOnly><Settings /></AdminOnly>} />
        <Route path="users"      element={<AdminOnly><Users /></AdminOnly>} />
      </Route>
    </Routes>
  );
};
