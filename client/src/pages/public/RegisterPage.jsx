import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Key, Building, GraduationCap, Sparkles, Check } from 'lucide-react';

const availableSkillOptions = ['Python', 'JavaScript', 'React', 'Machine Learning', 'Data Analysis', 'Photography', 'Graphic Design', 'Public Speaking', 'Event Management', 'First Aid', 'Ethical Hacking', 'C++'];
const categoryOptions = ['Technical', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Social Service', 'Management', 'Seminars'];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [selectedSkills, setSelectedSkills] = useState(['JavaScript', 'Python']);
  const [selectedCategories, setSelectedCategories] = useState(['Technical', 'Workshops']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        department,
        year,
        skills: selectedSkills,
        preferredCategories: selectedCategories,
        interests: selectedCategories,
        availability: ['Flexible', 'Weekends']
      });

      if (user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-card max-w-xl w-full p-8 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl relative">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Smart Campus Account</h2>
          <p className="text-xs text-slate-400">Join the unified event discovery & volunteer network.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'student' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🎓 Student Role
            </button>
            <button
              type="button"
              onClick={() => setRole('organizer')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${role === 'organizer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              📋 Event Organizer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Lee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email</label>
              <input
                type="email"
                required
                placeholder="jordan.lee@smartcampus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

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
                <option value="Faculty/Staff">Faculty/Staff</option>
              </select>
            </div>
          </div>

          {/* Select Skills for AI Match */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Select Your Technical & Event Skills</span>
              <span className="text-[10px] text-indigo-400">Used by AI Recommendation Engine</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSkillOptions.map((sk) => {
                const active = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      active 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sk} {active && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Event Categories */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Preferred Event Categories</label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      active 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat} {active && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>

        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Log In Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
