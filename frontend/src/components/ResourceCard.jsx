import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function ResourceCard({ id, title, description, icon, providerLogo, tags, color = "primary", index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      onClick={() => navigate(`/provision?service=${id}`)}
      className="group glass glass-hover rounded-2xl p-7 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${color === 'tertiary' ? 'via-accent-green/25' : 'via-accent-blue/25'} to-transparent`} />

      {/* Provider logo */}
      <div className="absolute top-5 right-5 w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity duration-300">
        <img src={providerLogo} alt="" className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
      </div>

      <div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${color === 'tertiary' ? 'bg-accent-green/10' : 'bg-accent-blue/10'}`}>
          <span className={`material-symbols-outlined text-xl ${color === 'tertiary' ? 'text-accent-green' : 'text-accent-blue'}`}>{icon}</span>
        </div>
        <h3 className="text-lg font-bold text-text mb-1.5 tracking-tight">{title}</h3>
        <p className="text-text-tertiary text-sm leading-relaxed mb-5">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-surface-hover border border-border rounded-lg text-[10px] font-semibold tracking-wider uppercase text-text-tertiary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        className={`shimmer-sweep w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${
          color === 'tertiary'
            ? 'bg-accent-green/10 text-accent-green border border-accent-green/15 hover:bg-accent-green/15'
            : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/15 hover:bg-accent-blue/15'
        }`}
      >
        Configure
      </motion.button>
    </motion.div>
  );
}
