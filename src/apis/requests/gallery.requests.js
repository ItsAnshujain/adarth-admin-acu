import http from '../http';

// eslint-disable-next-line import/prefer-default-export
export const uploadImages = data =>
  http.post('/gallery', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      hasFiles: true,
    },
  });
