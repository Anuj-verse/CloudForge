import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } } };

export function ActiveResources() {
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = () => {
    Promise.all([
      fetch('http://localhost:3000/api/resources').then(r => r.json()),
      fetch('http://localhost:3000/api/dashboard').then(r => r.json()),
    ]).then(([res, dash]) => {
      setResources(res.resources || []);
      setStats(dash.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id) => {
    setDeletingId(id);
    fetch(`http://localhost:3000/api/resources/${id}`, { method: 'DELETE' })
      .then(() => setTimeout(() => { setResources(p => p.filter(r => r.id !== id)); setDeletingId(null); }, 500))
      .catch(() => { setDeletingId(null); fetchAll(); });
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="h-12 w-72 skeleton" />
      <div className="h-[400px] skeleton rounded-2xl" />
    </div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto">
      <motion.header variants={fadeUp} className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tight">
            <span className="text-gradient-hero">Active Resources</span>
            <span className="text-text-secondary ml-2 text-2xl font-bold">({resources.length})</span>
          </h2>
          <p className="text-text-tertiary text-sm mt-1">Fleet status: Operational • us-east-1</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="shimmer-sweep px-5 py-2.5 bg-accent-blue/10 text-accent-blue rounded-xl font-semibold text-sm border border-accent-blue/15 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          Export
        </motion.button>
      </motion.header>

      <motion.div variants={fadeUp} className="glass rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              {['Name', 'Type', 'Status', 'Address', ''].map((h, i) => (
                <th key={i} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-tertiary ${i === 4 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {resources.map((res, idx) => (
                <motion.tr key={res.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scaleY: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className={`border-b border-border/50 hover:bg-surface-hover transition-colors group ${deletingId === res.id ? 'opacity-20 pointer-events-none' : ''}`}
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-text text-sm">{res.name}</span>
                    <span className="block text-[11px] text-text-tertiary font-mono">{res.id.slice(0, 12)}...</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-accent-blue/8 border border-accent-blue/15 rounded-lg text-[10px] font-bold uppercase text-accent-blue">{res.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${res.status === 'Active' ? 'bg-accent-green' : 'bg-accent-amber'} status-pulse`} />
                      <span className="text-xs font-semibold uppercase">{res.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs font-mono text-text-secondary bg-surface-hover px-2 py-1 rounded-lg">{res.ip}</code>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button whileTap={{ scale: 0.95 }} className="px-3 py-1.5 text-xs font-semibold text-text-secondary bg-surface-hover rounded-lg hover:bg-surface-active">Restart</motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleDelete(res.id)} className="px-3 py-1.5 text-xs font-semibold text-accent-red bg-accent-red/8 rounded-lg hover:bg-accent-red/15">Destroy</motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {resources.length === 0 && (
              <tr><td colSpan="5" className="text-center py-16 text-text-tertiary">
                <span className="material-symbols-outlined text-4xl mb-2 block text-text-tertiary/50">cloud_off</span>
                No active resources
              </td></tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Bottom Stats */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Active', value: `${stats?.totalResources || 0}`, icon: 'analytics', color: 'blue' },
          { label: 'Monthly Spend', value: stats?.monthlyCost || '$0', icon: 'payments', color: 'purple' },
          { label: 'System Health', value: stats?.systemHealth || '—', icon: 'health_and_safety', color: 'green' },
        ].map((s, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ y: -2 }} className="glass glass-hover rounded-2xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-${s.color}/15 to-transparent`} />
            <div className="flex items-center justify-between mb-3">
              <span className={`material-symbols-outlined text-accent-${s.color} text-[18px]`}>{s.icon}</span>
              <span className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider">{s.label}</span>
            </div>
            <span className="text-2xl font-black text-text">{s.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
