import { useQueries } from '@tanstack/react-query';
import { userDetails } from '../requests/user.details';

// remove eslint-disable when there's more than one variable
// eslint-disable-next-line import/prefer-default-export
export const useUserDetails = id =>
  useQueries(async () => {
    const data = await userDetails(id);
    return data;
  });
