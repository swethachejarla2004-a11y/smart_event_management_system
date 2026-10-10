import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/services';
import { PlusCircle, Trash2, Calendar, MapPin, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

const categoryOptions = ['Technical', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Social Service', 'Management', 'Seminars'];
const skillOptions = ['Python', 'JavaScript', 'React', 'Machine Learning', 'Data Analysis', 'Photography', 'Graphic Design', 'Public Speaking', 'Event Management', 'First Aid', 'Ethical Hacking', 'C++'];
const sampleImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'
];

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [image, setImage] = useState(sampleImages[0]);
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'JavaScript']);

  // Volunteer roles builder
  const [volunteerTasks, setVolunteerTasks] = useState([
    { title: 'General Registration Support', slotsNeeded: 4, description: 'Assist students with QR check-in and seating.' }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (sk) => {
    if (requiredSkills.includes(sk)) setRequiredSkills(requiredSkills.filter(s => s !== sk));
    else setRequiredSkills([...requiredSkills, sk]);
  };

  const handleAddVolunteerTask = () => {
    setVolunteerTasks([...volunteerTasks, { title: '', slotsNeeded: 2, description: '' }]);
  };

  const handleRemoveVolunteerTask = (idx) => {
    setVolunteerTasks(volunteerTasks.filter((_, i) => i !== idx));
  };

  const handleTaskChange = (idx, field, val) => {
    const updated = [...volunteerTasks];
    updated[idx][field] = val;
    setVolunteerTasks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const validVolunteerTasks = volunteerTasks.filter(vt => vt.title && vt.title.trim() !== '');
      const totalVolunteers = validVolunteerTasks.reduce((acc, curr) => acc + (Number(curr.slotsNeeded) || 0), 0);

      const finalRegistrationDeadline = registrationDeadline || date;

      const res = await eventService.createEvent({
        title,
        category,
        description,
        date,
        registrationDeadline: finalRegistrationDeadline,
        startTime,
        endTime,
        venue,
        capacity: Number(capacity),
        image,
        requiredSkills,
        requiredVolunteers: totalVolunteers,
        volunteerTasks: validVolunteerTasks
      });

      if (res.success) {
        navigate('/organizer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create New Campus Event</h1>
        <p className="text-xs text-slate-400">Publish a new event to trigger automatic AI recommendation feeds for students.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Event Overview & Details</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Hackathon 2026: AI & Cloud Innovation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Event Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Venue Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Main Auditorium Hall B"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Description</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed description of the event agenda, topics, speakers, and schedule..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Deadline</label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                placeholder="Same as event date if empty"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
              <input
                type="text"
                placeholder="04:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Max Student Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 max-w-xs"
            />
          </div>
        </div>

        {/* Required Skills for AI Recommendation Engine */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Target Skills for AI Recommendation
            </h3>
            <span className="text-[11px] text-purple-400 font-semibold">{requiredSkills.length} Selected</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skillOptions.map((sk) => {
              const active = requiredSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    active 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {sk} {active && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Volunteer Roles Builder */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Volunteer Roles & Task Builder</h3>
            <button
              type="button"
              onClick={handleAddVolunteerTask}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-purple-500 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Task Role
            </button>
          </div>

          <div className="space-y-4">
            {volunteerTasks.map((vt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-300">Volunteer Position #{idx + 1}</h4>
                  {volunteerTasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVolunteerTask(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Task Title (e.g. Photography & Video Log)"
                      value={vt.title}
                      onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Slots Needed"
                      value={vt.slotsNeeded}
                      onChange={(e) => handleTaskChange(idx, 'slotsNeeded', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl hover:shadow-purple-500/30 transition-all"
        >
          {submitting ? 'Publishing Event...' : 'Publish Campus Event'}
        </button>

      </form>

    </div>
  );
};

export default CreateEventPage;
