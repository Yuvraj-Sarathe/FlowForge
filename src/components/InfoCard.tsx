import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

interface InfoCardProps {
  id: string;
  title: string;
  description: string;
  tips?: string[];
}

const slideAnimation = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const InfoCard: React.FC<InfoCardProps> = ({ id, title, description, tips }) => {
  const [visible, setVisible] = useState(false);
  const dismissedKey = `flowforge_info_${id}`;

  useEffect(() => {
    if (!localStorage.getItem(dismissedKey)) {
      setVisible(true);
    }
  }, [dismissedKey]);

  const dismiss = () => {
    localStorage.setItem(dismissedKey, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={slideAnimation.hidden}
          animate={slideAnimation.show}
          exit={slideAnimation.exit}
          className="mb-6 bg-gradient-to-br from-app-primary/10 to-emerald-500/5 border border-app-primary/20 rounded-2xl p-6 relative"
        >
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-app-muted hover:text-app-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-app-text mb-2">{title}</h3>
          <p className="text-app-text/80 mb-3">{description}</p>
          {tips && tips.length > 0 && (
            <ul className="space-y-1 text-sm text-app-text/70">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-app-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
