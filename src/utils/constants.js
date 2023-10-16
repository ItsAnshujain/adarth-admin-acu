export const SMTP_SERVICES = [
  { label: '1und1', value: '1und1' },
  { label: 'AOL', value: 'AOL' },
  { label: 'DebugMail.io', value: 'DebugMail.io' },
  { label: 'DynectEmail', value: 'DynectEmail' },
  { label: 'FastMail', value: 'FastMail' },
  { label: 'GandiMail', value: 'GandiMail' },
  { label: 'Gmail', value: 'Gmail' },
  { label: 'Godaddy', value: 'Godaddy' },
  { label: 'GodaddyAsia', value: 'GodaddyAsia' },
  { label: 'GodaddyEurope', value: 'GodaddyEurope' },
  { label: 'hot.ee', value: 'hot.ee' },
  { label: 'Hotmail', value: 'Hotmail' },
  { label: 'iCloud', value: 'iCloud' },
  { label: 'mail.ee', value: 'mail.ee' },
  { label: 'Mail.ru', value: 'Mail.ru' },
  { label: 'Mailgun', value: 'Mailgun' },
  { label: 'Mailjet', value: 'Mailjet' },
  { label: 'Mandrill', value: 'Mandrill' },
  { label: 'Naver', value: 'Naver' },
  { label: 'Postmark', value: 'Postmark' },
  { label: 'QQ', value: 'QQ' },
  { label: 'QQex', value: 'QQex' },
  { label: 'SendCloud', value: 'SendCloud' },
  { label: 'SendGrid', value: 'SendGrid' },
  { label: 'SES', value: 'SES' },
  { label: 'Sparkpost', value: 'Sparkpost' },
  { label: 'Yahoo', value: 'Yahoo' },
  { label: 'Yandex', value: 'Yandex' },
  { label: 'Zoho', value: 'Zoho' },
  { label: 'Others', value: 'others' },
];

export const MODE_OF_PAYMENT = [
  { label: 'RTGS', value: 'rtgs' },
  { label: 'NEFT', value: 'neft' },
  { label: 'IMPS', value: 'imps' },
  { label: 'CHEQUE', value: 'cheque' },
  { label: 'CREDIT CARD', value: 'credit_card' },
  { label: 'DEBIT CARD', value: 'debit_card' },
  { label: 'UPI', value: 'upi' },
  { label: 'CASH', value: 'cash' },
];

export const DATE_FORMAT = 'YYYY-MM-DD';

export const DATE_SECOND_FORMAT = 'DD MMM YYYY';

export const BOOKING_PAID_STATUS = [
  { label: 'Paid', value: true },
  { label: 'Unpaid', value: false },
];

export const YEAR_LIST = [
  { label: 'Select', value: -1 },
  { label: '2020', value: 2020 },
  { label: '2021', value: 2021 },
  { label: '2022', value: 2022 },
  { label: '2023', value: 2023 },
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 },
  { label: '2026', value: 2026 },
  { label: '2027', value: 2027 },
  { label: '2028', value: 2028 },
  { label: '2029', value: 2029 },
  { label: '2030', value: 2030 },
];

export const MONTH_LIST = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

export const FILE_TYPE_LIST = [
  { name: 'PPT', _id: 'ppt' },
  { name: 'PDF', _id: 'pdf' },
  { name: 'EXCEL', _id: 'excel' },
];

export const OBJECT_FIT_LIST = [
  {
    name: 'Fill',
    _id: 'fill',
    description:
      'The image is resized to fill the given dimension. If necessary, the image will be stretched or squished to fit',
  },
  {
    name: 'Contain',
    _id: 'contain',
    description:
      'The image keeps its aspect ratio, but is resized to fit within the given dimension',
  },
];

export const FACING_VALUE_LIST = ['single', 'double', 'triple', 'four', 'five'];

export const OBJECT_FIT_LIST_V2 = [
  { label: 'Generic Fill', value: 'fill;generic' },
  { label: 'Generic Contain', value: 'contain;generic' },
  { label: 'Long Shot / Close Shot - Fill', value: 'fill;longShotCloseShot' },
  { label: 'Long Shot / Close Shot - Contain', value: 'contain;longShotCloseShot' },
];
