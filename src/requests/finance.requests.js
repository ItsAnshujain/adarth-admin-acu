import http from '../utils/http';

export const fetchFinance = () => http.get('/finance');

export const fetchFinanceByYear = year => http.get(`/finance/${year}`);

export const fetchFinanceByYearAndMonth = query => http.get(`/finance/${query}`);
