import http from '../utils/http';

export const fetchMasterTypes = () => http.get('/masters/types');

export const fetchMasters = query => http.get(`/masters?${query}`);
