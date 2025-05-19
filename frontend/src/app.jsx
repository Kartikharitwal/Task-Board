import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from './components/Header';
import Board from './components/Board';
import { fetchTasks, updateTaskStatus } from './services/api';
import TaskForm from './components/TaskForm';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [tasks, setTasks] = useState({
    'to-do': [],
    'in-progress': [],
    'done': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from local storage or default to 'light'
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode : 'light';
  });

  // Effect to apply 'dark' class and save preference
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode);
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      const organizedTasks = {
        'to-do': data.filter(task => task.status === 'to-do'),
        'in-progress': data.filter(task => task.status === 'in-progress'),
        'done': data.filter(task => task.status === 'done')
      };
      setTasks(organizedTasks);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tasks');
      setLoading(false);
      setTasks({
        'to-do': [],
        'in-progress': [],
        'done': []
      });
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const taskId = parseInt(draggableId.split('-')[1]);
    const task = Object.values(tasks).flat().find(t => t.id === taskId);
    if (!task) return;

    // Update local state for instant feedback
    const newTasks = { ...tasks };
    newTasks[source.droppableId] = newTasks[source.droppableId].filter(t => t.id !== taskId);
    const updatedTask = { ...task, status: destination.droppableId };
    newTasks[destination.droppableId] = [
      ...newTasks[destination.droppableId].slice(0, destination.index),
      updatedTask,
      ...newTasks[destination.droppableId].slice(destination.index)
    ];
    setTasks(newTasks);

    // Update backend in the background (do not await)
    updateTaskStatus(taskId, destination.droppableId)
      .catch((err) => {
        console.error('Error updating task status:', err);
        setError('Failed to update task status');
        // Optionally, revert state here if you want
      });
  };

  return (
    <div className={`min-h-screen ${darkMode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
      <Header>
        <DarkModeToggle currentMode={darkMode} toggleMode={toggleDarkMode} />
      </Header>
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Board tasks={tasks} onTasksUpdate={loadTasks} />
          </DragDropContext>
        )}
        <TaskForm onTasksUpdate={loadTasks} />
      </div>
    </div>
  );
}

// app.jsx
export default App;


