import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import { bookings, bookingStats, createBooking } from '../requests/booking.requests';

export const useBookings = (filter, enabled = true) =>
  useQuery(
    ['bookings', filter],
    async () => {
      const res = await bookings(filter);
      return res?.data;
    },
    {
      enabled: !!enabled,
    },
  );

export const useCreateBookings = () =>
  useMutation(
    async data => {
      const res = await createBooking(data);
      return res;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'Bookings',
          message: 'Booking created successfully',
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

export const useBookingStats = (filter, enabled = true) =>
  useQuery(
    ['booking-stats', filter],
    async () => {
      const res = await bookingStats(filter);
      return res;
    },
    {
      enabled,
    },
  );
