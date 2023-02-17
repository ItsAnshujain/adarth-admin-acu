import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchFinance,
  fetchFinanceByIndustry,
  fetchFinanceByLocation,
  fetchFinanceByStats,
  fetchFinanceByYear,
  fetchFinanceByYearAndMonth,
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
