import http from '../http';

// eslint-disable-next-line import/prefer-default-export
export const uploadImages = data =>
  http.post('/gallery', data, {
    hasFiles: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchGalleryImages = query => http.get(`/gallery?${query}`);

export const deleteImages = ids => http.delete(`/gallery/${ids}`);
