import http from '../utils/http';

export const fetchOperationalCost = inventoryId => http.get(`/operationalCost/${inventoryId}`);

export const addOperationalCost = data => http.post('/operationalCost', data);

export const updateOperationalCost = (id, data) => http.patch(`/operationalCost/${id}`, data);
