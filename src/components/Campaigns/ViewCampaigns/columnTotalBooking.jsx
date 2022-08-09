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
    Header: 'CLIENT NAME',
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
    Header: 'PRINTING STATUS',
    accessor: 'printing_status',
    Cell: tableProps => {
      const {
        row: {
          original: { printing_status },
        },
      } = tableProps;
      const color =
        printing_status === 'Completed'
          ? 'green'
          : printing_status === 'Upcoming'
          ? 'blue'
          : 'purple';
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
      const color = mounting_status === 'Completed' ? 'green' : 'orange';
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
      const color = payment_status === 'Paid' ? 'green' : 'orange';
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
];

export default COLUMNS;
