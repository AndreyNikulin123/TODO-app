import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { type Folder, type Task } from "../../types";
import { folderApi } from "../../api/folderApi";
import { taskApi } from "../../api/taskApi";
import { TaskList } from "../../components/tasks/TaskList";
import { TaskFilters } from "../../components/tasks/TaskFilters";
import { FolderList } from "../../components/folders/FolderList";

export const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
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

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const { data } = await folderApi.getAll();
        setFolders(data);
      } catch (error) {
        console.error("Error loading folders:", error);
      }
    };

    loadFolders();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data } = await taskApi.getAll({
          folderId: selectedFolderId || undefined,
          ...filters,
        });
        setTasks(data);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks();
  }, [selectedFolderId, filters]);

  const refreshFolders = async () => {
    try {
      const { data } = await folderApi.getAll();
      setFolders(data);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  const refreshTasks = async () => {
    try {
      const { data } = await taskApi.getAll({
        folderId: selectedFolderId || undefined,
        ...filters,
      });
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
          <h2>Папки</h2>
          {user && (
            <button
              onClick={logout}
              style={{ fontSize: "12px", margin: "20px" }}
            >
              Выйти
            </button>
          )}
        </div>
        <FolderList
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onRefresh={refreshFolders}
        />
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <TaskFilters onFilterChange={setFilters} />
        <TaskList
          tasks={tasks}
          onRefresh={refreshTasks}
          selectedFolderId={selectedFolderId}
        />
      </div>
    </div>
  );
};
