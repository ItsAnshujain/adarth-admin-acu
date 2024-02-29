import { useMutation, useQuery } from '@tanstack/react-query';
import { onApiError } from '../../utils';
import fetchCompanies, { addCompany, fetchStateAndStateCode } from '../requests/companies.requests';

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

export const useAddCompany = () =>
  useMutation(async data => {
    const res = await addCompany(data);
    return res;
  });

export const useStateAndStateCode = (search, enabled = true) =>
  useQuery({
    queryKey: ['state-and-state-code', search],
    queryFn: async () => {
      const res = await fetchStateAndStateCode(search);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export default useCompanies;
