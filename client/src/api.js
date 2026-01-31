const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const api = async (path, options = {}) => {
  const url = `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const { headers: optHeaders, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...optHeaders,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
};

export const userApi = {
  register: (body) => api('/api/user/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/api/user/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => api('/api/user/logout', { method: 'POST' }),
  getData: () => api('/api/user/data'),
  uploadProfileImage: (formData) => {
    const url = `${BASE_URL.replace(/\/$/, '')}/api/user/profile-image`;
    return fetch(url, { method: 'PATCH', credentials: 'include', body: formData }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Upload failed');
      return data;
    });
  },
  deleteProfileImage: () => api('/api/user/profile-image', { method: 'DELETE' }),
};

export const ownerApi = {
  changeRole: () => api('/api/owner/change-role', { method: 'POST' }),
  addCar: (formData) => {
    const url = `${BASE_URL.replace(/\/$/, '')}/api/owner/add-car`;
    return fetch(url, { method: 'POST', credentials: 'include', body: formData }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
      return data;
    });
  },
  getCars: () => api('/api/owner/cars'),
  getBookings: () => api('/api/owner/bookings'),
  getDashboard: () => api('/api/owner/dashboard'),
  deleteCar: (carId) => api('/api/owner/delete-car', { method: 'DELETE', body: JSON.stringify({ carId }) }),
  toggleCar: (carId) => api('/api/owner/toggle-car', { method: 'POST', body: JSON.stringify({ carId }) }),
};

export const carsApi = {
  getCars: () => api("/api/cars"),
  getCarById: (id) => api(`/api/cars/${id}`),
};

export const bookingApi = {
  checkAvailability: (body) => api('/api/booking/check-availability', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => api('/api/booking/my'),
  create: (body) => api('/api/booking/create', { method: 'POST', body: JSON.stringify(body) }),
  changeStatus: (bookingId, status) =>
    api('/api/booking/change-status', { method: 'PUT', body: JSON.stringify({ bookingId, status }) }),
};

export default api;
