import { Task } from '../contexts/TaskContext';

const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;

interface NotionTask {
  properties: {
    Name: { title: Array<{ plain_text: string }> };
    Description?: { rich_text: Array<{ plain_text: string }> };
    Status: { select: { name: string } };
    Priority?: { select: { name: string } };
    DueDate?: { date: { start: string } };
    Tags?: { multi_select: Array<{ name: string }> };
  };
}

export const exportToNotion = async (tasks: Task[]): Promise<{ success: number; failed: number }> => {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    throw new Error('Notion API not configured. Set VITE_NOTION_API_KEY and VITE_NOTION_DATABASE_ID in .env');
  }

  let success = 0;
  let failed = 0;

  for (const task of tasks) {
    try {
      const statusMap: Record<string, string> = {
        'todo': 'Not started',
        'in-progress': 'In progress',
        'done': 'Done',
      };

      const priorityMap: Record<string, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
      };

      const notionTask: Partial<NotionTask> = {
        properties: {
          Name: { title: [{ plain_text: task.title }] },
          Status: { select: { name: statusMap[task.status] || 'Not started' } },
        },
      };

      if (task.description) {
        notionTask.properties.Description = {
          rich_text: [{ plain_text: task.description }],
        };
      }

      if (task.priority) {
        notionTask.properties.Priority = {
          select: { name: priorityMap[task.priority] || 'Medium' },
        };
      }

      if (task.dueDate) {
        notionTask.properties.DueDate = {
          date: { start: task.dueDate },
        };
      }

      if (task.tags && task.tags.length > 0) {
        notionTask.properties.Tags = {
          multi_select: task.tags.map(tag => ({ name: tag })),
        };
      }

      const response = await fetch(`https://api.notion.com/v1/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          ...notionTask,
        }),
      });

      if (response.ok) {
        success++;
      } else {
        failed++;
      }
    } catch (e) {
      failed++;
    }
  }

  return { success, failed };
};

export const importFromNotion = async (): Promise<Task[]> => {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    throw new Error('Notion API not configured');
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Notion');
  }

  const data = await response.json();
  const importedTasks: Task[] = [];

  for (const page of data.results) {
    const task = page as unknown as NotionTask;
    const title = task.properties.Name?.title?.[0]?.plain_text || 'Untitled';
    const description = task.properties.Description?.rich_text?.[0]?.plain_text;
    const statusMap: Record<string, Task['status']> = {
      'Not started': 'todo',
      'In progress': 'in-progress',
      'Done': 'done',
    };
    const status = statusMap[task.properties.Status?.select?.name || 'Not started'] || 'todo';
    const priorityMap: Record<string, Task['priority']> = {
      'Low': 'low',
      'Medium': 'medium',
      'High': 'high',
    };
    const priority = priorityMap[task.properties.Priority?.select?.name || 'Medium'] || 'medium';
    const dueDate = task.properties.DueDate?.date?.start;
    const tags = task.properties.Tags?.multi_select?.map(t => t.name) || [];

    importedTasks.push({
      id: crypto.randomUUID(),
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      syncId: '',
      createdAt: Date.now(),
    });
  }

  return importedTasks;
};

export const isNotionConfigured = (): boolean => {
  return !!(NOTION_API_KEY && NOTION_DATABASE_ID);
};