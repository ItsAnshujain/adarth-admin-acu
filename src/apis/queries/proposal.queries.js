import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProposal,
  createProposalTerms,
  deleteProposal,
  fetchProposalById,
  fetchProposals,
  generateProposalPdf,
  shareProposal,
  updateProposal,
  fetchProposalTerms,
} from '../requests/proposal.requests';
import { onApiError } from '../../utils';

export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async data => {
      const res = await createProposal(data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proposals']);
        showNotification({
          title: 'Proposal added successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useFetchProposals = (query, enabled = true, retry = false) =>
  useQuery(
    ['proposals', query],
    async () => {
      const res = await fetchProposals(query);
      return res?.data;
    },
    {
      enabled,
      retry,
    },
  );

export const useFetchProposalById = (proposalId, enabled = true) =>
  useQuery(
    ['proposals-by-id', proposalId],
    async () => {
      const res = await fetchProposalById(proposalId);
      return res?.data;
    },
    {
      enabled,
    },
  );

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ proposalId, data }) => {
      const res = await updateProposal(proposalId, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proposals']);
        showNotification({
          title: 'Proposal updated successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ proposalId }) => {
      const res = await deleteProposal(proposalId);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proposals']);
        showNotification({
          title: 'Proposal deleted successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useShareProposal = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, queries, data }) => {
      const res = await shareProposal(id, queries, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['proposals-by-id']);
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useGenerateProposalPdf = () =>
  useMutation(async ({ id, queries }) => {
    const res = await generateProposalPdf(id, queries);
    return res?.data;
  });

export const useCreateProposalTerms = () =>
  useMutation({
    mutationFn: async payload => {
      const res = await createProposalTerms(payload);
      return res;
    },
    onError: onApiError,
  });

export const useProposalTerms = (query, enabled = true) =>
  useQuery({
    queryKey: ['proposal-terms', query],
    queryFn: async () => {
      const res = await fetchProposalTerms(query);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });
