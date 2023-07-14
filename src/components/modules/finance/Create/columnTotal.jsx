import toIndianCurrency from '../../../../utils/currencyFormat';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
    hideHeader: true,
    Cell: () => <div className="invisible">1</div>,
  },
  {
    Header: '',
    accessor: 'total',
    hideHeader: true,
    Cell: () => (
      <div className="w-80">
        <p className="ml-9">Total</p>
      </div>
    ),
  },
  {
    Header: 'DATE',
    accessor: 'date',
    hideHeader: true,
    Cell: () => <div className="w-fit invisible">2 Sep,2022</div>,
  },

  {
    Header: 'QUANTITY',
    accessor: 'quantity',
    hideHeader: true,
    Cell: () => <div className="w-[14%] invisible">2</div>,
  },
  {
    Header: 'RATE',
    accessor: 'rate',
    hideHeader: true,
    Cell: () => <div className="w-fit">41.67</div>,
  },
  {
    Header: 'PER',
    accessor: 'per',
    hideHeader: true,
    Cell: () => <div className="w-[14%] invisible">41.SQF</div>,
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
    hideHeader: true,
    Cell: () => <div className="w-[14%]">{toIndianCurrency(29834)}</div>,
  },
];

export default COLUMNS;
