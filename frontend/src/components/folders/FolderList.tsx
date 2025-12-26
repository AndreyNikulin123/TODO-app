import React, { useCallback, useState } from 'react';
import type { Folder } from '../../types';
import { useFolderMutations } from '../../hooks/useFolderMutations';

interface FolderListProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
}

const FolderListComponent: React.FC<FolderListProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { createFolder, updateFolder, deleteFolder } = useFolderMutations();

  const handleCreate = useCallback(async () => {
    if (!newFolderName.trim()) {
      alert('Название папки не может быть пустым');
      return;
    }

    createFolder.mutate({
      name: newFolderName,
    });
    setNewFolderName('');
    setIsCreating(false);
  }, [newFolderName, createFolder]);

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm('Удалить эту папку?')) return;

      deleteFolder.mutate(id, {
        onSuccess: () => {
          if (id === selectedFolderId) {
            onSelectFolder(null);
          }
        },
      });
    },
    [deleteFolder, selectedFolderId, onSelectFolder],
  );

  const isLoading =
    createFolder.isPending || updateFolder.isPending || deleteFolder.isPending;

  return (
    <div>
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

          <button
            onClick={(e) => {
              e.stopPropagation();
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
