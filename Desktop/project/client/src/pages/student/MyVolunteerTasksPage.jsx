import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Users, CheckSquare, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';

const MyVolunteerTasksPage = () => {
  const [data, setData] = useState({ applications: [], assignments: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await volunteerService.getMyVolunteerTasks();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error loading volunteer tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your volunteer task assignments..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Volunteer Portal</h1>
        <p className="text-xs text-slate-400">Track submitted volunteer applications and assigned event duty tasks.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'assignments' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Assigned Tasks ({data.assignments?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'applications' 
              ? 'border-purple-500 text-purple-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Applications History ({data.applications?.length || 0})
        </button>
      </div>

      {/* Assigned Tasks Tab Content */}
      {activeTab === 'assignments' && (
        <>
          {!data.assignments || data.assignments.length === 0 ? (
            <EmptyState
              title="No Assigned Tasks"
              description="You have not been assigned to any volunteer tasks yet. Apply on event detail pages!"
              actionText="Browse Events for Volunteering"
              onAction={() => window.location.href = '/events'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.assignments.map((ass) => (
                <div key={ass._id} className="glass-card p-6 rounded-2xl space-y-4 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Task: {ass.task}
                    </span>
                    <span className="badge-success text-xs">{ass.status}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{ass.event?.title || 'Campus Event'}</h3>
                    <p className="text-xs text-slate-400">
                      📍 {ass.event?.venue || 'Campus Main Hall'} • 📅 {ass.event?.date ? new Date(ass.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-indigo-300">Organizer Instructions:</p>
                    <p className="text-slate-400">{ass.instructions || 'Report to organizer desk 30 minutes prior to event start.'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Applications History Tab */}
      {activeTab === 'applications' && (
        <>
          {!data.applications || data.applications.length === 0 ? (
            <EmptyState
              title="No Submitted Applications"
              description="You haven't submitted any volunteer applications yet."
            />
          ) : (
            <div className="space-y-4">
              {data.applications.map((app) => (
                <div key={app._id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{app.event?.title || 'Campus Event'}</h4>
                    <p className="text-xs text-slate-400">
                      Role: <span className="font-semibold text-purple-300">{app.preferredTask}</span> • Applied on {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {app.notes && <p className="text-xs text-slate-500 italic font-mono">"{app.notes}"</p>}
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default MyVolunteerTasksPage;
