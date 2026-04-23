import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Terminal({ logs, isComplete, isStarted, credentials }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }} className="glass rounded-2xl h-full flex flex-col overflow-hidden shadow-card relative">
      <div className="scanline rounded-2xl" />

      {/* Header */}
      <div className="bg-surface px-5 py-3 flex items-center justify-between border-b border-border z-20">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5 mr-3">
            <div className="w-3 h-3 rounded-full bg-accent-red/50 hover:bg-accent-red transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-accent-amber/50 hover:bg-accent-amber transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-accent-green/50 hover:bg-accent-green transition-colors cursor-pointer" />
          </div>
          <span className="font-mono text-xs text-text-tertiary tracking-wider">terraform-provisioner</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isStarted && !isComplete ? 'bg-accent-green animate-pulse' : isComplete ? 'bg-accent-green' : 'bg-text-tertiary/30'}`} />
            <span className="text-[10px] font-mono text-text-tertiary uppercase">{isComplete ? 'Done' : isStarted ? 'Live' : 'Idle'}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 font-mono text-[13px] leading-relaxed overflow-y-auto bg-bg/40 z-20">
        <div className="flex flex-col gap-1 pb-6">
          <AnimatePresence initial={false}>
            {logs.map((log, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }} className="flex gap-3">
                <span className="text-text-tertiary/40 shrink-0 text-xs">{log.time}</span>
                <span className={
                  log.type === 'success' ? 'text-accent-green' :
                  log.type === 'error' ? 'text-accent-red' :
                  log.type === 'info' ? 'text-text font-semibold' :
                  log.type === 'add' ? 'text-accent-green/70' :
                  'text-text-secondary'
                }>{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {isStarted && !isComplete && (
            <div className="flex gap-3 items-center mt-1">
              <span className="text-text-tertiary/40 text-xs">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }} className="w-1.5 h-4 bg-accent-blue" />
            </div>
          )}
          {isComplete && credentials && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-accent-green/5 border border-accent-green/15 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-accent-green text-[16px]">key</span>
                <span className="text-accent-green font-bold text-xs uppercase tracking-wider">Credentials</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {Object.entries(credentials).filter(([k]) => !['master_password','password','secret_access_key'].includes(k)).map(([k, v]) => (
                  v && v !== 'N/A' && <div key={k} className="flex justify-between"><span className="text-text-tertiary capitalize">{k.replace(/_/g, ' ')}:</span><code className="text-text">{v}</code></div>
                ))}
                {(credentials.master_password || credentials.password) && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-tertiary">Password:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-text">••••••••</code>
                      <button onClick={() => navigator.clipboard.writeText(credentials.master_password || credentials.password)} className="text-accent-green hover:text-white text-[10px]">Copy</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-surface px-5 py-3 flex items-center gap-6 border-t border-border z-20 text-[10px]">
        <div><span className="text-text-tertiary font-semibold uppercase tracking-wider">Provider</span><span className="block text-accent-green font-mono text-xs mt-0.5">VALIDATED</span></div>
        <div className="h-5 w-px bg-border" />
        <div><span className="text-text-tertiary font-semibold uppercase tracking-wider">Delta</span><span className="block text-text font-mono text-xs mt-0.5">+3 / -0 / ~0</span></div>
        <div className="ml-auto"><span className="text-text-tertiary font-semibold uppercase tracking-wider">Session</span><span className="block text-text font-mono text-xs mt-0.5">tf-apply-9204</span></div>
      </div>
    </motion.div>
  );
}
