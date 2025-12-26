import { queryOptions, useQuery } from '@tanstack/react-query';
import { folderApi } from '../api/folderApi';

export function useFolder() {
  const { data, isLoading, isError } = useQuery(
    queryOptions({
      queryKey: ['folders'],
      queryFn: () => folderApi.getAll(),
      staleTime: 1000 * 60,
    }),
  );
  return {
    folders: data?.data ?? [],
    loading: isLoading,
    error: isError,
  };
}
