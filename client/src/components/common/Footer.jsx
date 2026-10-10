import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Smart Campus System</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            A unified, intelligent event discovery, volunteer matching, and QR-based attendance ecosystem empowering university students, organizers, and administration.
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-400">
            <Shield className="w-4 h-4" />
            <span>Final-Year Engineering Capstone Project</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/events" className="hover:text-indigo-400 transition-colors">Browse Events</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About System</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Student Login</Link></li>
            <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link></li>
          </ul>
        </div>

        {/* Portals */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Access Portals</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/student/dashboard" className="hover:text-indigo-400 transition-colors">Student Portal</Link></li>
            <li><Link to="/organizer/dashboard" className="hover:text-indigo-400 transition-colors">Organizer Portal</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors">Admin Governance</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Smart Campus Management System. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted for Excellence <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> on React & Express
        </p>
      </div>
    </footer>
  );
};

export default Footer;
