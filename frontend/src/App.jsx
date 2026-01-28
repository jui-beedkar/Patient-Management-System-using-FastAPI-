import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ArrowUpDown,
  Trash2,
  Edit3,
  User,
  Activity,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from './api';

const App = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city: '',
    age: '',
    gender: 'male',
    height: '',
    weight: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await api.getPatients();
      setPatients(Object.values(data));
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (field) => {
    const newOrder = sortBy === field && order === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setOrder(newOrder);

    // Note: The /sort endpoint only supports height, weight, bmi
    if (['height', 'weight', 'bmi'].includes(field)) {
      try {
        const sortedData = await api.sortPatients(field, newOrder);
        setPatients(sortedData);
      } catch (error) {
        console.error('Error sorting patients:', error);
      }
    } else {
      // Manual sort for other fields if needed, or just skip
      const sorted = [...patients].sort((a, b) => {
        if (newOrder === 'asc') return a[field] > b[field] ? 1 : -1;
        return a[field] < b[field] ? 1 : -1;
      });
      setPatients(sorted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.updatePatient(editingPatient.id, formData);
      } else {
        await api.createPatient(formData);
      }
      fetchPatients();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.detail || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        id: patient.id,
        name: patient.name,
        city: patient.city,
        age: patient.age,
        gender: patient.gender,
        height: patient.height,
        weight: patient.weight
      });
    } else {
      setEditingPatient(null);
      setFormData({
        id: 'P' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        name: '',
        city: '',
        age: '',
        gender: 'male',
        height: '',
        weight: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(p => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;

    const nameMatch = p.name?.toLowerCase().includes(searchTerm);
    const idMatch = p.id?.toLowerCase().includes(searchTerm);
    const cityMatch = p.city?.toLowerCase().includes(searchTerm);

    return nameMatch || idMatch || cityMatch;
  });

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'var(--header-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AuraHealth
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Patient Management Intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={toggleTheme} style={{ width: '48px', height: '48px', padding: 0 }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={20} /> Add Patient
          </button>
        </div>
      </header>

      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              style={{ paddingLeft: '3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3rem', color: 'var(--text-color)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => handleSort('bmi')}>
              BMI <ArrowUpDown size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => handleSort('age')}>
              Age <ArrowUpDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{patient.name}</h3>
                    <code style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{patient.id}</code>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openModal(patient)} style={{ color: 'var(--text-muted)' }} className="btn-icon"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(patient.id)} style={{ color: 'var(--danger)' }} className="btn-icon"><Trash2 size={18} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Calendar size={16} /> {patient.age} yrs
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <MapPin size={16} /> {patient.city}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <Activity size={16} /> {patient.height}m / {patient.weight}kg
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>BMI Score</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{patient.bmi}</div>
                </div>
                <span className={`badge badge-${patient.verdict.toLowerCase()}`}>
                  {patient.verdict}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                <button onClick={closeModal} style={{ color: 'var(--text-muted)' }}><X /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Patient ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    disabled={!!editingPatient}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Height (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={e => setFormData({ ...formData, height: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={e => setFormData({ ...formData, weight: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {editingPatient ? 'Save Changes' : 'Create Patient'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .btn-icon {
          background: var(--glass);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-icon:hover {
          background: var(--glass);
          color: var(--primary-color);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default App;
