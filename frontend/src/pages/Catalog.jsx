import React, { useState, useEffect } from 'react';
import { ResourceCard } from '../components/ResourceCard';
import { motion } from 'framer-motion';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

export function Catalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/catalog')
      .then(res => res.json())
      .then(json => { setCatalog(json.catalog); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="h-10 w-72 skeleton" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => <div key={i} className="h-56 skeleton rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto">
      <motion.div variants={fadeUp} className="mb-10">
        <p className="text-accent-blue font-semibold text-xs tracking-[0.2em] uppercase mb-3">Catalog</p>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          <span className="text-gradient-hero">Service Catalog</span>
        </h2>
        <p className="text-text-secondary mt-3 text-lg max-w-lg">Select a resource to provision into your workspace.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {catalog.map((item, idx) => (
          <ResourceCard key={item.id} id={item.id} title={item.title} description={item.description}
            icon={item.icon} providerLogo={item.providerLogo} tags={item.tags} color={item.color} index={idx} />
        ))}
        <motion.div variants={fadeUp} whileHover={{ y: -4 }}
          className="group rounded-2xl p-7 flex flex-col justify-center items-center text-center cursor-pointer border border-dashed border-border hover:border-accent-blue/30 transition-colors"
        >
          <div className="w-14 h-14 rounded-full border border-dashed border-text-tertiary/30 flex items-center justify-center mb-4 group-hover:border-accent-blue/40 transition-colors">
            <span className="material-symbols-outlined text-2xl text-text-tertiary group-hover:text-accent-blue transition-colors">add</span>
          </div>
          <h3 className="font-bold text-text-secondary group-hover:text-text transition-colors">Request Template</h3>
          <p className="text-text-tertiary text-sm mt-1.5 max-w-[180px]">Need a custom Terraform module?</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
