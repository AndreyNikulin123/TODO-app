import React, { useCallback, useState } from 'react';
import type { Folder } from '../../types';
import { folderApi } from '../../api/folderApi';

interface FolderListProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onRefresh: () => void;
}

const FolderListComponent: React.FC<FolderListProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onRefresh,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(async () => {
    if (!newFolderName.trim()) {
      setError('Название папки не может быть пустым');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await folderApi.create({ name: newFolderName });
      setNewFolderName('');
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      setError('Ошибка при создании папки');
      console.error('Error creating folder:', err);
    } finally {
      setIsLoading(false);
    }
  }, [newFolderName, onRefresh]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Вы уверены, что хотите удалить эту папку?')) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await folderApi.delete(id);

        if (selectedFolderId === id) {
          onSelectFolder(null);
        }

        onRefresh();
      } catch (err) {
        setError('Ошибка при удалении папки');
        console.error('Error deleting folder:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFolderId, onSelectFolder, onRefresh],
  );

  return (
    <div>
      {/* Отображение ошибок */}
      {error && (
        <div
          style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '5px',
            fontSize: '12px',
          }}
        >
          {error}
        </div>
      )}

      {/* Кнопка "Все задачи" */}
      <button
        onClick={() => onSelectFolder(null)}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          background: !selectedFolderId ? '#3B82F6' : '#f5f5f5',
          color: !selectedFolderId ? 'white' : 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        Все задачи
      </button>

      {/* Список папок */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          style={{
            padding: '10px',
            marginBottom: '5px',
            background: selectedFolderId === folder.id ? '#3B82F6' : '#f5f5f5',
            color: selectedFolderId === folder.id ? 'white' : 'black',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <div
            onClick={() => !isLoading && onSelectFolder(folder.id)}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{folder.name}</span>
            <span
              style={{ fontSize: '12px', opacity: 0.7, marginLeft: '10px' }}
            >
              {folder._count?.tasks || 0}
            </span>
          </div>

          {/* Кнопка удаления */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Предотвратить выделение папки при клике на удаление
              handleDelete(folder.id);
            }}
            disabled={isLoading}
            style={{
              marginLeft: '10px',
              padding: '5px 8px',
              fontSize: '12px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {/* Форма создания папки */}
      {isCreating ? (
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Название папки"
            disabled={isLoading}
            autoFocus
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '5px',
              borderRadius: '3px',
              border: '1px solid #ccc',
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          <button
            onClick={handleCreate}
            disabled={isLoading}
            style={{
              marginRight: '5px',
              padding: '5px 10px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Загрузка...' : 'Сохранить'}
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewFolderName('');
              setError(null);
            }}
            disabled={isLoading}
            style={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Закрыть
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          + Новая папка
        </button>
      )}
    </div>
  );
};

export const FolderList = React.memo(FolderListComponent);
