import { useQuery } from '@tanstack/react-query';
import { userDetails } from '../requests/user.requests';

// remove eslint-disable when there's more than one variable
// eslint-disable-next-line import/prefer-default-export
export const fetchUserDetails = id =>
  useQuery(
    ['user-details', id],
    async () => {
      const data = await userDetails(id);
      return data;
    },
    {
      enabled: !!id,
    },
  );
