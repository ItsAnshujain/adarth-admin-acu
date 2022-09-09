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
      <div className="w-fit">
        <p>Hoarding Rent</p>
        <p className="text-xs">At Lal Ganesh 30ft x 20ft</p>
        <p className="text-xs">20th March to 19 April 2022</p>
      </div>
    ),
  },
  {
    Header: 'DATE',
    accessor: 'date',
    Cell: () => <div className="w-fit">2 Sep,2022</div>,
  },

  {
    Header: 'QUANTITY',
    accessor: 'quantity',
    Cell: () => <div className="w-[14%]">2</div>,
  },
  {
    Header: 'RATE',
    accessor: 'rate',
    Cell: () => <div className="w-[14%]">41.67</div>,
  },
  {
    Header: 'PER',
    accessor: 'per',
    Cell: () => <div className="w-[14%]">41.SQF</div>,
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
    Cell: () => <div className="w-[14%]">{toIndianCurrency(29834)}</div>,
  },
];

export default COLUMNS;
