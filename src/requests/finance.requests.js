import http from '../utils/http';

export const fetchFinance = () => http.get('/finance');

export const updateFinanceById = (id, data) => http.patch(`/finance/${id}`, data);

export const fetchFinanceByYear = year => http.get(`/finance/${year}`);

export const fetchFinanceByYearAndMonth = query => http.get(`/finance/${query}`);

export const fetchFinanceByStats = () => http.get('/finance/stats');

export const fetchFinanceByLocation = query => http.get(`/finance/byLocation?${query}`);

export const fetchFinanceByIndustry = query => http.get(`/finance/byIndustry?${query}`);

export const fetchFinanceByRevenueGraph = query => http.get(`/finance/revenue-graph?${query}`);
