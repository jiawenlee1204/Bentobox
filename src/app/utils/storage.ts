import { Activity } from "../types";

const STORAGE_KEY = "vibe_bento_activities";

export const loadActivities = (): Activity[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveActivities = (activities: Activity[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error("Failed to save activities:", error);
  }
};

export const addActivity = (activity: Activity): void => {
  const activities = loadActivities();
  activities.push(activity);
  saveActivities(activities);
};

export const updateActivity = (id: string, updates: Partial<Activity>): void => {
  const activities = loadActivities();
  const index = activities.findIndex((a) => a.id === id);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updates };
    saveActivities(activities);
  }
};

export const deleteActivity = (id: string): void => {
  const activities = loadActivities();
  saveActivities(activities.filter((a) => a.id !== id));
};
