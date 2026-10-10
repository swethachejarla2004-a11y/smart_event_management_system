import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

const categories = ['All', 'Technical', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Social Service', 'Management', 'Seminars'];

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [venueFilter, setVenueFilter] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (venueFilter) params.venue = venueFilter;

      const res = await eventService.getEvents(params);
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Browse Campus Events</h1>
        <p className="text-slate-400 text-sm">Discover tech workshops, hackathons, cultural festivals, sports, and volunteer opportunities.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event title, description, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="relative md:w-64">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by venue..."
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-indigo-500/25"
          >
            Apply Search
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching campus events..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="No campus events match your current search or category filter."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setVenueFilter('');
            setSelectedCategory('All');
            fetchEvents();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div key={ev._id} className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group">
              
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                  alt={ev.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 badge-primary bg-slate-950/80 backdrop-blur-md">
                  {ev.category}
                </span>
                <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  {ev.status.toUpperCase()}
                </span>
              </div>

              {/* Event Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{ev.startTime} - {ev.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>

                {/* Organizer & Action */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-800/80">
                  <div className="flex items-center space-x-2 truncate">
                    <img 
                      src={ev.organizer?.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'} 
                      alt="Organizer" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-[11px] text-slate-400 truncate">{ev.organizer?.name || 'Organizer'}</span>
                  </div>

                  <Link
                    to={`/events/${ev._id}`}
                    className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
                  >
                    Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default EventsPage;
