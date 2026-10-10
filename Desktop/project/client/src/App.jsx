import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import EventsPage from './pages/public/EventsPage';
import EventDetailsPage from './pages/public/EventDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student Portal Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyProfilePage from './pages/student/MyProfilePage';
import RecommendedEventsPage from './pages/student/RecommendedEventsPage';
import MyRegistrationsPage from './pages/student/MyRegistrationsPage';
import MyVolunteerTasksPage from './pages/student/MyVolunteerTasksPage';
import NotificationsPage from './pages/student/NotificationsPage';

// Organizer Portal Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEventPage from './pages/organizer/CreateEventPage';
import ManageEventsPage from './pages/organizer/ManageEventsPage';
import VolunteerManagementPage from './pages/organizer/VolunteerManagementPage';
import EventAnalyticsPage from './pages/organizer/EventAnalyticsPage';

// Admin Governance Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminClubsPage from './pages/admin/AdminClubsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Student Protected Portal */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<MyProfilePage />} />
        <Route path="/student/recommendations" element={<RecommendedEventsPage />} />
        <Route path="/student/registrations" element={<MyRegistrationsPage />} />
        <Route path="/student/volunteers" element={<MyVolunteerTasksPage />} />
        <Route path="/student/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Organizer Protected Portal */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/create-event" element={<CreateEventPage />} />
        <Route path="/organizer/events" element={<ManageEventsPage />} />
        <Route path="/organizer/volunteers" element={<VolunteerManagementPage />} />
        <Route path="/organizer/analytics" element={<EventAnalyticsPage />} />
      </Route>

      {/* Admin Protected Portal */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/admin/clubs" element={<AdminClubsPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
