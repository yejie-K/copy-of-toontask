import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { Todo, TodoStatus } from './types';
import TodoItem from './components/TodoItem';
import AddTodo from './components/AddTodo';
import ConfirmationModal from './components/ConfirmationModal';

const STORAGE_KEY = 'toontask-data';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingResetId, setPendingResetId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load todos", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      status: 'idle',
      createdAt: Date.now(),
      totalTimeSeconds: 0,
      lastStartedAt: null,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id: string, currentStatus: TodoStatus) => {
    if (currentStatus === 'idle') {
      // Idle -> Running
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: 'running', lastStartedAt: Date.now() }
            : t
        )
      );
    } else if (currentStatus === 'running') {
      // Running -> Done
      setTodos((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          
          // Calculate final time chunk
          const now = Date.now();
          const additionalSeconds = t.lastStartedAt
            ? (now - t.lastStartedAt) / 1000
            : 0;

          return {
            ...t,
            status: 'done',
            lastStartedAt: null,
            totalTimeSeconds: t.totalTimeSeconds + additionalSeconds,
          };
        })
      );
    } else if (currentStatus === 'done') {
      // Done -> Idle (Requires Confirmation)
      setPendingResetId(id);
      setModalOpen(true);
    }
  };

  const confirmReset = () => {
    if (pendingResetId) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === pendingResetId
            ? { ...t, status: 'idle', totalTimeSeconds: 0, lastStartedAt: null }
            : t
        )
      );
    }
    setModalOpen(false);
    setPendingResetId(null);
  };

  const cancelReset = () => {
    setModalOpen(false);
    setPendingResetId(null);
  };

  // Sort todos: Running first, then Idle, then Done
  const sortedTodos = [...todos].sort((a, b) => {
    const statusOrder: Record<TodoStatus, number> = { running: 0, idle: 1, done: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100 p-4 font-fredoka">
      {/* Main Widget Container */}
      <div className="w-full max-w-md bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col h-[80vh] max-h-[800px]">
        
        {/* Header */}
        <div className="bg-yellow-300 p-6 border-b-4 border-slate-900 flex flex-col gap-2">
          <div className="flex items-center justify-between">
             <h1 className="text-3xl font-bold text-slate-900 tracking-wide">My Tasks</h1>
             <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border-2 border-slate-900 shadow-sm">
                <CalendarDays className="w-5 h-5 text-sky-500" />
                <span className="font-bold text-slate-700">{format(new Date(), 'MMM d')}</span>
             </div>
          </div>
          <p className="text-slate-700 font-medium opacity-80">
            {todos.filter(t => t.status === 'done').length}/{todos.length} completed
          </p>
        </div>

        {/* List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedTodos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
               <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                 <span className="text-4xl">📝</span>
               </div>
               <p className="text-lg font-bold">Nothing to do yet!</p>
            </div>
          ) : (
            sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onStatusChange={() => handleStatusChange(todo.id, todo.status)}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t-4 border-slate-900">
          <AddTodo onAdd={addTodo} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </div>
  );
}
