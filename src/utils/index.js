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
