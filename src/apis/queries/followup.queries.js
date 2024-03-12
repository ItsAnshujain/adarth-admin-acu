import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onApiError } from '../../utils';
import addFollowUp from '../requests/followup.requests';

const useAddFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...data }) => {
      const res = await addFollowUp(id, data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['followup']);
      },
      onError: onApiError,
    },
  );
};

export default useAddFollowUp;
