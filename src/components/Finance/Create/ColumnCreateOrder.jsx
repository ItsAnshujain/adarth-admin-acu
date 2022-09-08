import toIndianCurrency from '../../../utils/currencyFormat';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'DESCRIPTION OF GOODS AND SERVICE',
    accessor: 'description_of_goods_and_services',
    Cell: () => (
      <div>
        <p>Hoarding Rent</p>
        <p className="text-xs">At Lal Ganesh 30ft x 20ft</p>
        <p className="text-xs">20th March to 19 April 2022</p>
      </div>
    ),
  },
  {
    Header: 'DATE',
    accessor: 'date',
    Cell: () => <div>2 Sep,2022</div>,
  },

  {
    Header: 'QUANTITY',
    accessor: 'quantity',
    Cell: () => <div>2</div>,
  },
  {
    Header: 'RATE',
    accessor: 'rate',
    Cell: () => <div>41.67</div>,
  },
  {
    Header: 'PER',
    accessor: 'per',
    Cell: () => <div>41.SQF</div>,
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
    Cell: () => <div>{toIndianCurrency(29834)}</div>,
  },
];

export default COLUMNS;
