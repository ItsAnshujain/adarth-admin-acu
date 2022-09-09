import { useMutation } from '@tanstack/react-query';
import { forgotPassword, login, resetPassword } from '../requests/auth.requests';

export const useLogin = () =>
  useMutation(async data => {
    const res = await login(data);
    return res;
  });

export const useForgotPassword = () =>
  useMutation(async data => {
    const res = await forgotPassword(data);
    return res;
  });

export const useResetPassword = () =>
  useMutation(async data => {
    const res = await resetPassword(data);
    return res;
  });
