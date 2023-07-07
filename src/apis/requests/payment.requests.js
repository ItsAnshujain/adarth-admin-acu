import urlcat from 'urlcat';
import http from '../http';

export const fetchPayment = payload => http.get(urlcat('/payment', payload));

export const fetchPaymentById = id => http.get(urlcat('/payment/:id', { id }));

export const createPayment = payload => http.post(urlcat('/payment'), payload);
