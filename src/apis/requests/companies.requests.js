import urlcat from 'urlcat';
import http from '../http';

const fetchCompanies = payload => http.get(urlcat('/companies', payload));

export const addCompany = payload => http.post('/companies', payload);

export const fetchStateAndStateCode = search => http.get(urlcat(`/states?search=${search}`));

export default fetchCompanies;
