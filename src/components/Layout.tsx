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