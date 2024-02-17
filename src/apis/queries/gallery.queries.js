import { useMutation } from '@tanstack/react-query';
import { uploadImages } from '../requests/gallery.requests';

// eslint-disable-next-line import/prefer-default-export
export const useUploadImages = () =>
  useMutation(async data => {
    const res = await uploadImages(data);
    return res;
  });
