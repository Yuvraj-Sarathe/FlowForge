import { Task } from '../contexts/TaskContext';

interface SlackWebhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
}

const SLACK_STORAGE_KEY = 'flowforge_slack_webhooks';

const getSlackWebhooks = (): SlackWebhook[] => {
  try {
    const stored = localStorage.getItem(SLACK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSlackWebhooks = (webhooks: SlackWebhook[]) => {
  localStorage.setItem(SLACK_STORAGE_KEY, JSON.stringify(webhooks));
};

export const addSlackWebhook = (name: string, url: string): SlackWebhook => {
  const webhook: SlackWebhook = {
    id: crypto.randomUUID(),
    name,
    url,
    events: ['task.created', 'task.completed'],
    enabled: true,
  };
  
  const webhooks = getSlackWebhooks();
  webhooks.push(webhook);
  saveSlackWebhooks(webhooks);
  
  return webhook;
};

export const removeSlackWebhook = (id: string) => {
  const webhooks = getSlackWebhooks().filter(w => w.id !== id);
  saveSlackWebhooks(webhooks);
};

export const toggleSlackWebhook = (id: string) => {
  const webhooks = getSlackWebhooks().map(w => 
    w.id === id ? { ...w, enabled: !w.enabled } : w
  );
  saveSlackWebhooks(webhooks);
};

const sendSlackNotification = async (webhook: SlackWebhook, payload: object): Promise<boolean> => {
  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (e) {
    console.error('Failed to send Slack notification', e);
    return false;
  }
};

export const notifySlack = async (event: string, task: Task) => {
  const webhooks = getSlackWebhooks().filter(w => w.enabled && w.events.includes(event));
  
  const eventMessages: Record<string, { emoji: string; action: string }> = {
    'task.created': { emoji: ':white_check_mark:', action: 'created' },
    'task.completed': { emoji: ':ballot_box_with_check:', action: 'completed' },
    'task.updated': { emoji: ':pencil2:', action: 'updated' },
    'task.deleted': { emoji: ':wastebasket:', action: 'deleted' },
  };
  
  const { emoji, action } = eventMessages[event] || { emoji: ':memo:', action: 'modified' };
  
  const priorityEmoji: Record<string, string> = {
    high: ':red_circle:',
    medium: ':yellow_circle:',
    low: ':green_circle:',
  };
  
  for (const webhook of webhooks) {
    const payload = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${emoji} Task *${action}*: *${task.title}*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Priority:*\n${priorityEmoji[task.priority] || ''} ${task.priority || 'medium'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Status:*\n${task.status}`,
            },
          ],
        },
      ],
    };
    
    await sendSlackNotification(webhook, payload);
  }
};

export const isSlackConfigured = (): boolean => {
  return getSlackWebhooks().length > 0;
};

export const getSlackWebhooksList = (): SlackWebhook[] => {
  return getSlackWebhooks();
};