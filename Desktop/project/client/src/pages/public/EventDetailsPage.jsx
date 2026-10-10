import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService, registrationService, volunteerService } from '../../services/services';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Send, 
  Ticket,
  ArrowLeft
} from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Volunteer Modal State
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState('General Support');
  const [volunteerNotes, setVolunteerNotes] = useState('');
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);

  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const res = await eventService.getEventById(id);
        if (res.success) {
          setEvent(res.data);
        }

        // If user logged in as student, check registration status
        if (user && user.role === 'student') {
          const regRes = await registrationService.getMyRegistrations();
          if (regRes.success) {
            const found = regRes.data.find(r => r.event?._id === id && r.status === 'registered');
            if (found) {
              setIsRegistered(true);
              setRegistrationData(found);
            }
          }
        }
      } catch (err) {
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRegistering(true);
    setMessage(null);
    try {
      const res = await registrationService.registerForEvent(id);
      if (res.success) {
        setIsRegistered(true);
        setRegistrationData(res.data);
        setMessage({ type: 'success', text: 'Registration successful! Your ticket code is generated.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setRegistering(false);
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setVolunteerSubmitting(true);
    try {
      const res = await volunteerService.applyForVolunteer({
        eventId: id,
        preferredTask: selectedTask,
        notes: volunteerNotes
      });
      if (res.success) {
        setVolunteerSuccess(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading event details..." />;
  if (!event) return <div className="text-center py-20 text-slate-400">Event not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Button */}
      <Link to="/events" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Events
      </Link>

      {/* Main Event Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        
        {/* Banner Image */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <span className="badge-primary text-sm">{event.category}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">{event.title}</h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Description & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            
            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
                {message.text}
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">About This Event</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            {/* Required Skills */}
            {event.requiredSkills && event.requiredSkills.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Required / Relevant Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {event.requiredSkills.map((sk, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      ⚡ {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Roles */}
            {event.volunteerTasks && event.volunteerTasks.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" /> Volunteer Positions
                  </h3>
                  <span className="text-xs text-slate-400">{event.requiredVolunteers} positions total</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {event.volunteerTasks.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{t.title}</h4>
                        <span className="text-xs text-purple-400 font-semibold">{t.slotsNeeded} slots needed</span>
                      </div>
                      {t.description && <p className="text-xs text-slate-400">{t.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Registration Card */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-6">
              
              <h3 className="text-lg font-bold text-white pb-3 border-b border-slate-800">Event Overview</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Date & Time</p>
                    <p className="text-slate-400">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-slate-400">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Location Venue</p>
                    <p className="text-slate-400">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Event Organizer</p>
                    <p className="text-slate-400">{event.organizer?.name}</p>
                    <p className="text-slate-500">{event.organizer?.department}</p>
                  </div>
                </div>
              </div>

              {/* Registration Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                {isRegistered ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-emerald-300">You Are Registered!</p>
                    {registrationData?.ticketCode && (
                      <p className="text-xs font-mono text-white bg-slate-900 px-3 py-1 rounded-md inline-block">
                        Ticket: {registrationData.ticketCode}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/30"
                  >
                    {registering ? 'Processing Registration...' : 'Register for Event'}
                  </button>
                )}

                {/* Volunteer Application Button */}
                {user && user.role === 'student' && (
                  <button
                    onClick={() => setShowVolunteerModal(true)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-xs transition-all border border-purple-500/30 flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4 text-purple-400" /> Apply as Event Volunteer
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Volunteer Application Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-purple-500/30 space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" /> Apply for Volunteer Position
            </h3>

            {volunteerSuccess ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Application Submitted!</h4>
                <p className="text-xs text-slate-400">
                  The organizer ({event.organizer?.name}) will review your application and assign task instructions.
                </p>
                <button
                  onClick={() => {
                    setShowVolunteerModal(false);
                    setVolunteerSuccess(false);
                  }}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                >
                  Close Modal
                </button>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Preferred Task Role</label>
                  <select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="General Support">General Support & Registration Desk</option>
                    {event.volunteerTasks?.map((vt, i) => (
                      <option key={i} value={vt.title}>{vt.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Relevance to Organizer</label>
                  <textarea
                    rows={3}
                    placeholder="Mention relevant skills, past volunteer work, or equipment (e.g. DSLR camera)..."
                    value={volunteerNotes}
                    onChange={(e) => setVolunteerNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowVolunteerModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={volunteerSubmitting}
                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                  >
                    {volunteerSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetailsPage;
