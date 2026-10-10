import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationService, registrationService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle,
  Zap,
  Ticket
} from 'lucide-react';

const RecommendedEventsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [registeringId, setRegisteringId] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const [recRes, regRes] = await Promise.all([
        recommendationService.getEventRecommendations(),
        registrationService.getMyRegistrations()
      ]);

      if (recRes.success) setRecommendations(recRes.data);
      if (regRes.success) {
        setRegisteredIds(regRes.data.filter(r => r.status === 'registered').map(r => r.event?._id));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleQuickRegister = async (eventId) => {
    setRegisteringId(eventId);
    try {
      const res = await registrationService.registerForEvent(eventId);
      if (res.success) {
        setRegisteredIds([...registeredIds, eventId]);
      }
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating your explainable AI event recommendations..." />;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/30 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Explainable AI Engine Active
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Personalized Event Feed</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Our content-based AI engine analyzes your recorded skills, academic department, availability, and preferred categories to score and rank event recommendations with human-explainable rationale.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          title="No Recommendations Available"
          description="Update your skills and interests in your profile to receive personalized event matches."
          actionText="Update Profile Skills"
          onAction={() => window.location.href = '/student/profile'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map(({ event, matchPercentage, matchDetails, reasons }) => {
            const isReg = registeredIds.includes(event._id);
            return (
              <div key={event._id} className="glass-card glass-card-hover rounded-3xl p-6 md:p-8 space-y-6 border border-indigo-500/20">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge-primary">{event.category}</span>
                      <span className="text-xs text-slate-400">Organized by {event.organizer?.name}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{event.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">{event.description}</p>
                  </div>

                  {/* Match Percentage Pill */}
                  <div className="flex flex-col items-end shrink-0 space-y-1">
                    <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-lg flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>{matchPercentage}% AI Match</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Relevance Score</span>
                  </div>
                </div>

                {/* Match Breakdown & Explainability Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left: Why Recommended Reasons */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Why Recommended For You
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Event Info & Action */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      {isReg ? (
                        <span className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Already Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleQuickRegister(event._id)}
                          disabled={registeringId === event._id}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Ticket className="w-4 h-4" />
                          {registeringId === event._id ? 'Registering...' : 'Instant Ticket Register'}
                        </button>
                      )}

                      <Link
                        to={`/events/${event._id}`}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                      >
                        Full Event Page
                      </Link>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default RecommendedEventsPage;
