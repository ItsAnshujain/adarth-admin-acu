import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword, login, resetPassword } from '../requests/auth.requests';

export const useLogin = () =>
  useMutation(
    async data => {
      const res = await login(data);
      return res;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'Login',
          message: 'Logged in successfully',
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

export const useForgotPassword = () =>
  useMutation(
    async data => {
      const res = await forgotPassword(data);
      return res;
    },
    {
      onError: err => {
        showNotification({
          title: 'Invalid details',
          message: err.message,
          color: 'red',
        });
      },
      onSuccess: () => {
        showNotification({
          title: 'Request Submitted',
          message: 'Please check your email for further instructions',
        });
      },
    },
  );

export const useResetPassword = () =>
  useMutation(async data => {
    const res = await resetPassword(data);
    return res;
  });
