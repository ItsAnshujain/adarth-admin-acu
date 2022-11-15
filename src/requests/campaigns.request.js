import http from '../utils/http';

export const campaign = (id, query) => http.get(`/campaigns/${id}?${query}`);
export const campaigns = query => http.get(`/campaigns?${query}`);
export const createCampaign = data => http.post('/campaigns', data);
export const updateCampaign = (id, data) => http.patch(`/campaigns/${id}`, data);
export const deleteCampaign = query => http.delete(`/campaigns?${query}`);
