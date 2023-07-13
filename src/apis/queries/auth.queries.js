import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword, login, resetPassword } from '../requests/auth.requests';

export const useLogin = () =>
  useMutation(
    async data => {
      const res = await login(data);
      return res?.data;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'Logged in successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );

export const useForgotPassword = () =>
  useMutation(
    async data => {
      const res = await forgotPassword(data);
      return res;
    },
    {
      onError: err => {
        showNotification({
          title: err.message,
          color: 'red',
        });
      },
      onSuccess: () => {
        showNotification({
          title: 'Request Submitted. Please check your email for further instructions',
        });
      },
    },
  );

export const useResetPassword = () =>
  useMutation(async data => {
    const res = await resetPassword(data);
    return res;
  });
