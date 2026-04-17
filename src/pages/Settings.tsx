import React, { useState, useRef, useEffect } from 'react';
import { useTheme, defaultTheme } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { PaintBrush, Image as ImageIcon, ArrowCounterClockwise, Plus, Trash, LinkBreak, Check, X, Sun, Moon, Laptop, DownloadSimple, UploadSimple, SlackLogo } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Webhook as WebhookType, validateWebhookUrl } from '../lib/webhooks';
import { exportTasksAsJSON, exportTasksAsCSV, exportTasksAsMarkdown, downloadFile, readFileAsText } from '../lib/exportImport';
import { getSlackWebhooksList, addSlackWebhook, removeSlackWebhook, toggleSlackWebhook } from '../lib/slackApi';
import { WorkScheduleSettings } from '../components/WorkScheduleSettings';
import toast from 'react-hot-toast';

function BentoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-app-card border border-app-border/30 rounded-2xl p-6 ${className}`}>{children}</motion.div>;
}

export const Settings: React.FC = () => {
  const { theme, updateTheme, setMode } = useTheme();
  const { tasks } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [webhooks, setWebhooks] = useState<WebhookType[]>(() => {
    const saved = localStorage.getItem('flowforge_webhooks');
    return saved ? JSON.parse(saved) : [];
  });
  const [slackWebhooks, setSlackWebhooks] = useState(() => getSlackWebhooksList());
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [showAddSlack, setShowAddSlack] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ url: '', name: '', events: [] as string[] });
  const [newSlack, setNewSlack] = useState({ url: '', name: '' });
  const [urlError, setUrlError] = useState('');

  const saveWebhooks = (updated: WebhookType[]) => {
    setWebhooks(updated);
    localStorage.setItem('flowforge_webhooks', JSON.stringify(updated));
  };

  const handleAddWebhook = () => {
    if (!validateWebhookUrl(newWebhook.url)) {
      setUrlError('Invalid URL');
      return;
    }
    if (!newWebhook.name.trim()) {
      setUrlError('Name is required');
      return;
    }
    if (newWebhook.events.length === 0) {
      setUrlError('Select at least one event');
      return;
    }
    
    const webhook: WebhookType = {
      id: crypto.randomUUID(),
      url: newWebhook.url,
      name: newWebhook.name,
      events: newWebhook.events as any,
      enabled: true,
      createdAt: Date.now(),
    };
    
    saveWebhooks([...webhooks, webhook]);
    setNewWebhook({ url: '', name: '', events: [] });
    setShowAddWebhook(false);
    setUrlError('');
  };

  const toggleWebhookEvent = (event: string) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const toggleWebhookEnabled = (id: string) => {
    saveWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const deleteWebhook = (id: string) => {
    saveWebhooks(webhooks.filter(w => w.id !== id));
  };

  const handleColorChange = (key: keyof typeof theme, value: string) => {
    updateTheme({ [key]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTheme({ bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetTheme = () => {
    updateTheme(defaultTheme);
  };

  const handleExportJSON = () => {
    const json = exportTasksAsJSON(tasks);
    downloadFile(json, `flowforge-export-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    toast.success('Exported as JSON');
  };

  const handleExportCSV = () => {
    const csv = exportTasksAsCSV(tasks);
    downloadFile(csv, `flowforge-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success('Exported as CSV');
  };

  const handleExportMarkdown = () => {
    const md = exportTasksAsMarkdown(tasks);
    downloadFile(md, `flowforge-export-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    toast.success('Exported as Markdown');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const content = await readFileAsText(file);
      if (file.name.endsWith('.json')) {
        const imported = JSON.parse(content);
        if (imported.tasks && Array.isArray(imported.tasks)) {
          toast.success(`Imported ${imported.tasks.length} tasks`);
        }
      } else {
        toast.error('Unsupported file format');
      }
    } catch (error) {
      toast.error('Failed to import file');
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-[100dvh]">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold tracking-tight text-app-text leading-[0.9] mb-2">Appearance</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-app-muted">Customize how FlowForge looks and feels.</motion.p>
        </div>
        <motion.button onClick={() => updateTheme(defaultTheme)} className="flex items-center gap-2 px-4 py-2 bg-app-surface text-app-text rounded-xl hover:bg-app-border transition-colors text-sm font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <ArrowCounterClockwise className="w-4 h-4" />Reset to Default
        </motion.button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <BentoCard>
            <WorkScheduleSettings />
          </BentoCard>

          <BentoCard>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary"><Laptop className="w-5 h-5" /></div>
              <h2 className="text-lg font-semibold text-app-text">Theme Mode</h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMode('light')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  theme.mode === 'light' 
                    ? 'border-app-primary bg-app-primary/10 text-app-primary' 
                    : 'border-app-border text-app-muted hover:border-app-text'
                }`}
              >
                <Sun className="w-5 h-5" />
                Light
              </button>
              <button
                onClick={() => setMode('dark')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  theme.mode === 'dark' 
                    ? 'border-app-primary bg-app-primary/10 text-app-primary' 
                    : 'border-app-border text-app-muted hover:border-app-text'
                }`}
              >
                <Moon className="w-5 h-5" />
                Dark
              </button>
              <button
                onClick={() => setMode('system')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  theme.mode === 'system' 
                    ? 'border-app-primary bg-app-primary/10 text-app-primary' 
                    : 'border-app-border text-app-muted hover:border-app-text'
                }`}
              >
                <Laptop className="w-5 h-5" />
                System
              </button>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary">
                <PaintBrush className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-app-text">Color Palette</h2>
            </div>

            <div className="space-y-6">
              <ColorPicker label="Primary Accent" value={theme.appPrimary} onChange={(v) => handleColorChange('appPrimary', v)} />
              <ColorPicker label="Primary Text (on Accent)" value={theme.appPrimaryFg} onChange={(v) => handleColorChange('appPrimaryFg', v)} />
              <div className="h-px w-full bg-app-border my-4" />
              <ColorPicker label="Background" value={theme.appBg} onChange={(v) => handleColorChange('appBg', v)} />
              <ColorPicker label="Card Background" value={theme.appCard} onChange={(v) => handleColorChange('appCard', v)} />
              <ColorPicker label="Surface (Hover/Secondary)" value={theme.appSurface} onChange={(v) => handleColorChange('appSurface', v)} />
              <div className="h-px w-full bg-app-border my-4" />
              <ColorPicker label="Main Text" value={theme.appText} onChange={(v) => handleColorChange('appText', v)} />
              <ColorPicker label="Muted Text" value={theme.appMuted} onChange={(v) => handleColorChange('appMuted', v)} />
              <ColorPicker label="Borders" value={theme.appBorder} onChange={(v) => handleColorChange('appBorder', v)} />
            </div>
          </BentoCard>
        </div>

        <div className="space-y-8">
          <BentoCard>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-app-text">Background Image</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-app-text mb-2">Image URL</label>
                <input 
                  type="text" 
                  value={theme.bgImage}
                  onChange={(e) => handleColorChange('bgImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none transition-colors"
                />
              </div>

              <div className="relative w-full flex items-center py-2">
                <div className="flex-grow border-t border-app-border"></div>
                <span className="flex-shrink-0 mx-4 text-app-muted text-sm">or</span>
                <div className="flex-grow border-t border-app-border"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-app-text mb-2">Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-app-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-app-primary/10 file:text-app-primary hover:file:bg-app-primary/20 transition-all cursor-pointer"
                />
              </div>

              {theme.bgImage && (
                <div className="mt-4">
                  <p className="text-xs text-app-muted mb-2 uppercase tracking-widest">Preview</p>
                  <div 
                    className="w-full h-32 rounded-xl border border-app-border bg-cover bg-center"
                    style={{ backgroundImage: `url(${theme.bgImage})` }}
                  />
                  <button 
                    onClick={() => handleColorChange('bgImage', '')}
                    className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary">
                <DownloadSimple className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-app-text">Export Data</h2>
            </div>

            <p className="text-sm text-app-muted mb-6">
              Download your tasks in different formats for backup or use in other apps.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleExportJSON}
                className="flex flex-col items-center gap-2 p-4 bg-app-surface rounded-xl hover:bg-app-border transition-colors"
              >
                <DownloadSimple className="w-6 h-6 text-app-primary" />
                <span className="text-sm font-medium text-app-text">JSON</span>
                <span className="text-xs text-app-muted">Full backup</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex flex-col items-center gap-2 p-4 bg-app-surface rounded-xl hover:bg-app-border transition-colors"
              >
                <DownloadSimple className="w-6 h-6 text-app-primary" />
                <span className="text-sm font-medium text-app-text">CSV</span>
                <span className="text-xs text-app-muted">Spreadsheet</span>
              </button>
              <button
                onClick={handleExportMarkdown}
                className="flex flex-col items-center gap-2 p-4 bg-app-surface rounded-xl hover:bg-app-border transition-colors"
              >
                <DownloadSimple className="w-6 h-6 text-app-primary" />
                <span className="text-sm font-medium text-app-text">Markdown</span>
                <span className="text-xs text-app-muted">Obsidian/Notes</span>
              </button>
            </div>
          </BentoCard>

          <BentoCard>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary">
                <UploadSimple className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-app-text">Import Data</h2>
            </div>

            <p className="text-sm text-app-muted mb-6">
              Restore tasks from a JSON backup file.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="w-full text-sm text-app-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-app-primary/10 file:text-app-primary hover:file:bg-app-primary/20 transition-all cursor-pointer"
            />
          </BentoCard>
        </div>

        <div className="space-y-8">
          <BentoCard className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary">
                  <LinkBreak className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-medium text-app-text">Webhooks</h2>
              </div>
              <button 
                onClick={() => setShowAddWebhook(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-app-primary text-app-primary-fg rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <p className="text-sm text-app-muted mb-6">
              Receive HTTP POST requests when task events occur. Useful for automation with Zapier, Make, n8n, or custom integrations.
            </p>

            {webhooks.length === 0 ? (
              <p className="text-sm text-app-muted italic py-4">No webhooks configured yet.</p>
            ) : (
              <div className="space-y-3">
                {webhooks.map(webhook => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 bg-app-surface rounded-xl">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-app-text">{webhook.name}</h3>
                      <p className="text-xs text-app-muted truncate">{webhook.url}</p>
                      <div className="flex gap-2 mt-2">
                        {webhook.events.map(event => (
                          <span key={event} className="px-2 py-0.5 bg-app-bg text-app-muted text-xs rounded">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleWebhookEnabled(webhook.id)}
                        className={`p-2 rounded-lg transition-colors ${webhook.enabled ? 'text-green-500' : 'text-app-muted'}`}
                      >
                        {webhook.enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteWebhook(webhook.id)}
                        className="p-2 text-app-muted hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>

        <div className="space-y-8">
          <BentoCard className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4A154B]/10 flex items-center justify-center">
                  <SlackLogo className="w-5 h-5 text-[#4A154B]" />
                </div>
                <h2 className="text-lg font-medium text-app-text">Slack Integration</h2>
              </div>
              <button 
                onClick={() => setShowAddSlack(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#4A154B] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <p className="text-sm text-app-muted mb-6">
              Get notified in Slack when tasks are created, completed, or updated. Requires a Slack webhook URL.
            </p>

            {slackWebhooks.length === 0 ? (
              <p className="text-sm text-app-muted italic py-4">No Slack webhooks configured yet.</p>
            ) : (
              <div className="space-y-3">
                {slackWebhooks.map(webhook => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 bg-app-surface rounded-xl">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-app-text">{webhook.name}</h3>
                      <p className="text-xs text-app-muted truncate">{webhook.url}</p>
                      <div className="flex gap-2 mt-2">
                        {webhook.events.map(event => (
                          <span key={event} className="px-2 py-0.5 bg-app-bg text-app-muted text-xs rounded">
                            {event.replace('task.', '')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          toggleSlackWebhook(webhook.id);
                          setSlackWebhooks(getSlackWebhooksList());
                        }}
                        className={`p-2 rounded-lg transition-colors ${webhook.enabled ? 'text-green-500' : 'text-app-muted'}`}
                      >
                        {webhook.enabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => {
                          removeSlackWebhook(webhook.id);
                          setSlackWebhooks(getSlackWebhooksList());
                        }}
                        className="p-2 text-app-muted hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>
        </div>
      </div>

      <AnimatePresence>
        {showAddWebhook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddWebhook(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-app-card border border-app-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-app-text mb-4">Add Webhook</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">Name</label>
                  <input 
                    type="text" 
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Webhook"
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">URL</label>
                  <input 
                    type="text" 
                    value={newWebhook.url}
                    onChange={(e) => { setNewWebhook(prev => ({ ...prev, url: e.target.value })); setUrlError(''); }}
                    placeholder="https://your-webhook.com/endpoint"
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">Events</label>
                  <div className="flex flex-wrap gap-2">
                    {['task.created', 'task.updated', 'task.deleted', 'task.completed'].map(event => (
                      <button
                        key={event}
                        onClick={() => toggleWebhookEvent(event)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          newWebhook.events.includes(event)
                            ? 'bg-app-primary text-app-primary-fg'
                            : 'bg-app-surface text-app-muted hover:text-app-text'
                        }`}
                      >
                        {event.replace('task.', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {urlError && <p className="text-sm text-red-500">{urlError}</p>}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddWebhook(false)}
                    className="flex-1 px-4 py-2 bg-app-surface text-app-text rounded-xl font-medium hover:bg-app-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddWebhook}
                    className="flex-1 px-4 py-2 bg-app-primary text-app-primary-fg rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Add Webhook
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddSlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddSlack(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-app-card border border-app-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-app-text mb-4">Add Slack Webhook</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">Name</label>
                  <input 
                    type="text" 
                    value={newSlack.name}
                    onChange={(e) => setNewSlack(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Slack Channel"
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-text mb-2">Webhook URL</label>
                  <input 
                    type="text" 
                    value={newSlack.url}
                    onChange={(e) => setNewSlack(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
                  />
                  <p className="text-xs text-app-muted mt-2">
                    Create a webhook at: Slack → Workspace → Apps → Incoming Webhooks
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddSlack(false)}
                    className="flex-1 px-4 py-2 bg-app-surface text-app-text rounded-xl font-medium hover:bg-app-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newSlack.name && newSlack.url) {
                        addSlackWebhook(newSlack.name, newSlack.url);
                        setSlackWebhooks(getSlackWebhooksList());
                        setNewSlack({ url: '', name: '' });
                        setShowAddSlack(false);
                        toast.success('Slack webhook added');
                      }
                    }}
                    disabled={!newSlack.name || !newSlack.url}
                    className="flex-1 px-4 py-2 bg-[#4A154B] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Add Slack
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-app-text">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-app-muted uppercase">{value}</span>
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-app-border shadow-sm cursor-pointer">
          <input 
            type="color" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 w-14 h-14 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
