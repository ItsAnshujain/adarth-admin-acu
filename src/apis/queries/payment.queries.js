import { useMutation, useQuery } from '@tanstack/react-query';
import { createPayment, fetchPayment, fetchPaymentById } from '../requests/payment.requests';
import { onApiError } from '../../utils';

export const usePayment = (query, enabled = true) =>
  useQuery({
    queryKey: ['payment', query],
    queryFn: async () => {
      const res = await fetchPayment(query);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export const usePaymentById = (paymentId, enabled = true) =>
  useQuery({
    queryKey: ['payment-by-id', paymentId],
    queryFn: async () => {
      const res = await fetchPaymentById(paymentId);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export const useCreatePayment = () =>
  useMutation({
    mutationFn: async payload => {
      const res = await createPayment(payload);
      return res;
    },
    onError: onApiError,
  });
