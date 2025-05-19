    const API_URL = 'https://task-board-backend-9ig9.onrender.com/api';
// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (task) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update task status');
  return response.json();
};

// Update task details
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return true;
};

const handleDragEnd = async (result) => {
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

  // Update backend, but do NOT reload tasks here!
  try {
    await updateTaskStatus(taskId, destination.droppableId);
    // Optionally, show a toast or notification on error
  } catch (err) {
    // Optionally revert state or show error
    setError('Failed to update task status');
  }
};
