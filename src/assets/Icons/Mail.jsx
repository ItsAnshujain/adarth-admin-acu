const Mail = ({ stroke }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 5H15C15.6875 5 16.25 5.5625 16.25 6.25V13.75C16.25 14.4375 15.6875 15 15 15H5C4.3125 15 3.75 14.4375 3.75 13.75V6.25C3.75 5.5625 4.3125 5 5 5Z"
      stroke={stroke}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 6.25L10 10.625L3.75 6.25"
      stroke={stroke}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Mail;
