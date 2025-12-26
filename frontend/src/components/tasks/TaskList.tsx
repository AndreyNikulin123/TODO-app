import React, { useCallback, useState } from 'react';
import { Priority, type Task } from '../../types';
import { useTaskMutations } from '../../hooks/useTaskMutations';

interface TaskListProps {
  tasks: Task[];
  selectedFolderId: string | null;
}

const TaskListComponent: React.FC<TaskListProps> = ({
  tasks,
  selectedFolderId,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<string>(
    Priority.MEDIUM,
  );

  const { createTask, updateTask, deleteTask } = useTaskMutations();

  const handleToggleComplete = useCallback(
    (task: Task) => {
      updateTask.mutate({
        id: task.id,
        data: { completed: !task.completed },
      });
    },
    [updateTask],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Удалить эту задачу?')) return;
      deleteTask.mutate(id);
    },
    [deleteTask],
  );

  const handleCreate = useCallback(async () => {
    if (!newTaskTitle.trim()) {
      alert('Введите название задачи');
      return;
    }

    if (!selectedFolderId) {
      alert('Выберите папку для задачи');
      return;
    }

    createTask.mutate(
      {
        title: newTaskTitle,
        completed: false,
        folderId: selectedFolderId,
        priority: newTaskPriority as Priority,
      },
      {
        onSuccess: () => {
          setNewTaskTitle('');
          setNewTaskPriority(Priority.MEDIUM);
          setIsCreating(false);
        },
      },
    );
  }, [newTaskTitle, selectedFolderId, newTaskPriority, createTask]);

  const isLoading =
    createTask.isPending || updateTask.isPending || deleteTask.isPending;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case Priority.LOW:
        return '#10b981';
      case Priority.MEDIUM:
        return '#f59e0b';
      case Priority.HIGH:
        return '#ef4444';
      default:
        return '#ccc';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case Priority.LOW:
        return 'Низкий';
      case Priority.MEDIUM:
        return 'Средний';
      case Priority.HIGH:
        return 'Высокий';
      default:
        return 'priority';
    }
  };

  return (
    <div>
      <h2>Количество задач: ({tasks.length})</h2>

      <div style={{ marginBottom: '20px' }}>
        {isCreating ? (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Название задачи"
              disabled={isLoading}
              autoFocus
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              disabled={isLoading}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: getPriorityColor(newTaskPriority),
                color: 'white',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <option value={Priority.LOW}>
                {getPriorityLabel(Priority.LOW)}
              </option>
              <option value={Priority.MEDIUM}>
                {getPriorityLabel(Priority.MEDIUM)}
              </option>
              <option value={Priority.HIGH}>
                {getPriorityLabel(Priority.HIGH)}
              </option>
            </select>

            <button
              onClick={handleCreate}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>

            <button
              onClick={() => {
                setIsCreating(false);
                setNewTaskTitle('');
                setNewTaskPriority(Priority.MEDIUM);
              }}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Добавить задачу
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <p style={{ color: '#999', marginTop: '20px' }}>
          Нет активных задач. Создайте вашу первую задачу!
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              background: '#f9f9f9',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                style={{ marginRight: '10px' }}
                disabled={isLoading}
              />
              <span
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.6 : 1,
                  marginRight: '10px',
                }}
              >
                {task.title}
              </span>

              <span
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {getPriorityLabel(task.priority)}
              </span>

              {task.folder && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    background: task.folder.color || '#ccc',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {task.folder.name}
                </span>
              )}
            </div>

            <button
              onClick={() => handleDelete(task.id)}
              disabled={isLoading}
              style={{
                marginLeft: '10px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Удалить
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export const TaskList = React.memo(TaskListComponent);
