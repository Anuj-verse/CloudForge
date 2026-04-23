import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from './components/layout/Layout';

import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { ActiveResources } from './pages/ActiveResources';
import { Provision } from './pages/Provision';
import { Docs } from './pages/Docs';

const Placeholder = ({ icon, title }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center h-[60vh] gap-4">
    <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="material-symbols-outlined text-6xl text-text-tertiary/30">{icon}</motion.span>
    <h2 className="text-2xl font-bold text-gradient-blue">{title}</h2>
    <p className="text-text-tertiary text-sm">Coming in Phase 2</p>
  </motion.div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="resources" element={<ActiveResources />} />
        <Route path="provision" element={<Provision />} />
        <Route path="billing" element={<Placeholder icon="payments" title="Billing Dashboard" />} />
        <Route path="settings" element={<Placeholder icon="settings" title="Settings" />} />
        <Route path="docs" element={<Docs />} />
      </Route>
    </Routes>
  );
}

export default App;
