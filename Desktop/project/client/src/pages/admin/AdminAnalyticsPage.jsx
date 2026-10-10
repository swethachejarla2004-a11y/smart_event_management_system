import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShieldCheck, Users, CalendarCheck, UserCheck, Building2, BarChart3 } from 'lucide-react';

const COLORS = ['#ec4899', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAdminStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner message="Generating campus governance analytics report..." />;

  const userDistributionData = [
    { name: 'Students', value: stats?.users?.students || 0 },
    { name: 'Organizers', value: stats?.users?.organizers || 0 },
    { name: 'Admins', value: stats?.users?.admins || 0 }
  ];

  const categoryDistributionData = stats?.categoryBreakdown || [
    { name: 'Technical', value: 5 },
    { name: 'Cultural', value: 3 },
    { name: 'Sports', value: 2 },
    { name: 'Social Service', value: 4 }
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Analytics & Governance Report</h1>
        <p className="text-xs text-slate-400">High-level institutional statistics across all active users, events, and QR verified attendances.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Campus Users" value={stats?.users?.total || 0} icon={Users} color="pink" />
        <StatCard title="Total Events Created" value={stats?.events?.total || 0} icon={CalendarCheck} color="indigo" />
        <StatCard title="Verified Attendances" value={stats?.attendances?.total || 0} icon={UserCheck} color="emerald" />
        <StatCard title="Active Clubs" value={stats?.clubs?.total || 0} icon={Building2} color="purple" />
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Distribution */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-pink-400" /> User Role Demographics
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Event Category Volume
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistributionData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAnalyticsPage;
