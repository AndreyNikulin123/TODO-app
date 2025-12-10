import React, { useState } from "react";
import type { Folder } from "../../types";
import { folderApi } from "../../api/folderApi";

interface FolderListProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onRefresh: () => void;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onRefresh,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;

    try {
      await folderApi.create({ name: newFolderName });
      setNewFolderName("");
      setIsCreating(false);
      onRefresh();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => onSelectFolder(null)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          background: !selectedFolderId ? "#3B82F6" : "#f5f5f5",
          color: !selectedFolderId ? "white" : "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Все задачи
      </button>

      {folders.map((folder) => (
        <div
          key={folder.id}
          onClick={() => onSelectFolder(folder.id)}
          style={{
            padding: "10px",
            marginBottom: "5px",
            background: selectedFolderId === folder.id ? "#3B82F6" : "#f5f5f5",
            color: selectedFolderId === folder.id ? "white" : "black",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{folder.name}</span>
          <span style={{ fontSize: "12px", opacity: 0.7 }}>
            {folder._count?.tasks || 0}
          </span>
        </div>
      ))}

      {isCreating ? (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "5px",
            }}
          />
          <button onClick={handleCreate} style={{ marginRight: "5px" }}>
            Save
          </button>
          <button onClick={() => setIsCreating(false)}>Закрыть</button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
          }}
        >
          + Новая папка
        </button>
      )}
    </div>
  );
};
