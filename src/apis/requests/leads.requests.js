import urlcat from 'urlcat';
import http from '../http';

const fetchLeads = query => http.get(`/lead?${query}`);

export const fetchLeadsStats = query => http.get(urlcat(`/lead/stats?${query}`));

export const fetchLeadById = id => http.get(`/lead/${id}`);

export const addLead = payload => http.post('/lead', payload);

export const updateLead = (id, payload) => http.patch(`/lead/${id}`, payload);

export const deleteLead = id => http.delete(`/lead/${id}`);

export default fetchLeads;