import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import TaskForm from './TaskForm';

const Column = ({ id, title, tasks, onTasksUpdate }) => {
  // Define top border color based on column ID
  const topBorderColor = id === 'to-do' ? 'border-blue-400' :         // Match task card colors
                         id === 'in-progress' ? 'border-yellow-400' : // Match task card colors
                         'border-green-400';                         // Match task card colors

  return (
    <div className={`
      bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 min-h-[300px] flex flex-col
      border-t-4 ${topBorderColor}           // <-- Only keep the colored top border
    `}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px] flex-grow space-y-3"
          >
            {tasks.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-gray-500 italic">
                No tasks here yet.
              </div>
            ) : (
              <div className="min-h-[200px] flex-grow space-y-4 overflow-y-auto pr-1">
                {tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    onTasksUpdate={onTasksUpdate}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </div>
        )}
      </Droppable>
      {id === 'to-do' && <TaskForm onTasksUpdate={onTasksUpdate} />}
    </div>
  );
};

export default Column;