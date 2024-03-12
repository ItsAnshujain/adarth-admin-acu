import urlcat from 'urlcat';
import http from '../http';

const addFollowUp = (id, payload) => http.post(`/lead/${id}/follow-up`, payload);

export default addFollowUp;
