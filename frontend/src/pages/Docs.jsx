import React from 'react';
import { motion } from 'framer-motion';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

const sections = [
  {
    icon: 'web', color: 'blue', title: 'Frontend',
    items: [
      { title: 'React + Vite', desc: 'Lightning-fast HMR development with optimized production builds' },
      { title: 'Framer Motion', desc: 'Orchestrated page transitions, staggered reveals, spring physics' },
      { title: 'Socket.IO Client', desc: 'Real-time terminal streaming via custom useSocket hook' },
    ]
  },
  {
    icon: 'dns', color: 'purple', title: 'Backend',
    items: [
      { title: 'Express + SQLite', desc: 'RESTful API with local persistence for provisioning state' },
      { title: 'WebSocket Streams', desc: 'Real-time stdout/stderr piping to the React terminal' },
      { title: 'AWS Validator', desc: 'Pre-flight IAM credential checks before infrastructure runs' },
    ]
  },
  {
    icon: 'security', color: 'green', title: 'Infrastructure',
    items: [
      { title: 'Terraform Runner', desc: 'Async subprocess execution of init/plan/apply/destroy' },
      { title: 'Docker Compose', desc: 'Deterministic, offline-capable containerized deployments' },
      { title: 'KMS Encryption', desc: 'Managed credential generation with secure key rotation' },
    ]
  },
];

export function Docs() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto pb-16">
      <motion.header variants={fadeUp} className="mb-14">
        <p className="text-accent-blue font-semibold text-xs tracking-[0.2em] uppercase mb-3">Documentation</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
          <span className="text-gradient-hero">Platform Architecture</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
          CloudForge is a modern IDP built on a decoupled React + Node.js architecture with real-time infrastructure orchestration.
        </p>
      </motion.header>

      {/* Tech Stack Badges */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-12">
        {['React 19', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Express.js', 'Socket.IO', 'SQLite', 'Docker'].map(tech => (
          <span key={tech} className="px-3 py-1.5 glass rounded-xl text-xs font-semibold text-text-secondary">{tech}</span>
        ))}
      </motion.div>

      {/* Architecture Sections */}
      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <motion.section key={sIdx} variants={fadeUp} className="glass rounded-2xl p-8 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-${section.color}/20 to-transparent`} />
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-accent-${section.color}/10 flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-accent-${section.color} text-xl`}>{section.icon}</span>
              </div>
              <h2 className="text-xl font-bold text-text tracking-tight">{section.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-hover/50 border border-border/50">
                  <h4 className={`font-semibold text-sm text-accent-${section.color} mb-1`}>{item.title}</h4>
                  <p className="text-xs text-text-tertiary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* CTA */}
      <motion.div variants={fadeUp} className="mt-10 glass rounded-2xl p-8 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/25 to-transparent" />
        <div>
          <h3 className="text-lg font-bold text-text mb-1">Ready to deploy?</h3>
          <p className="text-text-tertiary text-sm">Launch via <code className="text-accent-blue bg-accent-blue/5 px-1.5 py-0.5 rounded text-xs">docker-compose up</code></p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => window.location.href = '/provision'}
          className="shimmer-sweep px-6 py-3 bg-accent-blue text-white rounded-xl font-semibold text-sm shadow-glow">
          Deploy Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
