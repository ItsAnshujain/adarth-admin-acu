import dayjs from 'dayjs';
import { geocodeByAddress, getLatLng, geocodeByLatLng } from 'react-google-places-autocomplete';

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
  booking_campaign_status: 'Booking Campaign Status',
  payment_status: 'Payment Status',
  proposal_status: 'Proposal Status',
  space_status: 'Space Status',
  campaign_status: 'Campaign Status',
  industry: 'Industry',
  operational_cost_type: 'Operational Cost Type',
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

export const categoryColors = {
  grape: 'Billboards',
  green: 'Digital Screens',
  blue: 'Transit Media',
  yellow: 'Street Furnitures',
};

export const tierList = [
  {
    label: 'Tier 1',
    value: 'tier_1',
  },
  {
    label: 'Tier 2',
    value: 'tier_2',
  },
  {
    label: 'Tier 3',
    value: 'tier_3',
  },
];

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
 * Get latitute and longitude from address
 * @param {number} lat - latitute to get Address
 * @param {number} lng - longitude to get Address
 * @returns {Promise} - Returns an promise which resolves into object with address
 */
export const getAddressByLatLng = async (lat, lng) => {
  const address = await geocodeByLatLng({ lat, lng });
  return address?.[0];
};

/**
 * Prevent parent onClick event from bubbling
 * @param {event} event - Native click event
 * @param {function} callback - Callback function to invoke
 */
export const handleStopPropagation = (e, cb) => {
  e.stopPropagation();
  cb?.();
};

export const gstRegexMatch =
  /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[Z|z][0-9a-zA-Z]{1}$/;

export const panRegexMatch = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

export const aadhaarRegexMatch = /^\d{12}$/;

export const mobileRegexMatch = /^[6-9]\d{9}$/;

export const onlyNumbersMatch = /^[0-9]*$/;

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

/**
 * Download url
 * @param {string} url - url to download
 */
export const downloadPdf = pdfLink => {
  const link = document.createElement('a');
  link.href = pdfLink;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download multiple files at once
 * @param {array} urls - Array of urls to download
 */
export const downloadAll = urls => {
  const link = document.createElement('a');
  link.setAttribute('target', '_blank');
  document.querySelector('body').appendChild(link);

  urls.forEach(item => {
    link.href = item;
    link.click();
  });

  link.remove();
};

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const monthsInShort = [
  'Jan',
  'Febr',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const daysInAWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const supportedTypes = ['JPG', 'JPEG', 'PNG'];

export const indianCurrencyInDecimals = amount => {
  if (Number.isNaN(amount)) {
    return 0;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const dateByQuarter = {
  1: {
    startDate: `${dayjs().year()}-01-01`,
    endDate: `${dayjs().year()}-03-31`,
  },
  2: {
    startDate: `${dayjs().year()}-04-01`,
    endDate: `${dayjs().year()}-06-30`,
  },
  3: {
    startDate: `${dayjs().year()}-07-01`,
    endDate: `${dayjs().year()}-09-30`,
  },
  4: {
    startDate: `${dayjs().year()}-10-01`,
    endDate: `${dayjs().year()}-12-31`,
  },
};

export const checkCampaignStats = (currentStatus, item) => {
  const campaignStats = {
    Upcoming: ['Upcoming'],
    Ongoing: ['Upcoming', 'Ongoing'],
    Completed: ['Upcoming', 'Ongoing', 'Completed'],
  };

  return campaignStats[currentStatus?.campaignStatus]?.includes(item);
};

// TODO: kept it for demo purpose will remove later
export const temporaryPurchaseOrderPdfLink =
  'https://adarth-assets-dev.s3.ap-south-1.amazonaws.com/4e21f0ce-1cee-45fe-8bf4-c1a8ad49c20a-purchase_order.pdf';
export const temporaryReleaseOrderPdfLink =
  'https://adarth-assets-dev.s3.ap-south-1.amazonaws.com/3e0b897e-db99-41c3-9183-22ec68a9c5f9-release_order.pdf';
export const temporaryInvoicePdfLink =
  'https://adarth-assets-dev.s3.ap-south-1.amazonaws.com/24819b90-5868-4d85-8b53-aed4ec97a9db-invoice.pdf';
