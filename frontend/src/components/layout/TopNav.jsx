import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`sticky top-0 z-40 flex items-center justify-between px-8 lg:px-12 py-3 transition-all duration-300 ${
        scrolled ? 'bg-bg/60 backdrop-blur-2xl border-b border-border' : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Left: Breadcrumb / Context */}
      <div className="flex items-center gap-3">
        <span className="text-text-tertiary text-sm font-mono">~/cloud-operator</span>
        <span className="text-text-tertiary/30">/</span>
        <span className="text-text-secondary text-sm">workspace</span>
      </div>

      {/* Center: Command Bar */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center gap-3 px-4 py-2 glass rounded-2xl min-w-[320px] group"
      >
        <span className="material-symbols-outlined text-text-tertiary text-[18px]">search</span>
        <span className="text-text-tertiary text-sm flex-1 text-left">Search or run command...</span>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-surface-hover rounded-md text-[10px] text-text-tertiary font-mono border border-border">⌘</kbd>
          <kbd className="px-1.5 py-0.5 bg-surface-hover rounded-md text-[10px] text-text-tertiary font-mono border border-border">K</kbd>
        </div>
      </motion.button>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {['notifications', 'help_outline'].map(icon => (
          <motion.button
            key={icon}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-hover transition-colors text-text-tertiary hover:text-text-secondary"
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {icon === 'notifications' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-green rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.header>
  );
}
