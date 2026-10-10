import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Ticket, Calendar, MapPin, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationService.getMyRegistrations();
      if (res.success) {
        setRegistrations(res.data);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration ticket?')) return;
    setCancellingId(id);
    try {
      const res = await registrationService.cancelRegistration(id);
      if (res.success) {
        fetchRegistrations();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your campus event tickets..." />;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Event Registrations</h1>
          <p className="text-xs text-slate-400">View active tickets and ticket codes.</p>
        </div>
        <Link
          to="/events"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          Discover More Events
        </Link>
      </div>

      {registrations.length === 0 ? (
        <EmptyState
          title="No Registrations Found"
          description="You have not registered for any campus events yet."
          actionText="Browse Campus Events"
          onAction={() => window.location.href = '/events'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div key={reg._id} className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-primary">{reg.event?.category}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${reg.status === 'registered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {reg.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-1">{reg.event?.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>{new Date(reg.event?.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {reg.event?.startTime}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{reg.event?.venue}</span>
                  </p>
                </div>
              </div>

              {/* Ticket Code Box */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Ticket Access Code</p>
                  <p className="text-sm font-mono font-bold text-indigo-300">{reg.ticketCode}</p>
                </div>
              </div>

              {reg.status === 'registered' && (
                <button
                  onClick={() => handleCancel(reg._id)}
                  disabled={cancellingId === reg._id}
                  className="w-full py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
                >
                  {cancellingId === reg._id ? 'Cancelling...' : 'Cancel Registration'}
                </button>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyRegistrationsPage;
