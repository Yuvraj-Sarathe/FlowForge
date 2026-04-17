import { Task } from '../contexts/TaskContext';

export const exportTasksAsJSON = (tasks: Task[]): string => {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tasks: tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      priority: t.priority,
      status: t.status,
      tags: t.tags || [],
      category: t.category || '',
      dueDate: t.dueDate || '',
      duration: t.duration || null,
      createdAt: t.createdAt,
      completedAt: t.completedAt || null,
      lastModified: t.lastModified || null,
      subtasks: t.subtasks || [],
      recurring: t.recurring || false,
      recurrenceRule: t.recurrenceRule || null,
      attachments: t.attachments || [],
    })),
  };
  return JSON.stringify(exportData, null, 2);
};

export const exportTasksAsCSV = (tasks: Task[]): string => {
  const headers = ['Title', 'Description', 'Priority', 'Status', 'Tags', 'Category', 'Due Date', 'Created At', 'Completed At'];
  const rows = tasks.map(t => [
    escapeCSV(t.title),
    escapeCSV(t.description || ''),
    t.priority,
    t.status,
    escapeCSV((t.tags || []).join('; ')),
    escapeCSV(t.category || ''),
    t.dueDate || '',
    new Date(t.createdAt).toISOString(),
    t.completedAt ? new Date(t.completedAt).toISOString() : '',
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

export const exportTasksAsMarkdown = (tasks: Task[]): string => {
  let md = '# FlowForge Tasks Export\n\n';
  md += `*Exported on ${new Date().toLocaleDateString()}*\n\n`;
  
  const incomplete = tasks.filter(t => t.status !== 'done');
  const complete = tasks.filter(t => t.status === 'done');
  
  if (incomplete.length > 0) {
    md += '## Pending Tasks\n\n';
    incomplete.forEach(t => {
      md += `- [ ] **${t.title}**`;
      if (t.priority !== 'medium') md += ` *(${t.priority})`;
      if (t.dueDate) md += ` - Due: ${new Date(t.dueDate).toLocaleDateString()}`;
      if (t.tags?.length) md += ` - Tags: ${t.tags.join(', ')}`;
      md += '\n';
      if (t.description) md += `  - ${t.description}\n`;
    });
    md += '\n';
  }
  
  if (complete.length > 0) {
    md += '## Completed Tasks\n\n';
    complete.forEach(t => {
      md += `- [x] **${t.title}**`;
      if (t.completedAt) md += ` - Completed: ${new Date(t.completedAt).toLocaleDateString()}`;
      md += '\n';
    });
  }
  
  return md;
};

const escapeCSV = (str: string): string => {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const importTasksFromJSON = (json: string): Task[] | null => {
  try {
    const data = JSON.parse(json);
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid format');
    }
    return data.tasks;
  } catch (e) {
    console.error('Import failed:', e);
    return null;
  }
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};