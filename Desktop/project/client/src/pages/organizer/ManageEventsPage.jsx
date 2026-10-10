import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { CalendarCheck, Edit3, Trash2, PlusCircle, Users } from 'lucide-react';

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getMyOrganizedEvents();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await eventService.deleteEvent(id);
      if (res.success) {
        fetchEvents();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your organized events list..." />;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Organized Events</h1>
          <p className="text-xs text-slate-400">Update event details, status, or remove events.</p>
        </div>
        <Link
          to="/organizer/create-event"
          className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition-all self-start sm:self-auto flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="No Organized Events Found"
          description="You haven't created any events yet."
          actionText="Create New Event"
          onAction={() => window.location.href = '/organizer/create-event'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev._id} className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-primary">{ev.category}</span>
                  <span className="badge-success">{ev.status}</span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{ev.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>

                <div className="pt-2 text-xs text-slate-300 space-y-1">
                  <p>📅 {new Date(ev.date).toLocaleDateString()} ({ev.startTime} - {ev.endTime})</p>
                  <p>📍 {ev.venue}</p>
                  <p className="font-semibold text-indigo-400">Registrations: {(ev.totalRegistrations ?? ev.registeredCount ?? 0)} / {ev.capacity || ev.maxParticipants || '∞'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/organizer/volunteers?eventId=${ev._id}`}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 font-semibold"
                  >
                    Volunteers
                  </Link>
                </div>

                <button
                  onClick={() => handleDelete(ev._id)}
                  disabled={deletingId === ev._id}
                  className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageEventsPage;
