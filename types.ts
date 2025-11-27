export type TodoStatus = 'idle' | 'running' | 'done';

export interface Todo {
  id: string;
  text: string;
  status: TodoStatus;
  createdAt: number;
  totalTimeSeconds: number; // The accumulated time before current session
  lastStartedAt: number | null; // Timestamp when the current running session started
}
