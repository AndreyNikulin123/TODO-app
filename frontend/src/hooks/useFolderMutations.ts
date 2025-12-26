import { useMutation, useQueryClient } from '@tanstack/react-query';
import { folderApi } from '../api/folderApi';
import type { Folder } from '../types';

type CreateFolderInput = Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>;

type UpdateFolderInput = Partial<CreateFolderInput>;

export function useFolderMutations() {
  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: (data: { name: string; color?: string }) =>
      folderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: (error) => {
      console.error('Ошибка создания папки:', error);
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderInput }) =>
      folderApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: (error) => {
      console.error('Ошибка обновления папки:', error);
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id: string) => folderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: (error) => {
      console.error('Ошибка удаления папки:', error);
    },
  });

  return {
    createFolder: createFolderMutation,
    updateFolder: updateFolderMutation,
    deleteFolder: deleteFolderMutation,
  };
}
