import urlcat from 'urlcat';
import http from '../http';

const fetchCompanies = payload => http.get(urlcat('/companies', payload));

export default fetchCompanies;
