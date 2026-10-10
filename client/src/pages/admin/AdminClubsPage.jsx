import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Building2, PlusCircle, Users, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Technical');
  const [description, setDescription] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCampusClubs();
      if (res.success) {
        setClubs(res.data);
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreateClub = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await adminService.createCampusClub({
        name,
        code,
        category,
        description,
        facultyLead: { name: leadName, email: leadEmail }
      });
      if (res.success) {
        setShowModal(false);
        setName('');
        setCode('');
        setDescription('');
        setLeadName('');
        setLeadEmail('');
        fetchClubs();
      }
    } catch (err) {
      alert(err.message || 'Failed to create club');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading recognized campus clubs..." />;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">College Clubs Management</h1>
          <p className="text-xs text-slate-400">Manage officially recognized student organizations, faculty leads, and club categories.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs shadow-md hover:bg-pink-500 transition-all self-start sm:self-auto flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Register New Club
        </button>
      </div>

      {clubs.length === 0 ? (
        <EmptyState
          title="No Campus Clubs Registered"
          description="Click below to register the first official college club."
          actionText="Register New Club"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club._id} className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge-primary">{club.category}</span>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{club.code}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{club.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-3">{club.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">Faculty Lead: {club.facultyLead?.name || 'Dr. Alan Vance'}</p>
                <p className="text-[10px] text-slate-500">{club.facultyLead?.email || 'lead@smartcampus.com'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-pink-500/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Register Recognized Campus Club</h3>

            <form onSubmit={handleCreateClub} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Club Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Robotics Society"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Club Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIRS-CS"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Social Service">Social Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official mission and activities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty Lead Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. Robert Lang"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Faculty Lead Email</label>
                  <input
                    type="email"
                    required
                    placeholder="lead@smartcampus.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
                >
                  {creating ? 'Registering...' : 'Register Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminClubsPage;
