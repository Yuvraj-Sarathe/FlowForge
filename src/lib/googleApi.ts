// Pull-only functions for Google Calendar and Tasks

export const fetchGoogleTasks = async (token: string): Promise<{ tasks: any[], taskListId: string }> => {
  try {
    const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!listsRes.ok) {
      const err = await listsRes.text();
      throw new Error(`Failed to fetch task lists: ${err}`);
    }
    
    const listsData = await listsRes.json();
    const defaultList = listsData.items?.[0];
    if (!defaultList) return { tasks: [], taskListId: '' };

    const tasksRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList.id}/tasks?showHidden=false&showCompleted=true`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!tasksRes.ok) {
      const err = await tasksRes.text();
      throw new Error(`Failed to fetch tasks: ${err}`);
    }
    
    const tasksData = await tasksRes.json();
    return { tasks: tasksData.items || [], taskListId: defaultList.id };
  } catch (error) {
    console.error('Error fetching Google Tasks:', error);
    throw error;
  }
};

export const fetchGoogleCalendarEvents = async (token: string) => {
  try {
    const timeMin = new Date();
    timeMin.setHours(0, 0, 0, 0);
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 7); // Next 7 days

    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch calendar events: ${err}`);
    }
    
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Calendar Events:', error);
    throw error;
  }
};
