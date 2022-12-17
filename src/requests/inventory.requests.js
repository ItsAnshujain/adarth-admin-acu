import http from '../utils/http';

export const createInventory = data => http.post('/inventory', data);

export const fetchInventory = query => http.get(`/inventory?${query}`);

export const fetchInventoryById = inventoryId => http.get(`/inventory/${inventoryId}`);

export const updateInventory = (inventoryId, data) => http.patch(`/inventory/${inventoryId}`, data);

export const deleteInventoryById = inventoryId => http.delete(`/inventory/${inventoryId}`);

export const deleteInventory = query => http.delete(`/inventory${query}`);

export const csvImport = data => http.post('/inventory/csv-import', data, { hasFiles: true });

export const fetchBookingsByInventoryId = (inventoryId, query) =>
  http.get(`/inventory/${inventoryId}/bookings?${query}`);
