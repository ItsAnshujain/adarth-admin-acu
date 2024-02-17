import http from '../http';

// eslint-disable-next-line import/prefer-default-export
export const uploadImages = data =>
  http.post('/gallery', data, {
    hasFiles: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
