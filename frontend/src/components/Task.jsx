import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { updateTask, deleteTask } from '../services/api';

const Task = ({ task, index, onTasksUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    try {
      await updateTask(task.id, {
        title: editTitle,
        description: editDescription,
        status: task.status,
      });
      setIsEditing(false);
      await onTasksUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        await onTasksUpdate();
      } catch (error) {
        console.macroerror('Error deleting task:', error);
      }
    }
  };

  // Define accent border color based on task status (Light/Dark)
  const lightAccentColor = task.status === 'to-do' ? 'border-blue-400' :
                           task.status === 'in-progress' ? 'border-yellow-400' :
                           'border-green-400';

  const darkAccentColor = task.status === 'to-do' ? 'dark:border-blue-600' :
                          task.status === 'in-progress' ? 'dark:border-yellow-600' :
                          'dark:border-green-600';

  return (
    <Draggable draggableId={`task-${task.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white dark:bg-gray-700
            ${lightAccentColor} ${darkAccentColor} border-l-4
            p-4 rounded-lg shadow-sm dark:shadow-md
            transition-all duration-150 ease-in-out

            ${snapshot.isDragging ? 'rotate-2 shadow-lg dark:shadow-xl' : ''}
            hover:shadow-md dark:hover:shadow-lg
            hover:-translate-y-1
            cursor-grab active:cursor-grabbing
          `}
        >
          {isEditing ? (
            <form onSubmit={handleSave}>
              <input
                className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 transition"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
                required
              />
              <textarea
                className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 transition"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Task description (optional)"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-grow mr-4 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 break-words min-w-0">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 text-sm mt-1 dark:text-gray-300 break-words whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 text-sm flex-shrink-0">
                <button
                  onClick={handleEdit}
                  className="text-blue-600 hover:underline focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:underline focus:outline-none dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;