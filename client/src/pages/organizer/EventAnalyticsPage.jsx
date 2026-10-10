import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, Users, CalendarCheck, CheckCircle2 } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

const EventAnalyticsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await eventService.getMyOrganizedEvents();
        if (res.success) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load events for analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner message="Generating event analytics charts..." />;

  // Chart Data Transformations
  const barData = events.map(e => ({
    name: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
    Registrations: e.totalRegistrations ?? e.registeredCount ?? 0,
    Capacity: e.capacity ?? e.maxParticipants ?? 100
  }));

  const categoryMap = {};
  events.forEach(e => {
    const regCount = e.totalRegistrations ?? e.registeredCount ?? 0;
    categoryMap[e.category] = (categoryMap[e.category] || 0) + (regCount > 0 ? regCount : 1);
  });
  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Event Analytics & Insights</h1>
        <p className="text-xs text-slate-400">Visual performance reports for student registrations, category breakdown, and seat utilization.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Events Tracked" 
          value={events.length} 
          icon={CalendarCheck} 
          color="indigo" 
        />
        <StatCard 
          title="Total Registrations" 
          value={events.reduce((sum, e) => sum + (e.totalRegistrations ?? e.registeredCount ?? 0), 0)} 
          icon={Users} 
          color="purple" 
        />
        <StatCard 
          title="Average Registrations" 
          value={events.length > 0 ? (events.reduce((sum, e) => sum + (e.totalRegistrations ?? e.registeredCount ?? 0), 0) / events.length).toFixed(1) : 0} 
          icon={BarChart3} 
          color="emerald" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Registration per Event Bar Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Registrations vs Capacity per Event
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="Registrations" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Capacity" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-purple-400" /> Registrations by Event Category
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">No category data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default EventAnalyticsPage;
