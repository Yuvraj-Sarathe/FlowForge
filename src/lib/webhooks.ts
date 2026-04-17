export interface Webhook {
  id: string;
  url: string;
  name: string;
  events: WebhookEvent[];
  enabled: boolean;
  createdAt: number;
}

export type WebhookEvent = 'task.created' | 'task.updated' | 'task.deleted' | 'task.completed';

export const triggerWebhooks = async (
  webhooks: Webhook[],
  event: WebhookEvent,
  data: any
): Promise<void> => {
  const payload = {
    event,
    data,
    timestamp: Date.now(),
    source: 'flowforge',
  };

  const triggers = webhooks.filter(w => w.enabled && w.events.includes(event));

  await Promise.allSettled(
    triggers.map(async (webhook) => {
      try {
        await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-FlowForge-Event': event,
            'X-FlowForge-Webhook-Id': webhook.id,
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error(`Webhook failed for ${webhook.name}:`, error);
      }
    })
  );
};

export const createWebhookPayload = (
  event: WebhookEvent,
  task: any
): object => {
  const basePayload = {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    tags: task.tags,
    category: task.category,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.lastModified,
  };

  switch (event) {
    case 'task.created':
      return { ...basePayload, action: 'created' };
    case 'task.updated':
      return { ...basePayload, action: 'updated' };
    case 'task.deleted':
      return { id: task.id, title: task.title, action: 'deleted' };
    case 'task.completed':
      return { ...basePayload, action: 'completed', completedAt: task.completedAt };
    default:
      return basePayload;
  }
};

export const validateWebhookUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};