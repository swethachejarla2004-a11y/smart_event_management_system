import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Key, Mail, Shield, User, Lock, Sparkles, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login({ email, password });
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl relative">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to access your Smart Campus portal.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. alex.rivera@smartcampus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Demo Shortcut Box */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Logins for Review
          </p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('alex.rivera@smartcampus.com', 'student')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-[11px] text-center"
            >
              <span className="block font-bold text-indigo-400">Student</span>

            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('organizer@smartcampus.com', 'organizer')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition-all text-[11px] text-center translate-x-16"
            >
              <span className="block font-bold text-purple-400">Organizer</span>

            </button>




          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
