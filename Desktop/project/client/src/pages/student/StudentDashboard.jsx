import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recommendationService, registrationService, volunteerService } from '../../services/services';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Sparkles, 
  CalendarCheck, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Ticket,
  ChevronRight,
  UserCheck
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  const [recommendations, setRecommendations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [volunteerTasks, setVolunteerTasks] = useState({ applications: [], assignments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDashboardData = async () => {
      setLoading(true);
      try {
        const [recRes, regRes, volRes] = await Promise.all([
          recommendationService.getEventRecommendations(),
          registrationService.getMyRegistrations(),
          volunteerService.getMyVolunteerTasks()
        ]);

        if (recRes.success) setRecommendations(recRes.data.slice(0, 3));
        if (regRes.success) setRegistrations(regRes.data);
        if (volRes.success) setVolunteerTasks(volRes.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Assembling your personalized student portal..." />;

  const activeRegistrations = registrations.filter(r => r.status === 'registered');

  return (
    <div className="space-y-8">
      
      {/* Welcome Header Banner */}
      <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-purple-950/30 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> AI Student Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back, {user.name}! 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            {user.department} • {user.year} • {user.skills?.length || 0} Registered Skills
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/student/profile"
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Registered Events" 
          value={activeRegistrations.length} 
          icon={CalendarCheck} 
          color="indigo" 
          subtitle="Active Event Tickets"
        />
        <StatCard 
          title="Volunteer Tasks" 
          value={volunteerTasks.assignments?.length || 0} 
          icon={Users} 
          color="purple" 
          subtitle="Assigned Duty Roles"
        />
        <StatCard 
          title="AI Matches" 
          value={recommendations.length} 
          icon={Sparkles} 
          color="pink" 
          subtitle="Top Recommendation Feed"
        />
      </div>

      {/* AI Recommendations Highlight Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Top Recommended Events for You</h2>
              <p className="text-xs text-slate-400">Calculated by matching your skills & preferred categories</p>
            </div>
          </div>

          <Link to="/student/recommendations" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Match Explanations <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map(({ event, matchPercentage, reasons }) => (
            <div key={event._id} className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-4 relative border border-indigo-500/20">
              
              {/* Match Badge */}
              <div className="flex items-center justify-between">
                <span className="badge-primary">{event.category}</span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                  🎯 {matchPercentage}% Match
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white line-clamp-1">{event.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{event.description}</p>
              </div>

              {/* Explainable Why Reasons */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                <p className="font-semibold text-indigo-300">Why Recommended:</p>
                {reasons.slice(0, 2).map((r, i) => (
                  <p key={i} className="text-slate-400 truncate">{r}</p>
                ))}
              </div>

              <Link
                to={`/events/${event._id}`}
                className="w-full py-2 text-center text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow"
              >
                View & Register
              </Link>

            </div>
          ))}
        </div>
      </div>

      {/* Grid: My Registrations & Volunteer Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Event Registrations */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-400" /> My Active Event Registrations
            </h3>
            <Link to="/student/registrations" className="text-xs text-indigo-400 font-semibold hover:underline">
              View All
            </Link>
          </div>

          {activeRegistrations.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">You have no active event registrations.</p>
          ) : (
            <div className="space-y-3">
              {activeRegistrations.slice(0, 3).map((reg) => (
                <div key={reg._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white truncate max-w-xs">{reg.event?.title}</h4>
                    <p className="text-xs text-slate-400">📅 {new Date(reg.event?.date).toLocaleDateString()} • {reg.event?.venue}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {reg.ticketCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Volunteer Tasks */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> My Volunteer Duties
            </h3>
            <Link to="/student/my-tasks" className="text-xs text-purple-400 font-semibold hover:underline">
              View Tasks
            </Link>
          </div>

          {(!volunteerTasks.assignments || volunteerTasks.assignments.length === 0) ? (
            <p className="text-xs text-slate-400 py-6 text-center">No volunteer tasks assigned currently.</p>
          ) : (
            <div className="space-y-3">
              {volunteerTasks.assignments.map((ass) => (
                <div key={ass._id} className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">Task: {ass.task}</span>
                    <span className="badge-success text-[10px]">{ass.status}</span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">Event: {ass.event?.title}</p>
                  <p className="text-xs text-slate-400">{ass.instructions}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
