import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService, volunteerService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Users, Sparkles, CheckCircle2, XCircle, Send, Award, Check } from 'lucide-react';

const VolunteerManagementPage = () => {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [applications, setApplications] = useState([]);
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign Modal
  const [assignModalCandidate, setAssignModalCandidate] = useState(null);
  const [assignedTaskName, setAssignedTaskName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getMyOrganizedEvents();
        if (res.success && res.data.length > 0) {
          setEvents(res.data);
          if (!selectedEventId) {
            setSelectedEventId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    const fetchApplicationsAndRecs = async () => {
      setLoading(true);
      try {
        const [appRes, recRes] = await Promise.all([
          volunteerService.getEventVolunteerApplications(selectedEventId),
          volunteerService.getRecommendedVolunteers(selectedEventId)
        ]);

        if (appRes.success) setApplications(appRes.data);
        if (recRes.success) setRecommendedCandidates(recRes.data);
      } catch (err) {
        console.error('Error fetching volunteer applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationsAndRecs();
  }, [selectedEventId]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await volunteerService.updateApplicationStatus(id, status);
      // Refresh
      const appRes = await volunteerService.getEventVolunteerApplications(selectedEventId);
      if (appRes.success) setApplications(appRes.data);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignModalCandidate) return;
    setAssigning(true);
    try {
      const res = await volunteerService.assignVolunteerTask({
        eventId: selectedEventId,
        volunteerId: assignModalCandidate.student._id,
        studentId: assignModalCandidate.student._id,
        task: assignedTaskName,
        instructions
      });
      if (res.success) {
        alert('Volunteer task assigned and notification sent to student!');
        setAssignModalCandidate(null);
      }
    } catch (err) {
      alert(err.message || 'Task assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  if (loading && events.length === 0) return <LoadingSpinner message="Loading volunteer management center..." />;

  const currentEvent = events.find(e => e._id === selectedEventId);

  return (
    <div className="space-y-8">
      
      {/* Header & Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Volunteer Management</h1>
          <p className="text-xs text-slate-400">Review volunteer applications and AI skill-match recommendations.</p>
        </div>

        {events.length > 0 && (
          <div className="w-full sm:w-64">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-purple-500/30 text-white text-xs font-bold focus:outline-none"
            >
              {events.map(ev => (
                <option key={ev._id} value={ev._id}>{ev.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* AI Recommended Candidates Section */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-purple-500/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> AI Recommended Volunteers for {currentEvent?.title}
          </h3>
          <span className="text-xs text-purple-300 font-semibold">{recommendedCandidates.length} Matched</span>
        </div>

        {recommendedCandidates.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No AI candidate recommendations available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCandidates.map((candidate, idx) => {
              const student = candidate.student || candidate;
              const matchScore = candidate.matchScore || candidate.topMatchedTask?.matchScore || 85;
              const matchedSkills = candidate.matchedSkills || (student.skills || []);
              const topTaskTitle = candidate.topMatchedTask?.taskTitle || candidate.topMatchedTask?.title;

              return (
                <div key={student._id || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src={student.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{student.name}</h4>
                        <p className="text-[10px] text-slate-400">{student.department}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {matchScore}% Match
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <p className="font-semibold text-slate-300 mb-1">
                      {topTaskTitle ? `Top Role: ${topTaskTitle}` : 'Skills:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {matchedSkills.slice(0, 4).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAssignModalCandidate({ student });
                      setAssignedTaskName(topTaskTitle || currentEvent?.volunteerTasks?.[0]?.title || 'General Registration Support');
                    }}
                    className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow"
                  >
                    Assign Volunteer Role
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Received Applications Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Submitted Student Applications</h3>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No student applications received yet for this event.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Role Applied</th>
                  <th className="py-3 px-4">Student Skills</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {app.student?.name}
                      <span className="block text-[10px] text-slate-400">{app.student?.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-purple-300">{app.preferredTask}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {app.student?.skills?.join(', ') || 'None'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'approved')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="px-3 py-1 rounded-lg bg-slate-800 text-rose-400 font-bold text-xs hover:bg-rose-500/10"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setAssignModalCandidate({ student: app.student });
                          setAssignedTaskName(app.preferredTask || currentEvent?.volunteerTasks?.[0]?.title || 'General Support');
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-600/80 text-white font-bold text-xs hover:bg-purple-500"
                      >
                        Assign Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      {assignModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-purple-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Assign Task to {assignModalCandidate.student?.name}</h3>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Task Role</label>
                {currentEvent?.volunteerTasks && currentEvent.volunteerTasks.length > 0 ? (
                  <select
                    value={assignedTaskName}
                    onChange={(e) => setAssignedTaskName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    {currentEvent.volunteerTasks.map((t, idx) => (
                      <option key={idx} value={t.title}>{t.title} ({t.slotsNeeded || 2} slots)</option>
                    ))}
                    <option value="General Support">General Support</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={assignedTaskName}
                    onChange={(e) => setAssignedTaskName(e.target.value)}
                    placeholder="e.g. Stage Logistics & Setup"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions for Student</label>
                <textarea
                  rows={3}
                  placeholder="Report to Prof. Sarah at 9:30 AM in Auditorium Hall A..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalCandidate(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VolunteerManagementPage;
