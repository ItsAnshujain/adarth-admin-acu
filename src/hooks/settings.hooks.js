import { showNotification } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changePassword, deleteAccount, updateNotification } from '../requests/settings.requests';

export const useChangePassword = () =>
  useMutation(
    async data => {
      const res = await changePassword(data);
      return res;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'Password',
          message: 'Password changed successfully',
          autoClose: 3000,
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          autoClose: 3000,
          color: 'red',
        });
      },
    },
  );

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async data => {
      const res = await updateNotification(data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users-by-id']);
        showNotification({
          title: 'Notification',
          message: 'Notifications updated successfully',
          autoClose: 3000,
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          autoClose: 3000,
          color: 'red',
        });
      },
    },
  );
};

export const useDeleteAccount = () =>
  useMutation(
    async userId => {
      const res = await deleteAccount(userId);
      return res;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'Delete',
          message: 'Account deleted successfully',
          autoClose: 3000,
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          autoClose: 3000,
          color: 'red',
        });
      },
    },
  );
