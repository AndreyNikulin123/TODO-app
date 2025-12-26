import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import { type Task } from '../types';

type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'folder'>;

type UpdateTaskInput = Partial<CreateTaskInput>;

export function useTaskMutations() {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.create(data),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      const optimisticTasks: Task = {
        id: `temp-${Date.now()}`,
        title: newTask.title,
        completed: false,
        priority: newTask.priority,
        folderId: newTask.folderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(['tasks'], (old) => [
        optimisticTasks,
        ...(old ?? []),
      ]);

      return { previousTasks, optimisticTasksId: optimisticTasks.id };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...data } : task)),
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.filter((task) => task.id !== id),
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  return {
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
  };
}
