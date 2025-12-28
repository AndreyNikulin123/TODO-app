import React, { useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskFilters } from '../../components/tasks/TaskFilters';
import { FolderList } from '../../components/folders/FolderList';
import { useTask } from '../../hooks/useTask';
import { LoadingFallback } from '../../shared/ui/LoadingFallback';
import { useFolder } from '../../hooks/useFolder';
import type { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks';
import { setFilters, setSelectFolderId } from '../../store/slices/uiSlice';

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  // const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  type Filters = {
    search?: string;
    completed?: boolean;
    priority?: string;
  };

  // const [filters, setFilters] = useState<Filters>({
  //   search: undefined,
  //   completed: undefined,
  //   priority: undefined,
  // });

  const selectedFolderId = useAppSelector(
    (state: RootState) => state.ui.selectFolderId ?? null,
  );
  const filters = useAppSelector((state: RootState) => state.ui.filters);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTask(selectedFolderId, filters);

  const { folders, loading: foldersLoading, error: foldersError } = useFolder();

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  const handleSelectFolder = useCallback(
    (id: string | null) => {
      dispatch(setSelectFolderId(id));
    },
    [dispatch],
  );

  // if (tasksLoading || foldersLoading) return <LoadingFallback />;

  if (tasksError) return <div>Ошибка загрузки задач</div>;
  // if (foldersError) return <div>Ошибка загрузки папок</div>;

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
        {/* <FolderList
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={handleSelectFolder}
        /> */}
        {foldersLoading ? (
          <LoadingFallback />
        ) : foldersError ? (
          <div>Ошибка загрузки папок</div>
        ) : (
          <FolderList
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={handleSelectFolder}
          />
        )}
      </div>

      <div style={{ flex: 1, padding: '20px' }}>
        <TaskFilters onFilterChange={handleFilterChange} />
        {tasksLoading ? (
          <LoadingFallback />
        ) : (
          <TaskList tasks={tasks} selectedFolderId={selectedFolderId} />
        )}
      </div>
    </div>
  );
};
