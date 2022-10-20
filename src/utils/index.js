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
