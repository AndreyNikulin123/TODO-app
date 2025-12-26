import React, { useCallback, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskFilters } from '../../components/tasks/TaskFilters';
import { FolderList } from '../../components/folders/FolderList';
import { useTask } from '../../hooks/useTask';
import { LoadingFallback } from '../../shared/ui/LoadingFallback';
import { useFolder } from '../../hooks/useFolder';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  type Filters = {
    search?: string;
    completed?: boolean;
    priority?: string;
  };

  const [filters, setFilters] = useState<Filters>({
    search: undefined,
    completed: undefined,
    priority: undefined,
  });

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTask(selectedFolderId, filters);

  const { folders, loading: foldersLoading, error: foldersError } = useFolder();

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  if (tasksLoading || foldersLoading) return <LoadingFallback />;

  if (tasksError) return <div>Ошибка загрузки задач</div>;
  if (foldersError) return <div>Ошибка загрузки папок</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: '250px',
          borderRight: '1px solid #ccc',
          padding: '20px',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h2>Папки</h2>
          {user && (
            <button
              onClick={logout}
              style={{ fontSize: '12px', margin: '20px' }}
            >
              Выйти
            </button>
          )}
        </div>
        <FolderList
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
        />
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <TaskFilters onFilterChange={handleFilterChange} />
        <TaskList tasks={tasks} selectedFolderId={selectedFolderId} />
      </div>
    </div>
  );
};
