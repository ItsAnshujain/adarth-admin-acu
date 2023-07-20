import { showNotification } from '@mantine/notifications';
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
  organization: 'Organization',
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
  billboard: 'Billboard',
  digital_screen: 'Digital Screen',
  transit_media: 'Transit Media',
  street_furniture: 'Street Furniture',
};

export const categoryColors = {
  grape: 'Billboard',
  green: 'Digital Screen',
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
  'management': 'Management',
  'supervisor': 'Supervisor',
  'associate': 'Associate',
};

// TODO: Remove one roleType object
export const ROLES = {
  ADMIN: 'admin',
  MANAGEMENT: 'management',
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
  /^([0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[Z|z][0-9a-zA-Z]{1}|)$/;

export const panRegexMatch = /^(([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?|)$/;

export const aadhaarRegexMatch = /^\d{12}$/;

export const mobileRegexMatch = /^[6-9]\d{9}$/;

export const onlyNumbersMatch = /^[0-9]*$/;

export const pinCodeMatch = /^(\d{4}|\d{6})$/;

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
  'Feb',
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

export const quarters = ['First quarter', 'Second quarter', 'Third quarter', 'Fourth quarter'];

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

export const checkPrintingStats = (printingStatus = '', item = '') => {
  const printingStats = {
    upcoming: ['upcoming'],
    'in progress': ['upcoming', 'in progress'],
    completed: ['upcoming', 'in progress', 'completed'],
  };

  return printingStats[printingStatus?.toLowerCase()]?.includes(item?.toLowerCase());
};

export const checkMountingStats = (mountingStatus = '', item = '') => {
  const printingStats = {
    upcoming: ['upcoming'],
    'in progress': ['upcoming', 'in progress'],
    completed: ['upcoming', 'in progress', 'completed'],
  };

  return printingStats[mountingStatus?.toLowerCase()]?.includes(item?.toLowerCase());
};

export const orderTitle = {
  purchase: 'Purchase Order',
  release: 'Release Order',
  invoice: 'Invoice',
};

export const alertText = 'Order item details if added, will get cleared if you change a booking';

export const indianMapCoordinates = {
  latitude: 21.125681,
  longitude: 82.794998,
};

export const validateImageResolution = (file, width, height) =>
  new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width <= width && img.height <= height) {
        resolve(true);
      } else {
        resolve(false);
      }
    };
    img.onerror = err => reject(err);
    img.src = imageUrl;
  });

export const getDate = (selectionItem, item, key) => {
  if (selectionItem && selectionItem[key]) return new Date(selectionItem[key]);

  if (item && item[key]) return new Date(item[key]);

  return null;
};

export const onApiError = err =>
  showNotification({
    message: err.message,
    color: 'red',
  });

export const getFormattedDimensions = list => {
  const updatedList = [...list];

  updatedList
    .map((item, index) => {
      if (index < 2) {
        return `${item?.width || 0}ft x ${item?.height || 0}ft`;
      }
      return null;
    })
    .filter(item => item !== null)
    .join(', ');

  return updatedList;
};

export const stringToColour = str => {
  if (!str.length) return '';

  let hash = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }
  return colour;
};
