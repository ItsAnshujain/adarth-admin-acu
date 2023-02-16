import { useQuery } from '@tanstack/react-query';
import {
  fetchFinance,
  fetchFinanceByIndustry,
  fetchFinanceByLocation,
  fetchFinanceByStats,
  fetchFinanceByYear,
  fetchFinanceByYearAndMonth,
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
