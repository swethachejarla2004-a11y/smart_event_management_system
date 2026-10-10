import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Layers, 
  CheckCircle2, 
  Users,
  Award
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
          <Award className="w-4 h-4" /> Final-Year Engineering Project Documentation
        </div>
        <h1 className="text-4xl font-extrabold text-white">Smart Campus Event & Volunteer System</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          An end-to-end, production-ready web application replacing legacy Google Forms and fragmented messaging channels with intelligent matching algorithms and centralized event management.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 gap-8">
        
        <div className="glass-card p-8 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">1. Explainable AI Recommendation Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Content-based matching algorithm that analyzes student skills, interests, availability, and preferred event categories to compute a relevance score (0-100%) alongside explicit human-readable reasons.
          </p>
          <ul className="text-xs text-slate-300 space-y-2 pt-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Category Match Weight: 30%</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Skill Alignment Weight: 35%</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interest Keyword Match: 20%</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Schedule Availability Match: 15%</li>
          </ul>
        </div>
      </div>

      {/* Tech Stack Table */}
      <div className="glass-card p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" /> Complete Technology Stack
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-400 uppercase tracking-wider">Frontend</h4>
            <p className="text-slate-300">React.js 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-purple-400 uppercase tracking-wider">Backend</h4>
            <p className="text-slate-300">Node.js, Express.js REST APIs, JWT Bearer Auth, bcryptjs</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-pink-400 uppercase tracking-wider">Database & Memory</h4>
            <p className="text-slate-300">MongoDB, Mongoose ODM, Automatic MongoMemoryServer Fallback</p>
          </div>
        </div>
      </div>

      {/* Role Summary */}
      <div className="glass-card p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Role-Based Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <span className="badge-primary">Student Role</span>
            <p className="text-slate-400">Discover events, view AI match %, register for tickets, apply for volunteer tasks.</p>
          </div>
          <div className="space-y-2">
            <span className="badge-success">Organizer Role</span>
            <p className="text-slate-400">Create & manage events, review registered students, approve/reject volunteers, assign tasks, inspect analytics.</p>
          </div>
          <div className="space-y-2">
            <span className="badge-warning">Admin Role</span>
            <p className="text-slate-400">System governance, manage user roles/status, oversee campus clubs, audit events, view overall participation metrics.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
