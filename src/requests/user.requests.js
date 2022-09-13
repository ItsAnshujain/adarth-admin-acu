import http from '../utils/http';

// eslint-disable-next-line import/prefer-default-export
export const userDetails = id => http.get(`/users/${id}`); // remove eslint-disable when there's more than one variable
