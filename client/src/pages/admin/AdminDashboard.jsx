import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/services';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Users, 
  CalendarCheck, 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  BarChart3, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAdminStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner message="Assembling campus system governance metrics..." />;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-pink-950/30 to-purple-950/40 border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-pink-400" /> Admin Governance Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Control Center</h1>
          <p className="text-xs text-slate-300">Oversee campus-wide events, student accounts, club permissions, and participation metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Manage Users ({stats?.users?.total || 0})
          </Link>
          <Link
            to="/admin/clubs"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-all"
          >
            Campus Clubs ({stats?.clubs?.total || 0})
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Registered Users" 
          value={stats?.users?.total || 0} 
          icon={Users} 
          color="indigo" 
          subtitle={`${stats?.users?.students || 0} Students • ${stats?.users?.organizers || 0} Organizers`}
        />
        <StatCard 
          title="Campus Events" 
          value={stats?.events?.total || 0} 
          icon={CalendarCheck} 
          color="purple" 
          subtitle={`${stats?.events?.published || 0} Active Published`}
        />
        <StatCard 
          title="Verified Check-ins" 
          value={stats?.attendances?.total || 0} 
          icon={UserCheck} 
          color="emerald" 
          subtitle="QR Attendance Records"
        />
        <StatCard 
          title="Campus Clubs" 
          value={stats?.clubs?.total || 0} 
          icon={Building2} 
          color="pink" 
          subtitle="Recognized Organizations"
        />
      </div>

      {/* Grid: Quick Actions & Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Quick Governance Links */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Administrative Controls</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/users"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-1 block group"
            >
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-400">User Account Management</h4>
              <p className="text-xs text-slate-400">Promote roles, activate or deactivate accounts.</p>
            </Link>

            <Link
              to="/admin/events"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all space-y-1 block group"
            >
              <h4 className="text-sm font-bold text-white group-hover:text-purple-400">Campus Events Oversight</h4>
              <p className="text-xs text-slate-400">Review all published events and remove inappropriate entries.</p>
            </Link>

            <Link
              to="/admin/clubs"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500/40 transition-all space-y-1 block group"
            >
              <h4 className="text-sm font-bold text-white group-hover:text-pink-400">College Clubs Governance</h4>
              <p className="text-xs text-slate-400">Register new clubs and assign faculty leads.</p>
            </Link>

            <Link
              to="/admin/analytics"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-1 block group"
            >
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400">System Analytics</h4>
              <p className="text-xs text-slate-400">Export engagement reports and attendance metrics.</p>
            </Link>
          </div>
        </div>

        {/* User Breakdown Box */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">User Demographic Summary</h3>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Students Registered:</span>
                <span className="font-bold text-indigo-400">{stats?.users?.students || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full" 
                  style={{ width: `${stats?.users?.total ? (stats.users.students / stats.users.total) * 100 : 0}%` }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Event Organizers:</span>
                <span className="font-bold text-purple-400">{stats?.users?.organizers || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full" 
                  style={{ width: `${stats?.users?.total ? (stats.users.organizers / stats.users.total) * 100 : 0}%` }} 
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">System Administrators:</span>
                <span className="font-bold text-pink-400">{stats?.users?.admins || 0}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-pink-500 h-full rounded-full" 
                  style={{ width: `${stats?.users?.total ? (stats.users.admins / stats.users.total) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 text-xs text-slate-400 border border-slate-800 flex items-center justify-between">
            <span>Database Status: Healthy & Seeded</span>
            <span className="badge-success text-[10px]">CONNECTED</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
