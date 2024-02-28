import urlcat from 'urlcat';
import http from '../http';

const fetchContacts = payload => http.get(urlcat('/contact', payload));

export default fetchContacts;
