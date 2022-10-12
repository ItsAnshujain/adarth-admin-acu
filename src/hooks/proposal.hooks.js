import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProposal,
  deleteProposal,
  fetchProposalById,
  fetchProposals,
  updateProposal,
} from '../requests/proposal.requests';

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

export const useFetchProposals = (query, enabled = true) =>
  useQuery(
    ['proposals', query],
    async () => {
      const res = await fetchProposals(query);
      return res?.data;
    },
    {
      enabled,
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
          title: 'Proposal edited successfully',
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
