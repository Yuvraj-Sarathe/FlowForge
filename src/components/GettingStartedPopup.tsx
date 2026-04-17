import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Question, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export const GettingStartedPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenGettingStarted');
    if (!hasSeenPopup) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenGettingStarted', 'true');
    setIsVisible(false);
  };

  const handleGoToHelp = () => {
    localStorage.setItem('hasSeenGettingStarted', 'true');
    setIsVisible(false);
    navigate('/help');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-app-card border-2 border-app-primary/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-gradient-to-br from-app-primary/20 to-emerald-500/10 p-8 text-center relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-app-muted hover:text-app-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-app-primary/20 rounded-full flex items-center justify-center"
            >
              <Question className="w-10 h-10 text-app-primary" weight="duotone" />
            </motion.div>
            <h2 className="text-2xl font-bold text-app-text mb-2">Welcome to FlowForge!</h2>
            <p className="text-sm text-app-muted">Your productivity companion</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-app-surface/50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-app-primary text-app-primary-fg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-sm font-semibold text-app-text">Create Tasks</h4>
                  <p className="text-xs text-app-muted">Click "New Task" to add one-time or recurring tasks</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-app-surface/50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-app-primary text-app-primary-fg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-sm font-semibold text-app-text">Create Routines</h4>
                  <p className="text-xs text-app-muted">Click "New Routine" for daily habits at specific times</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-app-surface/50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-app-primary text-app-primary-fg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <h4 className="text-sm font-semibold text-app-text">Explore Features</h4>
                  <p className="text-xs text-app-muted">Calendar, Kanban board, Focus timer, and more</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={handleGoToHelp}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-app-primary text-app-primary-fg rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                View Complete Guide
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleClose}
                className="w-full px-6 py-2 text-sm text-app-muted hover:text-app-text transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
