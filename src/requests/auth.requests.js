import http from '../utils/http';

// change the url acc to api docs
export const login = data => http.post('/api/v1/auth/signin', data);

export const forgotPassword = data => http.post('/api/v1/auth/forget-password', data);

export const resetPassword = data => http.post('/api/v1/auth/reset-password', data);
