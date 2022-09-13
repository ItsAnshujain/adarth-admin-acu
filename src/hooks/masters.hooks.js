import { useQuery } from '@tanstack/react-query';
import { fetchMasters, fetchMasterTypes } from '../requests/masters.requests';

export const useFetchMastersTypes = (enabled = true) =>
  useQuery(
    ['masters-types'],
    async () => {
      const res = await fetchMasterTypes();
      return res?.data;
    },
    {
      enabled,
    },
  );

export const useFetchMasters = (query, enabled = true) =>
  useQuery(
    ['masters', query],
    async () => {
      const res = await fetchMasters(query);
      return res?.data;
    },
    {
      enabled,
    },
  );
