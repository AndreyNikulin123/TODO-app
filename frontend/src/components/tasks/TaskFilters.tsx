import React, { useEffect, useState } from 'react';
import { Priority } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

interface TaskFilterProps {
  onFilterChange: (filters: {
    search?: string;
    completed?: boolean;
    priority?: string;
  }) => void;
}

export const TaskFilters: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState<string>('');
  const [completed, setCompleted] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch || undefined,
      completed: completed === 'all' ? undefined : completed === 'true',
      priority: priority === 'all' ? undefined : priority,
    });
  }, [debouncedSearch, completed, priority, onFilterChange]);

  return (
    <div
      style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
      }}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        style={{ flex: 1, padding: '8px' }}
      />

      <select
        value={completed}
        onChange={(e) => {
          setCompleted(e.target.value);
        }}
        style={{ padding: '8px' }}
      >
        <option value="all">Все задачи</option>
        <option value="false">Активные</option>
        <option value="true">Выполненные</option>
      </select>

      <select
        value={priority}
        onChange={(e) => {
          setPriority(e.target.value);
        }}
        style={{ padding: '8px' }}
      >
        <option value="all">Все приоритеты</option>
        <option value={Priority.LOW}>Низкий</option>
        <option value={Priority.MEDIUM}>Средний</option>
        <option value={Priority.HIGH}>Высокий</option>
      </select>
    </div>
  );
};
