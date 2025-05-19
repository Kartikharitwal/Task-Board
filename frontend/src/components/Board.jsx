import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import TaskForm from './TaskForm';

const Board = ({ tasks, onTasksUpdate }) => {
  const columns = [
    { id: 'to-do', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(column => (
        <Column
          key={column.id}
          id={column.id}
          title={column.title}
          tasks={tasks[column.id]}
          onTasksUpdate={onTasksUpdate}
        />
      ))}
    </div>
  );
};

export default Board;
