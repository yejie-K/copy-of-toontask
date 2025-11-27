import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all font-bold text-slate-700"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-sky-400 hover:bg-sky-500 active:translate-y-1 disabled:opacity-50 disabled:active:translate-y-0 text-white p-3 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6 stroke-[3px]" />
      </button>
    </form>
  );
};

export default AddTodo;
