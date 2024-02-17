import { useMutation } from '@tanstack/react-query';
import { uploadImages } from '../requests/gallery.requests';

// eslint-disable-next-line import/prefer-default-export
export const useUploadImages = () =>
  useMutation(async files => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const res = await uploadImages(formData);
    return res;
  });
