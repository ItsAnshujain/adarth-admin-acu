import http from '../utils/http';

export const bookings = filter => http.get(`/booking?${filter}`);

export const bookingById = id => http.get(`/booking/${id}`);

export const updateBooking = (id, data) => http.patch(`/booking/${id}`, data);

export const updateBookingStatus = (id, query) => http.patch(`/booking/status/${id}?${query}`);

export const createBooking = data => http.post('/booking', data);

export const bookingStats = filter => http.get(`/booking/stats?${filter}`);

export const deleteBookings = id => http.delete(`/booking/${id}`);
