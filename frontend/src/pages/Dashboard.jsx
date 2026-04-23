import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AnimatedNumber({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const num = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) || 0 : value || 0;
    if (!num) { setCount(0); return; }
    startRef.current = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startRef.current) / duration, 1);
      setCount(Math.round(num * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{count}</>;
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

export function Dashboard() {
  const [data, setData] = useState({ stats: null, activity: [] });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/dashboard').then(r => r.json()),
      fetch('http://localhost:3000/api/health').then(r => r.json()),
    ]).then(([dash, h]) => {
      setData(dash);
      setHealth(h);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !data.stats) return (
    <div className="space-y-8">
      <div className="h-[280px] skeleton rounded-3xl" />
      <div className="grid grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-44 skeleton rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto">

      {/* ═══════ HERO SECTION ═══════ */}
      <motion.div variants={fadeUp} className="relative mb-12 overflow-hidden rounded-3xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-bg-200 to-accent-purple/10 rounded-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(96,165,250,0.12),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
        
        <div className="relative px-10 py-12 flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border">
                <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-accent-green animate-pulse' : 'bg-accent-red'}`} />
                <span className="text-xs font-medium text-text-secondary">
                  {health?.status === 'healthy' ? 'All systems operational' : 'Issues detected'}
                </span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              <span className="text-gradient-hero">Cloud</span>
              <br />
              <span className="text-gradient">Command Center</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-md leading-relaxed">
              Monitor, provision, and orchestrate your entire infrastructure from a single pane of glass.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/catalog">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="shimmer-sweep px-6 py-3 bg-accent-blue text-white rounded-2xl font-semibold text-sm shadow-glow flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Deploy Service
                </motion.button>
              </Link>
              <Link to="/resources">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 glass rounded-2xl font-semibold text-sm text-text-secondary hover:text-text flex items-center gap-2"
                >
                  View Resources
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Right: Floating stat orbs */}
          <div className="hidden lg:block relative w-[320px] h-[220px]">
            <motion.div
              animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 glass-strong rounded-2xl p-5 shadow-float"
            >
              <span className="text-text-tertiary text-xs font-medium block mb-1">Active Resources</span>
              <span className="text-3xl font-black text-gradient-blue"><AnimatedNumber value={data.stats.totalResources} /></span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-4 left-4 glass-strong rounded-2xl p-5 shadow-float"
            >
              <span className="text-text-tertiary text-xs font-medium block mb-1">Monthly Cost</span>
              <span className="text-2xl font-black text-text">{data.stats.monthlyCost}</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-1/2 left-1/3 glass-strong rounded-2xl px-4 py-3 shadow-float"
            >
              <span className="text-accent-green text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                {data.stats.systemHealth}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ═══════ BENTO STATS GRID ═══════ */}
      <motion.div variants={stagger} className="grid grid-cols-12 gap-4 mb-12">
        {/* Large stat */}
        <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="col-span-12 md:col-span-5 glass glass-hover rounded-2xl p-7 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <span className="text-text-tertiary text-xs font-semibold uppercase tracking-wider">Total Resources</span>
            <span className="material-symbols-outlined text-accent-blue text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <div className="text-5xl font-black text-gradient-blue tracking-tight mb-3">
            <AnimatedNumber value={data.stats.totalResources} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-green text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              {data.stats.totalResourcesDelta}
            </span>
          </div>
        </motion.div>

        {/* Right stack */}
        <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
          <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="glass glass-hover rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/15 to-transparent" />
            <span className="text-text-tertiary text-xs font-semibold uppercase tracking-wider block mb-4">Monthly Cost</span>
            <span className="text-3xl font-black text-text tracking-tight block mb-2">{data.stats.monthlyCost}</span>
            <span className="text-accent-red text-xs font-medium">{data.stats.monthlyCostDelta}</span>
          </motion.div>
          <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="glass glass-hover rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green/15 to-transparent" />
            <span className="text-text-tertiary text-xs font-semibold uppercase tracking-wider block mb-4">System Health</span>
            <span className="text-3xl font-black text-text tracking-tight block mb-2">{data.stats.systemHealth}</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-accent-green text-xs font-semibold">Healthy</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════ ACTIVITY + QUICK ACTIONS ═══════ */}
      <div className="grid grid-cols-12 gap-6">
        {/* Activity Feed */}
        <motion.section variants={fadeUp} className="col-span-12 lg:col-span-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text tracking-tight">Recent Activity</h3>
            <button className="text-xs text-accent-blue font-medium hover:underline underline-offset-4">View all</button>
          </div>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-border">
            {data.activity.map((act, idx) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="px-5 py-4 flex items-center gap-4 hover:bg-surface-hover transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-accent-blue text-[18px]">{act.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text truncate">
                    <span className="font-semibold">{act.user}</span> {act.action}{' '}
                    <code className="text-accent-blue text-xs bg-accent-blue/5 px-1.5 py-0.5 rounded-md">{act.resourceName}</code>
                  </p>
                  <span className="text-[11px] text-text-tertiary">{act.time}</span>
                </div>
                <span className="material-symbols-outlined text-text-tertiary text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={fadeUp} className="col-span-12 lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-text tracking-tight mb-5">Quick Actions</h3>

          <Link to="/catalog">
            <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="shimmer-sweep p-6 rounded-2xl bg-gradient-to-br from-accent-blue/15 via-bg-200 to-accent-purple/10 border border-accent-blue/15 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />
              <span className="material-symbols-outlined text-accent-blue text-2xl mb-3 block">add_box</span>
              <h4 className="text-lg font-bold text-text mb-1">Deploy Service</h4>
              <p className="text-text-tertiary text-sm">Launch infrastructure from curated templates</p>
              <span className="material-symbols-outlined text-accent-blue/30 absolute -bottom-2 -right-2 text-[80px] group-hover:text-accent-blue/15 transition-colors">rocket_launch</span>
            </motion.div>
          </Link>

          <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="shimmer-sweep p-6 rounded-2xl glass cursor-pointer group relative overflow-hidden"
          >
            <span className="material-symbols-outlined text-accent-green text-2xl mb-3 block">monitoring</span>
            <h4 className="text-lg font-bold text-text mb-1">Cloud Logs</h4>
            <p className="text-text-tertiary text-sm">Real-time telemetry & log streaming</p>
          </motion.div>

          <div className="p-5 rounded-2xl glass">
            <p className="text-text-tertiary text-xs italic leading-relaxed">"Developer productivity is a function of silence and precision."</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px w-6 bg-accent-blue/20" />
              <span className="text-[10px] text-text-tertiary/50 uppercase tracking-widest font-label">Manifesto</span>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
