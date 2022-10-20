import http from '../utils/http';

export const changePassword = data => http.patch('/settings/change-password', data);

export const updateNotification = data => http.patch('/settings/notification', data);

export const deleteAccount = userId => http.delete(`/users/${userId}`);
