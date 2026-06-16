import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://blog-api-service-fbnq.onrender.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Injecte automatiquement le token Bearer dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion globale des erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Article {
  id: number;
  title: string;
  short_description: string;
  content: string;
  image: string | null;
  user_id: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  category?: { id: number; name: string } | null;
  user?: { id: number; name: string } | null;
}

export interface Comment {
  id: number;
  visitor_name: string;
  visitor_email: string;
  message: string;
  article_id: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface DashboardStats {
  stats: {
    total_articles: number;
    total_users: number;
    total_comments: number;
  };
  latest_articles: Article[];
}

// ─── Services Articles ────────────────────────────────────────────────────────

export const articleService = {
  // Liste paginée avec recherche optionnelle
  getAll: (page = 1, search?: string) => {
    const params: Record<string, string | number> = { page };
    if (search) params.search = search;
    return api.get<PaginatedResponse<Article>>('/articles', { params });
  },

  // Détail d'un article
  getOne: (id: number | string) =>
    api.get<Article>(`/articles/${id}`),

  // Créer un article (multipart pour l'image)
  create: (formData: FormData) =>
    api.post<{ message: string; article: Article }>('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Modifier un article
  update: (id: number, formData: FormData) => {
    formData.append('_method', 'PUT');
    return api.post<{ message: string; article: Article }>(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Supprimer un article
  delete: (id: number) =>
    api.delete<{ message: string }>(`/articles/${id}`),
};

// ─── Services Commentaires ────────────────────────────────────────────────────

export const commentService = {
  // Poster un commentaire (route protégée par auth:sanctum)
  create: (data: { visitor_name: string; visitor_email: string; message: string; article_id: number }) =>
    api.post<{ message: string; comment: Comment }>('/comments', data),

  // Supprimer un commentaire
  delete: (id: number) =>
    api.delete<{ message: string }>(`/comments/${id}`),
};

// ─── Services Auth ────────────────────────────────────────────────────────────

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ message: string; user: User; access_token: string; token_type: string }>('/login', {
      email,
      password,
    }),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api.post<{ message: string; user: User; access_token: string; token_type: string }>('/register', {
      name,
      email,
      password,
      password_confirmation,
    }),

  logout: () =>
    api.post<{ message: string }>('/logout'),
};

// ─── Service Dashboard ────────────────────────────────────────────────────────

export const dashboardService = {
  getStats: () =>
    api.get<DashboardStats>('/dashboard'),
};
