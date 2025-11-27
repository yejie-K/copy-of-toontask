import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Timer } from 'lucide-react';
import { Todo, TodoStatus } from '../types.ts';

interface TodoItemProps {
  todo: Todo;
  onStatusChange: () => void;
  onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onStatusChange, onDelete }) => {
  const [currentTime, setCurrentTime] = useState(todo.totalTimeSeconds);

  // Timer logic
  useEffect(() => {
    let interval: number;

    if (todo.status === 'running' && todo.lastStartedAt) {
      // Update the display time every second without modifying the actual persistent state constantly
      // We calculate the live duration based on current time - start time
      interval = window.setInterval(() => {
        const now = Date.now();
        const sessionSeconds = (now - todo.lastStartedAt!) / 1000;
        setCurrentTime(todo.totalTimeSeconds + sessionSeconds);
      }, 1000);
    } else {
      // If paused or done, just show the stored total
      setCurrentTime(todo.totalTimeSeconds);
    }

    return () => clearInterval(interval);
  }, [todo.status, todo.lastStartedAt, todo.totalTimeSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic styles based on status
  const getContainerStyle = (status: TodoStatus) => {
    switch (status) {
      case 'running':
        return 'bg-orange-50 border-orange-500';
      case 'done':
        return 'bg-green-50 border-emerald-500 opacity-80';
      default:
        return 'bg-white border-slate-900';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative flex items-center justify-between p-3 rounded-2xl border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-colors duration-300 ${getContainerStyle(
        todo.status
      )}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Custom Checkbox / Status Indicator */}
        <button
          onClick={onStatusChange}
          className="relative flex-shrink-0 w-8 h-8 rounded-full border-2 border-slate-900 bg-white shadow-sm hover:scale-105 transition-transform flex items-center justify-center overflow-hidden"
          aria-label={`Change status from ${todo.status}`}
        >
          {/* Status: Running (Orange Wave) */}
          {todo.status === 'running' && (
            <motion.div
              className="absolute inset-0 bg-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}

          {/* Status: Done (Green Fill + Checkmark) */}
          {todo.status === 'done' && (
            <motion.div
              className="absolute inset-0 bg-green-500 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.path d="M20 6L9 17l-5-5" />
              </motion.svg>
            </motion.div>
          )}

          {/* Status: Idle (White empty) */}
        </button>

        {/* Text Content */}
        <span
          className={`font-semibold text-lg truncate transition-all duration-300 ${
            todo.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {todo.text}
        </span>
      </div>

      {/* Right Side: Timer & Delete */}
      <div className="flex items-center gap-3">
        {/* Timer Display */}
        {(todo.status === 'running' || todo.totalTimeSeconds > 0) && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold border-2 ${
              todo.status === 'running'
                ? 'bg-orange-200 text-orange-800 border-orange-400 animate-pulse'
                : 'bg-slate-200 text-slate-600 border-slate-300'
            }`}
          >
            <Timer className="w-3 h-3" />
            <span className="tabular-nums">{formatTime(currentTime)}</span>
          </div>
        )}

        {/* Delete Button (Only visible on hover/done) */}
        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TodoItem;