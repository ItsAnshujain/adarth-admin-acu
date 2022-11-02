import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bookingById,
  bookings,
  bookingStats,
  createBooking,
  deleteBookings,
  updateBooking,
  updateBookingStatus,
} from '../requests/booking.requests';

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

export const useBookingById = (id, enabled = true) =>
  useQuery(
    ['booking-ny-id', id],
    async () => {
      const res = await bookingById(id);
      return res.data[0];
    },
    {
      enabled,
    },
  );

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }) => {
      const res = await updateBooking(id, data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Bookings',
          message: 'Booking updated successfully',
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

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, query }) => {
      const res = await updateBookingStatus(id, query);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Bookings',
          message: 'Booking updated successfully',
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

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async id => {
      const res = await deleteBookings(id);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Bookings',
          message: 'Booking deleted successfully',
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
