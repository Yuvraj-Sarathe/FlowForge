import React from 'react';
import { useTheme, defaultTheme } from '../contexts/ThemeContext';
import { PaintBrush, Image as ImageIcon, ArrowCounterClockwise } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
  const { theme, updateTheme } = useTheme();

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

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-[100dvh]">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-[56px] font-bold tracking-[-0.04em] leading-[0.9] text-app-text mb-4">Appearance</h1>
          <p className="text-app-muted">Customize how FlowForge looks and feels.</p>
        </div>
        <button 
          onClick={resetTheme}
          className="flex items-center gap-2 px-4 py-2 bg-app-surface text-app-text rounded-xl hover:bg-app-border transition-colors text-sm font-medium"
        >
          <ArrowCounterClockwise className="w-4 h-4" />
          Reset to Default
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section className="p-8 bg-app-card border border-app-border rounded-[24px] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-app-primary/10 flex items-center justify-center text-app-primary">
                <PaintBrush className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-medium text-app-text">Color Palette</h2>
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
          </section>
        </div>

        <div className="space-y-8">
          <section className="p-8 bg-app-card border border-app-border rounded-[24px] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-app-primary/10 flex items-center justify-center text-app-primary">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-medium text-app-text">Background Image</h2>
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
          </section>
        </div>
      </div>
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
