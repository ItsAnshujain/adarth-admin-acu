import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onApiError } from '../../utils';
import fetchLeads, {
  addLead,
  deleteLead,
  fetchLeadById,
  fetchLeadsStats,
  updateLead,
} from '../requests/leads.requests';

const useLeads = (query, enabled = true) =>
  useQuery({
    queryKey: ['leads', query],
    queryFn: async () => {
      const res = await fetchLeads(query);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export const useLeadById = (id, enabled = true) =>
  useQuery({
    queryKey: ['leads-by-id', id],
    queryFn: async () => {
      const res = await fetchLeadById(id);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export const useLeadStats = (query, enabled = true) =>
  useQuery({
    queryKey: ['leads-stats', query],
    queryFn: async () => {
      const res = await fetchLeadsStats(query);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export const useAddLead = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async data => {
      const res = await addLead(data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['leads']);
      },
      onError: onApiError,
    },
  );
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...data }) => {
      const res = await updateLead(id, data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['leads']);
      },
      onError: onApiError,
    },
  );
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async id => {
      const res = await deleteLead(id);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['leads']);
      },
      onError: onApiError,
    },
  );
};

export default useLeads;
