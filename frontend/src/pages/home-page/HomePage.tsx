import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { type Folder, type Task } from "../../types";
import { folderApi } from "../../api/folderApi";
import { taskApi } from "../../api/taskApi";

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    loadFolders();
    loadTasks();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [selectedFolderId]);

  const loadFolders = async () => {
    try {
      const { data } = await folderApi.getAll();
      setFolders(data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const { data } = await taskApi.getAll({
        folderId: selectedFolderId || undefined,
      });
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2>Folders</h2>
          {user && (
            <button onClick={logout} style={{ fontSize: "12px" }}>
              Logout
            </button>
          )}
        </div>
        <button
          onClick={() => setSelectedFolderId(null)}
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
          All Tasks
        </button>

        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => setSelectedFolderId(folder.id)}
            style={{
              padding: "10px",
              marginBottom: "5px",
              background:
                selectedFolderId === folder.id ? "#3B82F6" : "#f5f5f5",
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
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Tasks ({tasks.length})</h2>

        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "15px",
              marginBottom: "10px",
              background: "#f9f9f9",
              borderRadius: "5px",
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                /* TODO */
              }}
              style={{ marginRight: "10px" }}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
