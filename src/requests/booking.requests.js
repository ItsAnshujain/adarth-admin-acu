import http from '../utils/http';

export const bookings = filter => http.get(`/booking?${filter}`);

export const createBooking = data => http.post('/booking', data);

export const bookingStats = filter => http.get(`/booking/stats?${filter}`);
