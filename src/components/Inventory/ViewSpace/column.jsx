import MenuIcon from '../../Menu';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'CLIENT',
    accessor: 'client',
    Cell: tableProps => {
      const {
        row: {
          original: { client },
        },
      } = tableProps;
      return <div className="w-full">{client}</div>;
    },
  },
  {
    Header: 'CAMPAIGN INCHARGE',
    accessor: 'booking_manager',
    Cell: tableProps => {
      const {
        row: {
          original: { booking_manager },
        },
      } = tableProps;
      return <div className="w-36">{booking_manager}</div>;
    },
  },
  {
    Header: 'CAMPAIGN NAME',
    accessor: 'campaign_name',
    Cell: tableProps => {
      const {
        row: {
          original: { image, campaign_name },
        },
      } = tableProps;
      return (
        <div className="flex items-center w-max">
          <img className="h-8 mr-2 w-8" src={image} alt="altered" />
          <div>{campaign_name}</div>
        </div>
      );
    },
  },
  {
    Header: 'PRINTING STATUS',
    accessor: 'printing_status',
    Cell: tableProps => {
      const {
        row: {
          original: { printing_status },
        },
      } = tableProps;
      const color =
        printing_status === 'Completed' ? 'green' : printing_status === 'Upcoming' ? 'red' : 'blue';
      return (
        <p className="w-36" style={{ color }}>
          {printing_status}
        </p>
      );
    },
  },
  {
    Header: 'MOUNTING STATUS',
    accessor: 'mounting_status',
    Cell: tableProps => {
      const {
        row: {
          original: { mounting_status },
        },
      } = tableProps;
      const color = mounting_status === 'Completed' ? 'green' : 'red';
      return (
        <p className="w-36" style={{ color }}>
          {mounting_status}
        </p>
      );
    },
  },
  {
    Header: 'PAYMENT STATUS',
    accessor: 'payment_status',
    Cell: tableProps => {
      const {
        row: {
          original: { payment_status },
        },
      } = tableProps;
      const color = payment_status === 'Paid' ? 'green' : 'red';
      return (
        <p className="w-36" style={{ color }}>
          {payment_status}
        </p>
      );
    },
  },
  {
    Header: 'PAYMENT TYPE',
    accessor: 'payment_type',
    Cell: tableProps => {
      const {
        row: {
          original: { payment_type },
        },
      } = tableProps;
      return <div className="w-36">{payment_type}</div>;
    },
  },
  {
    Header: 'SCHEDULE',
    accessor: 'schedule',
    Cell: tableProps => {
      const {
        row: {
          original: { from_date, to_date },
        },
      } = tableProps;
      return (
        <div className="flex items-center text-xs w-max">
          <span className="py-1 px-1 bg-slate-200 mr-2  rounded-md ">{from_date}</span>
          &gt;
          <span className="py-1 px-1 bg-slate-200 mx-2  rounded-md">{to_date}</span>
        </div>
      );
    },
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
  },
  {
    Header: '',
    accessor: 'details',
    disableSortBy: true,
    Cell: tableProps => {
      const {
        row: {
          // eslint-disable-next-line no-unused-vars
          original: { id },
        },
      } = tableProps;
      return (
        <div className="w-[100px] flex justify-center">
          <button type="button">
            <MenuIcon />
          </button>
        </div>
      );
    },
  },
];

export default COLUMNS;
