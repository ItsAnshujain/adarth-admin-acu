import urlcat from 'urlcat';
import http from '../http';

const addFollowUp = (id, payload) => http.post(`/lead/${id}/follow-up`, payload);

export const updateFollowUp = (id, payload) => http.patch(`/lead/follow-up/${id}`, payload);

export const deleteFollowUp = id => http.delete(`/lead/follow-up/${id}`);

export const fetchFollowUps = (id, query) => http.get(urlcat(`/lead/${id}/follow-up`, query));

export default addFollowUp;
