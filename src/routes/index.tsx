import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { Home } from '../pages/public/Home';
import { ArticleDetail } from '../pages/public/ArticleDetail';
import { SearchResults } from '../pages/public/SearchResults';
import { NotFound } from '../pages/public/NotFound';
import { ComingSoon } from '../pages/public/ComingSoon';

import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

import { Dashboard } from '../pages/admin/Dashboard';
import { Articles } from '../pages/admin/Articles';
import { CreateArticle } from '../pages/admin/CreateArticle';
import { Comments } from '../pages/admin/Comments';
import { Analytics } from '../pages/admin/Analytics';
import { Media } from '../pages/admin/Media';
import { Settings } from '../pages/admin/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        
        {/* Placeholder Routes for Navbar items */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/create" element={<CreateArticle />} />
        <Route path="comments" element={<Comments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="media" element={<Media />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
