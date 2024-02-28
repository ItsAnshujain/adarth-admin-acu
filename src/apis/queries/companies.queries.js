import { useQuery } from '@tanstack/react-query';
import { onApiError } from '../../utils';
import fetchCompanies from '../requests/companies.requests';

const useCompanies = (query, enabled = true) =>
  useQuery({
    queryKey: ['companies', query],
    queryFn: async () => {
      const res = await fetchCompanies(query);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export default useCompanies;
