import { useQuery } from '@tanstack/react-query';
import {
  fetchFinance,
  fetchFinanceByYear,
  fetchFinanceByYearAndMonth,
} from '../requests/finance.requests';

export const useFetchFinance = () =>
  useQuery(['finance'], async () => {
    const res = await fetchFinance();
    return res?.data;
  });

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
