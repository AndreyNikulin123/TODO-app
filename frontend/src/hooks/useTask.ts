import { queryOptions, useQuery } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';

type Filters = {
  search?: string;
  completed?: boolean;
  priority?: string;
};

export function useTask(folderId: string | null, filters: Filters) {
  const { data, isLoading, isError, refetch } = useQuery(
    queryOptions({
      queryKey: ['tasks', folderId, filters],
      queryFn: () =>
        taskApi.getAll({
          folderId: folderId ?? undefined,
          ...filters,
        }),
      staleTime: 1000 * 60,
    }),
  );
  return {
    tasks: data?.data ?? [],
    loading: isLoading,
    error: isError,
    refresh: refetch,
  };
}
