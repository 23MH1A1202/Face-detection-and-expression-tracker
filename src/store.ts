import { EmotionLog } from './types';

const STORAGE_KEY = 'emotion_logs';

export function getLogs(): EmotionLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading logs from storage", e);
    return [];
  }
}

export function addLog(log: EmotionLog) {
  try {
    const logs = getLogs();
    logs.push(log);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error("Error writing logs to storage", e);
  }
}

export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}
