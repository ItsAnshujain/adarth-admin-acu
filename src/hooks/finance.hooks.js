import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteFinanceById,
  fetchFinance,
  fetchFinanceByIndustry,
  fetchFinanceByLocation,
  fetchFinanceByRevenueGraph,
  fetchFinanceByStats,
  fetchFinanceByYear,
  fetchFinanceByYearAndMonth,
  shareRecord,
  updateFinanceById,
} from '../requests/finance.requests';

export const useFetchFinance = (enabled = true) =>
  useQuery(
    ['finance'],
    async () => {
      const res = await fetchFinance();
      return res?.data;
    },
    { enabled },
  );

export const useUpdateFinanceById = () =>
  useMutation(
    async ({ id, data }) => {
      const res = await updateFinanceById(id, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'Approval status updated successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          color: 'red',
        });
      },
    },
  );

export const useFetchFinanceByYear = (year, enabled = true) =>
  useQuery(
    ['finance-by-year', year],
    async () => {
      const res = await fetchFinanceByYear(year);
      return res?.data;
    },
    { enabled },
  );

export const useFetchFinanceByYearAndMonth = (query, enabled = true) =>
  useQuery(
    ['finance-by-month', query],
    async () => {
      const res = await fetchFinanceByYearAndMonth(query);
      return res?.data;
    },
    { enabled },
  );

export const useFetchFinanceByStats = (enabled = true) =>
  useQuery(
    ['finance-by-stats'],
    async () => {
      const res = await fetchFinanceByStats();
      return res?.data;
    },
    { enabled },
  );

export const useFetchFinanceByLocation = (query, enabled = true) =>
  useQuery(
    ['finance-by-location', query],
    async () => {
      const res = await fetchFinanceByLocation(query);
      return res?.data;
    },
    { enabled },
  );

export const useFetchFinanceByIndustry = (query, enabled = true) =>
  useQuery(
    ['finance-by-industry', query],
    async () => {
      const res = await fetchFinanceByIndustry(query);
      return res?.data;
    },
    { enabled },
  );

export const useFetchFinanceByRevenueGraph = (query, enabled = true) =>
  useQuery(
    ['finance-by-reveue-graph', query],
    async () => {
      const res = await fetchFinanceByRevenueGraph(query);
      return res?.data;
    },
    { enabled },
  );

export const useDeleteFinanceById = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ financeId, type }) => {
      const res = await deleteFinanceById(financeId, type);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['finance-by-month']);
        showNotification({
          title: 'Finance deleted successfully',
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

export const useShareRecord = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, data }) => {
      const res = await shareRecord(id, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['finance-by-month']);
        showNotification({
          title: 'Record has been shared successfully',
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
