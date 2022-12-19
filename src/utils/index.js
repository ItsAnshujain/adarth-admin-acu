import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

export const serialize = object => {
  const str = [];
  for (const p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) {
      if (object[p] || typeof object[p] === 'boolean' || object[p] === null) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(object[p])}`);
      }
    }
  }

  return str.join('&');
};

export const masterTypes = {
  category: 'Category',
  brand: 'Brand',
  illumination: 'Illumination',
  media_type: 'Media Type',
  tag: 'Tag',
  zone: 'Zone',
  facing: 'Facing',
  demographic: 'Demographic',
  audience: 'Audience',
  space_type: 'Space Type',
  printing_status: 'Printing Status',
  mounting_status: 'Mounting Status',
  campaign_status: 'Campaign Status',
  payment_status: 'Payment Status',
  proposal_status: 'Proposal Status',
  space_status: 'Space Status',
};

/**
 * Debounce function used to delay function invoke that is passed along with a delay.
 * @param {function} func - Function which we want to call after delay
 * @param {number} delay - Delay in milliseconds
 * @returns {function} - Returns a function
 */
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const spaceTypes = {
  billboards: 'Billboards',
  digital_screens: 'Digital Screens',
  transit_media: 'Transit Media',
  street_furniture: 'Street Furniture',
};

export const colors = {
  red: 'Billboard',
  green: 'Digital Screen',
  blue: 'Transit Media',
  yellow: 'Street Furniture',
};

export const aadhaarFormat = aadhaarNumber => {
  if (aadhaarNumber) {
    const total = aadhaarNumber.split('');
    let aadhaar = '';
    while (total.length > 4) {
      const fourLetter = total.splice(0, 4);
      aadhaar += `${fourLetter.join('')}-`;
    }
    aadhaar += `${total.join('')}`;

    return aadhaar;
  }
  return '';
};

export const roleTypes = {
  'media_owner': 'Media Owner',
  'manager': 'Manager',
  'supervisor': 'Supervisor',
  'associate': 'Associate',
};

// TODO: Remove one roleType object
export const ROLES = {
  ADMIN: 'admin',
  MEDIA_OWNER: 'media_owner',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  ASSOCIATE: 'associate',
};

/**
 * Get latitute and longitude from address
 * @param {string} address - Address to get latitute and longitude
 * @returns {Promise} - Returns an promise which resolves into object with latitute and longitude
 */
export const getLatituteLongitude = async address => {
  const results = await geocodeByAddress(address);
  const latLng = await getLatLng(results[0]);
  return latLng;
};

/**
 * Prevent parent onClick event from bubbling
 * @param {event} event - Native click event
 * @param {function} callback - Callback function to invoke
 */
export const handleStopPropagation = (e, cb) => {
  e.stopPropagation();
  if (cb) cb();
};

export const gstRegexMatch =
  /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[Z|z][0-9a-zA-Z]{1}$/;

export const panRegexMatch = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

export const aadhaarRegexMatch =
  /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/;

export const mobileRegexMatch = /^[6-9]\d{9}$/;

export const isValidURL = urlString => {
  if (typeof urlString === typeof '') {
    try {
      return !!new URL(urlString);
    } catch (_err) {
      return false;
    }
  }

  return false;
};
