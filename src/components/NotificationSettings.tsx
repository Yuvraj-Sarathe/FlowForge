import React, { useState, useEffect } from 'react';
import { Bell, BellSlash } from '@phosphor-icons/react';

export const NotificationSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const enabled = localStorage.getItem('flowforge_notifications_enabled') === 'true';
      setNotificationsEnabled(enabled && Notification.permission === 'granted');
    }
  }, []);

  const handleToggle = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'denied') {
      alert('Notifications are blocked. Please enable them in your browser settings.');
      return;
    }

    if (!notificationsEnabled) {
      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('flowforge_notifications_enabled', 'true');
          new Notification('FlowForge Notifications Enabled', {
            body: 'You will now receive reminders for your tasks',
            icon: '/icon-192.svg'
          });
        }
      } else if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('flowforge_notifications_enabled', 'true');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('flowforge_notifications_enabled', 'false');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {notificationsEnabled ? (
            <Bell className="w-5 h-5 text-app-primary" />
          ) : (
            <BellSlash className="w-5 h-5 text-app-muted" />
          )}
          <div>
            <h3 className="text-sm font-medium text-app-text">Task Notifications</h3>
            <p className="text-xs text-app-muted">Get reminders for upcoming tasks</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full transition-colors ${
            notificationsEnabled ? 'bg-app-primary' : 'bg-app-border'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {permission === 'denied' && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs text-red-600 dark:text-red-400">
            Notifications are blocked. Please enable them in your browser settings to receive task reminders.
          </p>
        </div>
      )}

      {notificationsEnabled && (
        <div className="p-3 bg-app-surface rounded-lg">
          <p className="text-xs text-app-muted">
            You'll receive notifications 15 minutes before tasks are due and for daily routines at their scheduled time.
          </p>
        </div>
      )}
    </div>
  );
};
