import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/services';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Zap, 
  Search,
  BookOpen
} from 'lucide-react';

const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents();
        if (res.success) {
          setFeaturedEvents(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-full blur-[120px] -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Next-Gen Smart Campus Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Centralized Campus Events & <span className="text-gradient">AI Volunteer Matching</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed font-normal">
            Say goodbye to scattered Google Forms and spreadsheets. One unified platform for students, event organizers, and administrators with explainable AI event recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold shadow-xl shadow-indigo-600/30 hover:shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Explore Campus Events
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-white font-semibold hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-indigo-400" />
              Join as Student / Organizer
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-t border-slate-800/80 mt-12">
            <div>
              <p className="text-3xl font-extrabold text-indigo-400">AI Match</p>
              <p className="text-xs text-slate-400">Personalized Recs</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-purple-400">0 Spreadsheets</p>
              <p className="text-xs text-slate-400">Centralized Records</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-pink-400">Instant Access</p>
              <p className="text-xs text-slate-400">Digital Event Tickets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-white">Engineered for Modern Campus Life</h2>
          <p className="text-slate-400 text-sm">Comprehensive tools tailored for Students, Organizers, and College Authorities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="glass-card glass-card-hover p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Explainable AI Recs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Calculates match percentage (0-100%) by comparing student skills, interests, availability, and past events against event requirements.
            </p>
            <div className="pt-2 text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Transparent "Why Recommended" reasons
            </div>
          </div>

          <div className="glass-card glass-card-hover p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Smart Volunteer Matching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically aligns student technical skills (e.g. Photography, Python, Logistics) with organizer task requirements for optimal event operations.
            </p>
            <div className="pt-2 text-xs text-pink-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Seamless Task Assignment & Alerts
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Upcoming Campus Events</h2>
            <p className="text-slate-400 text-sm">Discover tech workshops, hackathons, cultural fests, and sports meets.</p>
          </div>
          <Link to="/events" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading upcoming events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map(ev => (
              <div key={ev._id} className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col">
                <img src={ev.image} alt={ev.title} className="w-full h-44 object-cover" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="badge-primary mb-2 inline-block">{ev.category}</span>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{ev.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{ev.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>📅 {new Date(ev.date).toLocaleDateString()}</span>
                    <span>📍 {ev.venue}</span>
                  </div>
                  <Link
                    to={`/events/${ev._id}`}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-slate-800 hover:bg-indigo-600 text-white transition-all"
                  >
                    View Details & Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Role Access Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Ready for Demonstration?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm">
            Log in with demo credentials for Admin, Organizer, or Student roles to test real-time AI event recommendations and volunteer task assignments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">
              Sign In to Demo
            </Link>
            <Link to="/about" className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium transition-all">
              Read System Architecture
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
