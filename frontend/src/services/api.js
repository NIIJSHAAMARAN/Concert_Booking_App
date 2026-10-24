import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth  (matches POST /api/auth/register  POST /api/auth/login  GET /api/auth/me)
export const authAPI = {
  register: (data)           => api.post('/auth/register', data),
  login:    (data)           => api.post('/auth/login', data),
  getMe:    ()               => api.get('/auth/me'),
  createAdmin: (data)        => api.post('/auth/create-admin', data),
};

// ── Concerts  (matches GET/POST/PUT/DELETE /api/concerts)
export const concertAPI = {
  getAll:  (params)          => api.get('/concerts', { params }),
  getOne:  (id)              => api.get(`/concerts/${id}`),
  create:  (data)            => api.post('/concerts', data),
  update:  (id, data)        => api.put(`/concerts/${id}`, data),
  remove:  (id)              => api.delete(`/concerts/${id}`),
};

// ── Bookings  (matches POST /api/bookings  GET /api/bookings/my-bookings  etc.)
export const bookingAPI = {
  book:          (data)      => api.post('/bookings', data),
  getMyBookings: (params)    => api.get('/bookings/my-bookings', { params }),
  getOne:        (id)        => api.get(`/bookings/${id}`),
  cancel:        (id)        => api.put(`/bookings/${id}/cancel`),
  getAllAdmin:    (params)    => api.get('/bookings', { params }),
};

export default api;