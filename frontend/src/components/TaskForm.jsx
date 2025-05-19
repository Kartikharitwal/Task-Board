import React, { useState } from 'react';
import { createTask } from '../services/api';

const TaskForm = ({ onTasksUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        description,
        status: 'to-do'
      });
      setTitle('');
      setDescription('');
      // Refresh tasks
      onTasksUpdate();
    } catch (error) {
      console.error('Error creating task:', error);
      // Optionally show error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 shadow hover:shadow-md transition dark:bg-blue-700 dark:hover:bg-blue-800 font-semibold"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
