import { taskApi } from "../../api/taskApi";
import type { Task } from "../../types";

interface TaskListProps {
  tasks: Task[];
  onRefresh: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onRefresh }) => {
  const handleToggleComplete = async (task: Task) => {
    try {
      await taskApi.update(task.id, { completed: !task.completed });
      onRefresh();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await taskApi.delete(id);
      onRefresh();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h2>Количество задач: ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p style={{ color: "#999", marginTop: "20px" }}>
          Нет активных задач. Создайте вашу первую задачу!
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "15px",
              marginBottom: "10px",
              background: "#f9f9f9",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
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
              {task.folder && (
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "12px",
                    background: task.folder.color || "#ccc",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {task.folder.name}
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Удалить
            </button>
          </div>
        ))
      )}
    </div>
  );
};
