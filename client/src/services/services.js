import API from './api';

// Auth Services
export const authService = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/users/profile', data)
};

// Event Services
export const eventService = {
  getEvents: (params) => API.get('/events', { params }),
  getEventById: (id) => API.get(`/events/${id}`),
  createEvent: (data) => API.post('/events', data),
  updateEvent: (id, data) => API.put(`/events/${id}`, data),
  deleteEvent: (id) => API.delete(`/events/${id}`),
  getMyOrganizedEvents: () => API.get('/events/organizer/my-events')
};

// Registration Services
export const registrationService = {
  registerForEvent: (eventId) => API.post('/registrations', { eventId }),
  cancelRegistration: (id) => API.put(`/registrations/${id}/cancel`),
  getMyRegistrations: () => API.get('/registrations/my-registrations'),
  getEventRegistrations: (eventId) => API.get(`/registrations/event/${eventId}`)
};

// Volunteer Services
export const volunteerService = {
  applyForVolunteer: (data) => API.post('/volunteers/apply', data),
  getMyVolunteerTasks: () => API.get('/volunteers/my-tasks'),
  getEventVolunteerApplications: (eventId) => API.get(`/volunteers/event/${eventId}`),
  updateApplicationStatus: (id, status) => API.put(`/volunteers/applications/${id}/status`, { status }),
  assignVolunteerTask: (data) => API.post('/volunteers/assign', data),
  getRecommendedVolunteers: (eventId) => API.get(`/volunteers/recommend-volunteers/${eventId}`)
};

// Notification Services
export const notificationService = {
  getUserNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all')
};

// Recommendation Services
export const recommendationService = {
  getEventRecommendations: () => API.get('/recommendations/events')
};

// Club Services
export const clubService = {
  getClubs: () => API.get('/clubs'),
  createClub: (data) => API.post('/clubs', data),
  joinClub: (id) => API.put(`/clubs/${id}/join`)
};

// Admin Services
export const adminService = {
  getAdminStats: () => API.get('/admin/stats'),
  getAllUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/status`),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`)
};
