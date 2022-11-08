/* eslint-disable import/prefer-default-export */
import http from '../utils/http';

export const campaigns = query => http.get(`/campaigns?${query}`);
