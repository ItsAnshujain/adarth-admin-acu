import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bookingById,
  bookingRevenue,
  bookingReportByRevenueGraph,
  bookingReportByRevenueStats,
  bookingRevenueByIndustry,
  bookingRevenueByLocation,
  bookings,
  bookingStats,
  bookingStatsByIncharge,
  createBooking,
  deleteBookings,
  generateInvoiceReceipt,
  generatePurchaseReceipt,
  generateReleaseReceipt,
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
    ['booking-by-id', id],
    async () => {
      const res = await bookingById(id);
      return res.data[0] || {};
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
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Booking updated successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
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
        queryClient.invalidateQueries(['booking-by-id']);
        queryClient.invalidateQueries(['booking-stats']);
        queryClient.invalidateQueries(['booking-stats-by-incharge']);

        showNotification({
          title: 'Booking updated successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
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
          title: 'Booking created successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
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
      return res?.data;
    },
    {
      enabled,
    },
  );

export const useBookingStatByIncharge = (filter, enabled = true) =>
  useQuery(
    ['booking-stats-by-incharge', filter],
    async () => {
      const res = await bookingStatsByIncharge(filter);
      return res?.data;
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
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Booking deleted successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useGenerateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }) => {
      const res = await generateInvoiceReceipt(id, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Invoice receipt downloaded successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useGeneratePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }) => {
      const res = await generatePurchaseReceipt(id, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Purchase order receipt downloaded successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useGenerateReleaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }) => {
      const res = await generateReleaseReceipt(id, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        showNotification({
          title: 'Release order receipt downloaded successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useFetchBookingRevenue = (query, enabled = true) =>
  useQuery(
    ['booking-revenue', query],
    async () => {
      const res = await bookingRevenue(query);
      return res?.data;
    },
    { enabled },
  );

export const useBookingReportByRevenueStats = (enabled = true) =>
  useQuery(
    ['booking-by-revenue-stats'],
    async () => {
      const res = await bookingReportByRevenueStats();
      return res?.data;
    },
    { enabled },
  );

export const useBookingReportByRevenueGraph = (query, enabled = true) =>
  useQuery(
    ['booking-by-reveue-graph', query],
    async () => {
      const res = await bookingReportByRevenueGraph(query);
      return res?.data;
    },
    { enabled },
  );

export const useBookingRevenueByIndustry = (query, enabled = true) =>
  useQuery(
    ['booking-revenue-by-industry', query],
    async () => {
      const res = await bookingRevenueByIndustry(query);
      return res?.data;
    },
    { enabled },
  );

export const useBookingRevenueByLocation = (query, enabled = true) =>
  useQuery(
    ['booking-revenue-by-location', query],
    async () => {
      const res = await bookingRevenueByLocation(query);
      return res?.data;
    },
    { enabled },
  );
