import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllEventsAdmin();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await adminService.updateEventStatusAdmin(id, status);
      if (res.success) fetchEvents();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campus event as administrator?')) return;
    try {
      const res = await adminService.deleteEventAdmin(id);
      if (res.success) fetchEvents();
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  if (loading) return <LoadingSpinner message="Loading all campus events..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Campus Events Control</h1>
        <p className="text-xs text-slate-400">System governance of all published and upcoming events across all college departments.</p>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No Events Found" description="There are no campus events recorded in the database." />
      ) : (
        <div className="glass-card rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event Title</th>
                <th className="py-3 px-4">Organizer</th>
                <th className="py-3 px-4">Category & Date</th>
                <th className="py-3 px-4">Registrations</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{ev.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-200">{ev.organizer?.name}</span>
                    <span className="block text-[10px] text-slate-400">{ev.organizer?.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="badge-primary">{ev.category}</span>
                    <span className="block text-[10px] text-slate-400 mt-1">{new Date(ev.date).toLocaleDateString()}</span>
                  </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">
                      {(ev.totalRegistrations ?? ev.registeredCount ?? 0)} / {ev.capacity || ev.maxParticipants || '∞'}
                    </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={ev.status}
                      onChange={(e) => handleStatusChange(ev._id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold text-[11px] focus:outline-none"
                    >
                      <option value="published">published</option>
                      <option value="draft">draft</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(ev._id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminEventsPage;
