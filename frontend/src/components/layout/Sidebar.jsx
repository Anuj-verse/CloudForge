import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/catalog', label: 'Service Catalog', icon: 'inventory_2' },
  { path: '/resources', label: 'Active Resources', icon: 'memory' },
  { path: '/provision', label: 'Deploy', icon: 'rocket_launch' },
  { path: '/docs', label: 'Documentation', icon: 'menu_book' },
];

const bottomItems = [
  { path: '/billing', label: 'Billing', icon: 'payments' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen fixed left-0 top-0 z-50 flex flex-col py-4 px-2 bg-bg-100/80 backdrop-blur-2xl border-r border-border"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-6 h-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shrink-0 shadow-glow-sm">
          <span className="text-white font-bold text-sm">CF</span>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="font-bold text-sm tracking-tight text-text">CloudForge</span>
              <span className="block text-[10px] text-text-tertiary tracking-wider uppercase">Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} className="relative block">
              <motion.div
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative ${
                  isActive ? 'text-accent-blue' : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-accent-blue/8 rounded-xl border border-accent-blue/15"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`material-symbols-outlined text-[20px] relative z-10 shrink-0 ${isActive ? 'text-accent-blue' : ''}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className={`text-[13px] font-medium relative z-10 whitespace-nowrap ${isActive ? 'text-accent-blue font-semibold' : ''}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-border mx-3 my-2" />

      {/* Bottom Nav */}
      <div className="flex flex-col gap-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} className="block">
              <motion.div
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive ? 'text-accent-blue bg-accent-blue/8' : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}

        {/* User Avatar */}
        <div className="mt-2 px-2">
          <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-accent-blue shrink-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  <span className="text-[13px] font-medium text-text block leading-tight">Pranay</span>
                  <span className="text-[11px] text-text-tertiary">Developer</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
