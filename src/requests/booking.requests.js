import http from '../utils/http';

export const bookings = filter => http.get(`/booking?${filter}`);

export const bookingById = id => http.get(`/booking/${id}`);

export const updateBooking = (id, data) => http.patch(`/booking/${id}`, data);

export const updateBookingStatus = (id, query) => http.patch(`/booking/status/${id}?${query}`);

export const createBooking = data => http.post('/booking', data);

export const bookingStats = filter => http.get(`/booking/stats?${filter}`);

export const bookingStatsByIncharge = filter => http.get(`/booking/stats-by-incharge?${filter}`);

export const deleteBookings = id => http.delete(`/booking/${id}`);

export const generateInvoiceReceipt = (id, data) =>
  http.post(`/booking/${id}/generate-receipt/invoice`, data);

export const generatePurchaseReceipt = (id, data) =>
  http.post(`/booking/${id}/generate-receipt/purchase`, data);

export const generateReleaseReceipt = (id, data) =>
  http.post(`/booking/${id}/generate-receipt/release`, data);

export const bookingRevenue = query => http.get(`/booking/revenue?${query}`);

export const bookingReportByRevenueStats = () => http.get('/booking/report/revenue-stats');

export const bookingReportByRevenueGraph = query =>
  http.get(`/booking/report/revenue-graph?${query}`);

export const bookingRevenueByIndustry = query => http.get(`/booking/report/byIndustry?${query}`);

export const bookingRevenueByLocation = query => http.get(`/booking/report/byLocation?${query}`);
