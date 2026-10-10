import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/services';
import { User, Sparkles, Check, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const allSkillsList = ['Python', 'JavaScript', 'React', 'Machine Learning', 'Data Analysis', 'Photography', 'Graphic Design', 'Public Speaking', 'Event Management', 'First Aid', 'Ethical Hacking', 'C++', 'Java', 'Logistics', 'Video Editing'];
const allCategoriesList = ['Technical', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Social Service', 'Management', 'Seminars'];
const availabilityList = ['Weekdays', 'Weekends', 'Evenings', 'Flexible', 'Full Day'];

const MyProfilePage = () => {
  const { user, updateProfileState } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [phone, setPhone] = useState(user?.phone || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [interests, setInterests] = useState(user?.interests || []);
  const [preferredCategories, setPreferredCategories] = useState(user?.preferredCategories || []);
  const [availability, setAvailability] = useState(user?.availability || ['Flexible']);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const toggleArrayItem = (item, list, setList) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await authService.updateProfile({
        name,
        department,
        year,
        phone,
        skills,
        interests,
        preferredCategories,
        availability
      });

      if (res.success) {
        updateProfileState(res.data);
        setMessage({ type: 'success', text: 'Profile and AI recommendation attributes updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Profile & Skills</h1>
        <p className="text-xs text-slate-400">Keep your technical skills and availability updated for accurate AI recommendations.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Personal Details */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-indigo-400" /> Academic & Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email (Read Only)</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science">Data Science</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 555-0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Technical & Soft Skills */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Technical & Event Skills
            </h3>
            <span className="text-[11px] text-purple-400 font-semibold">{skills.length} Selected</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allSkillsList.map((sk) => {
              const active = skills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleArrayItem(sk, skills, setSkills)}
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

        {/* Preferred Categories & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Preferred Categories</h3>
            <div className="flex flex-wrap gap-2">
              {allCategoriesList.map((cat) => {
                const active = preferredCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayItem(cat, preferredCategories, setPreferredCategories)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      active 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat} {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Schedule Availability</h3>
            <div className="flex flex-wrap gap-2">
              {availabilityList.map((av) => {
                const active = availability.includes(av);
                return (
                  <button
                    key={av}
                    type="button"
                    onClick={() => toggleArrayItem(av, availability, setAvailability)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      active 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {av} {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 ml-auto"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>

      </form>

    </div>
  );
};

export default MyProfilePage;
