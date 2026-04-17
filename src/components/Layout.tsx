'use client';

import React, { useState, useCallback } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, QrCode, SignOut, UserCircle, PaintBrush, Question, CalendarBlank, Heart, SquaresFour, List, ListMagnifyingGlass } from '@phosphor-icons/react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const navItems = [
  { to: '/', icon: CheckCircle, label: 'Tasks' },
  { to: '/timer', icon: Clock, label: 'Focus' },
  { to: '/link', icon: QrCode, label: 'Link' },
  { to: '/settings', icon: PaintBrush, label: 'Appearance' },
  { to: '/help', icon: Question, label: 'Help' },
  { to: '/calendar', icon: CalendarBlank, label: 'Calendar' },
  { to: '/habits', icon: Heart, label: 'Habits' },
  { to: '/kanban', icon: SquaresFour, label: 'Kanban' },
];

const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 20 } },
};

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  label: string;
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '/');
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    x.set(e.clientX - centerX);
  };

  const handleMouseLeave = () => x.set(0);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <NavLink to={to} className="block group" aria-label={label}>
      <motion.div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-app-surface/80' : ''}`}
        style={{ x: reducedMotion ? 0 : xSpring }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        whileHover={reducedMotion ? {} : { scale: 1.01 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
      >
        <motion.div animate={{ scale: isActive ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-app-primary' : 'text-app-muted group-hover:text-app-text'}`} weight={isActive ? 'fill' : 'regular'} />
        </motion.div>
        <span className={`font-medium transition-colors ${isActive ? 'text-app-primary' : 'text-app-muted group-hover:text-app-text'}`}>{label}</span>
        {isActive && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-app-primary" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
      </motion.div>
    </NavLink>
  );
}

function MobileNavItem({ to, icon: Icon, label }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '/');
  
  return (
    <NavLink to={to} className="flex flex-col items-center justify-center w-12 h-12 rounded-xl hover:bg-app-surface/50">
      <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }} className={`flex flex-col items-center gap-1 ${isActive ? 'text-app-primary' : 'text-app-muted'}`}>
        <Icon className="w-5 h-5" />
        <span className="text-[9px] font-medium">{label}</span>
      </motion.div>
    </NavLink>
  );
}

export const Layout: React.FC = () => {
  const { user, logOut, signIn, syncId } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full bg-app-bg text-app-text font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        className="hidden md:flex flex-col w-64 border-r border-app-border/30 bg-app-card/30 backdrop-blur-md p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="flex items-center gap-3 mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <motion.div className="w-9 h-9 rounded-xl bg-gradient-to-br from-app-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-app-primary/25" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CheckCircle weight="bold" className="text-app-primary-fg w-5 h-5" />
          </motion.div>
          <h1 className="text-xl font-bold tracking-tight text-app-text">FlowForge</h1>
        </motion.div>

        <motion.nav className="flex-1 space-y-0.5" variants={sidebarVariants} initial="hidden" animate="visible">
          {navItems.slice(0, 5).map((item, i) => (
            <motion.div key={item.to} variants={itemVariants} custom={i}>
              <NavItem to={item.to} icon={item.icon} label={item.label} />
            </motion.div>
          ))}
          
          <div className="pt-6 pb-2 mt-2">
            <span className="text-[10px] font-semibold text-app-muted/40 uppercase tracking-widest px-4">Views</span>
          </div>
          
          {navItems.slice(5).map((item, i) => (
            <motion.div key={item.to} variants={itemVariants} custom={i + 5}>
              <NavItem to={item.to} icon={item.icon} label={item.label} />
            </motion.div>
          ))}
        </motion.nav>

        <motion.div className="mt-auto pt-6 border-t border-app-border/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-3 px-2 mb-4">
            {user?.photoURL ? (
              <motion.img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-app-surface" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }} />
            ) : <UserCircle className="w-9 h-9 text-app-muted" />}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-app-text truncate">{user?.displayName || 'Linked Device'}</span>
              <span className="text-xs text-app-muted font-mono truncate">{syncId}</span>
            </div>
          </div>
          <motion.button onClick={user ? logOut : signIn} className="flex items-center gap-3 px-4 py-2.5 w-full text-app-muted hover:text-red-500 transition-colors rounded-xl hover:bg-app-surface/50" whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            <SignOut className="w-4 h-4" />
            <span className="text-sm font-medium">{user ? 'Sign Out' : 'Sign In'}</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 relative overflow-y-auto overflow-x-hidden" tabIndex={-1}>
        <Outlet />
        
        {/* Footer */}
        <footer className="hidden md:block border-t border-app-border/30 bg-app-card/30 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto px-10 py-6">
            <div className="flex items-center justify-between text-sm">
              <p className="text-app-muted">Built with ❤️ by Yuvraj Sarathe</p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/Mikky-mlh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-app-muted hover:text-app-primary transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/yuvraj-sarathe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-app-muted hover:text-app-primary transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-14 bg-app-card/90 backdrop-blur-2xl border border-app-border/30 rounded-2xl flex items-center justify-around px-2 z-50 shadow-xl shadow-black/5">
        {navItems.slice(0, 5).map((item) => (
          <MobileNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </nav>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <motion.button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-full bg-app-primary text-app-primary-fg flex items-center justify-center shadow-xl shadow-app-primary/25">
          <List className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};