import classNames from 'classnames';
import toIndianCurrency from '../../utils/currencyFormat';
import Menu from './Menu';

const purchaseOrderList = [
  {
    label: 'Manual Entry',
    path: '/finance/create-order/purchase',
  },
  {
    label: 'Upload',
    path: '/finance/create-order/purchase/upload',
  },
];
const releaseOrderList = [
  {
    label: 'Manual Entry',
    path: '/finance/create-order/release',
  },
  {
    label: 'Upload',
    path: '"/finance/create-order/release/upload',
  },
];
const invoiceList = [
  {
    label: 'Manual Entry',
    path: '/finance/create-order/invoice',
  },
  {
    label: 'Upload',
    path: '/finance/create-order/invoice/upload',
  },
];

const Header = ({ operationalCost, totalSale, year, month, pageNumber }) => (
  <header className="flex justify-between gap-2 pr-7 h-[60px] border-b items-center flex-wrap">
    <div className={classNames(`${!year ? 'invisible' : 'flex gap-4 items-center pl-5'}`)}>
      <p className="font-bold text-lg">{!month ? `Year ${year}` : ` ${month} ${year}`}</p>
      {pageNumber === 0 && (
        <>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Sales</p>
            <p className="text-orange-400 text-sm">{totalSale && toIndianCurrency(totalSale)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Operational Cost</p>
            <p className="text-green-400 text-sm">
              {operationalCost && toIndianCurrency(operationalCost)}
            </p>
          </div>
        </>
      )}
    </div>
    <div className="flex gap-2 flex-wrap">
      <Menu btnLabel="Generate Purchase Order" options={purchaseOrderList} />
      <Menu btnLabel="Generate Release Order" options={releaseOrderList} />
      <Menu btnLabel=" Generate Invoice" options={invoiceList} />
    </div>
  </header>
);

export default Header;
