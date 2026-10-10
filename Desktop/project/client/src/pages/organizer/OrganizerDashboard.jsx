import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/services';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  PlusCircle, 
  CalendarCheck, 
  Users, 
  BarChart3, 
  ChevronRight,
  UserCheck,
  Building
} from 'lucide-react';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      setLoading(true);
      try {
        const res = await eventService.getMyOrganizedEvents();
        if (res.success) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load organizer events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizerEvents();
  }, []);

  if (loading) return <LoadingSpinner message="Loading organizer dashboard..." />;

  const totalRegistrations = events.reduce((sum, ev) => sum + (ev.totalRegistrations ?? ev.registeredCount ?? 0), 0);
  const totalVolunteersNeeded = events.reduce((sum, ev) => sum + (ev.requiredVolunteers || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="badge-primary">Organizer Portal</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Event Management Hub</h1>
          <p className="text-xs text-slate-300">Create, publish, and manage volunteer assignments for campus events.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/organizer/create-event"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Create New Event
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Events Created" 
          value={events.length} 
          icon={CalendarCheck} 
          color="indigo" 
          subtitle="Total Campus Events"
        />
        <StatCard 
          title="Total Registrations" 
          value={totalRegistrations} 
          icon={Users} 
          color="purple" 
          subtitle="Student Tickets Issued"
        />
        <StatCard 
          title="Volunteer Slots" 
          value={totalVolunteersNeeded} 
          icon={UserCheck} 
          color="emerald" 
          subtitle="Positions Demanded"
        />
      </div>

      {/* Recent Events Table */}
      <div className="glass-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Your Managed Events</h2>
            <p className="text-xs text-slate-400">Manage event details and approve volunteer candidates.</p>
          </div>
          <Link to="/organizer/events" className="text-xs font-semibold text-purple-400 hover:underline">
            View All Managed Events
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <p className="text-sm font-semibold text-white">No Events Created Yet</p>
            <p className="text-xs">Click the button below to publish your first campus event.</p>
            <Link
              to="/organizer/create-event"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
            >
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Registrations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{ev.title}</td>
                    <td className="py-3.5 px-4"><span className="badge-primary">{ev.category}</span></td>
                    <td className="py-3.5 px-4">{new Date(ev.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">{(ev.totalRegistrations ?? ev.registeredCount ?? 0)} / {ev.capacity || ev.maxParticipants || '∞'}</td>
                    <td className="py-3.5 px-4">
                      <span className="badge-success">{ev.status}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/organizer/volunteers?eventId=${ev._id}`}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 font-semibold transition-all"
                      >
                        Volunteers
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrganizerDashboard;
