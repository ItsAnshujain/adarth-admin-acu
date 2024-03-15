import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onApiError } from '../../utils';
import addFollowUp, { fetchFollowUps } from '../requests/followup.requests';

const useAddFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...data }) => {
      const res = await addFollowUp(id, data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['followups']);
      },
      onError: onApiError,
    },
  );
};

export const useFollowUps = ({ id, ...query }, enabled = true) =>
  useInfiniteQuery({
    queryKey: ['followups', id],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetchFollowUps(id, { ...query, page: pageParam || 1 });

      return res.data;
    },
    enabled,
    getNextPageParam: lastPage => (lastPage.hasNextPage ? +lastPage.pagingCounter + 1 : undefined),
  });

export default useAddFollowUp;
