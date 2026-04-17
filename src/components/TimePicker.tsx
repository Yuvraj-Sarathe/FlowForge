import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from '@phosphor-icons/react';

interface TimePickerProps {
  value: string; // HH:mm format (24-hour)
  onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hourNum = parseInt(h);
      setHour(hourNum > 12 ? String(hourNum - 12).padStart(2, '0') : h);
      setMinute(m);
      setPeriod(hourNum >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleConfirm = () => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    onChange(`${String(hour24).padStart(2, '0')}:${minute}`);
    setIsOpen(false);
  };

  const formatDisplay = () => {
    return `${hour}:${minute} ${period}`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text text-left hover:border-app-primary transition-colors flex items-center gap-2"
      >
        <Clock className="w-4 h-4 text-app-muted" />
        {formatDisplay()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 bg-app-card border border-app-border rounded-xl shadow-xl z-50 p-4"
            >
              <div className="flex gap-2 mb-4">
                {/* Hours */}
                <div className="flex flex-col">
                  <label className="text-xs text-app-muted mb-2 text-center">Hour</label>
                  <div className="h-40 w-16 overflow-y-auto bg-app-surface rounded-lg border border-app-border scrollbar-thin">
                    {hours.map(h => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHour(h)}
                        className={`w-full py-2 text-sm transition-colors ${
                          hour === h
                            ? 'bg-app-primary text-app-primary-fg font-semibold'
                            : 'text-app-text hover:bg-app-border'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div className="flex flex-col">
                  <label className="text-xs text-app-muted mb-2 text-center">Minute</label>
                  <div className="h-40 w-16 overflow-y-auto bg-app-surface rounded-lg border border-app-border scrollbar-thin">
                    {minutes.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMinute(m)}
                        className={`w-full py-2 text-sm transition-colors ${
                          minute === m
                            ? 'bg-app-primary text-app-primary-fg font-semibold'
                            : 'text-app-text hover:bg-app-border'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM */}
                <div className="flex flex-col">
                  <label className="text-xs text-app-muted mb-2 text-center">Period</label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setPeriod('AM')}
                      className={`w-16 py-3 rounded-lg text-sm font-medium transition-colors ${
                        period === 'AM'
                          ? 'bg-app-primary text-app-primary-fg'
                          : 'bg-app-surface text-app-text hover:bg-app-border'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeriod('PM')}
                      className={`w-16 py-3 rounded-lg text-sm font-medium transition-colors ${
                        period === 'PM'
                          ? 'bg-app-primary text-app-primary-fg'
                          : 'bg-app-surface text-app-text hover:bg-app-border'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-2 bg-app-primary text-app-primary-fg rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Confirm
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
