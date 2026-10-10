import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  CalendarCheck, 
  Users, 
  Bell, 
  User, 
  PlusCircle, 
  CheckSquare, 
  BarChart3, 
  ShieldAlert, 
  Building2, 
  History,
  FileSpreadsheet
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  // Student Menu
  const studentNav = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Personalized AI Recs', path: '/student/recommendations', icon: Sparkles, badge: 'AI' },
    { label: 'My Registrations', path: '/student/registrations', icon: CalendarCheck },
    { label: 'Volunteer Hub', path: '/student/volunteers', icon: Users },
    { label: 'My Volunteer Tasks', path: '/student/my-tasks', icon: CheckSquare },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
    { label: 'My Profile & Skills', path: '/student/profile', icon: User }
  ];

  // Organizer Menu
  const organizerNav = [
    { label: 'Organizer Overview', path: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'Create New Event', path: '/organizer/create-event', icon: PlusCircle },
    { label: 'Manage My Events', path: '/organizer/events', icon: CalendarCheck },
    { label: 'Volunteer Applications', path: '/organizer/volunteers', icon: Users },
    { label: 'Event Analytics', path: '/organizer/analytics', icon: BarChart3 }
  ];

  // Admin Menu
  const adminNav = [
    { label: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'All Campus Events', path: '/admin/events', icon: CalendarCheck },
    { label: 'Campus Clubs', path: '/admin/clubs', icon: Building2 },
    { label: 'System Analytics', path: '/admin/analytics', icon: BarChart3 }
  ];

  const currentNav = user.role === 'admin' ? adminNav : user.role === 'organizer' ? organizerNav : studentNav;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center space-x-3">
          <img 
            src={user.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
            <p className="text-xs text-slate-400 capitalize">{user.role} Portal</p>
          </div>
        </div>

        {/* Navigation List */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          <nav className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
        <p className="font-semibold text-white">Smart Campus AI Engine</p>
        <p className="text-[11px] text-slate-400">Content-based matching & intelligent event hub.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
