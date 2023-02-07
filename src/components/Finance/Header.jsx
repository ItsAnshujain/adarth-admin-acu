import { indianCurrencyInDecimals, months } from '../../utils';
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
    path: '/finance/create-order/release/upload',
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

const Header = ({ totalOperationlCost, totalSales, year, month }) => (
  <header className="flex justify-between gap-2 pr-7 h-[60px] border-b items-center flex-wrap">
    <div className="flex gap-4 items-center pl-5">
      {year ? (
        <>
          <p className="font-bold text-lg">
            {!month ? `Year ${Number(year)}` : ` ${months[Number(month) - 1 || 0]} ${year}`}
          </p>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Sales</p>
            <p className="text-orange-400 text-sm">
              {totalSales ? indianCurrencyInDecimals(totalSales) : 0}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Operational Cost</p>
            <p className="text-green-400 text-sm">
              {totalOperationlCost ? indianCurrencyInDecimals(totalOperationlCost) : 0}
            </p>
          </div>
        </>
      ) : null}
    </div>
    <div className="flex gap-2 flex-wrap">
      <Menu btnLabel="Generate Purchase Order" options={purchaseOrderList} />
      <Menu btnLabel="Generate Release Order" options={releaseOrderList} />
      <Menu btnLabel=" Generate Invoice" options={invoiceList} />
    </div>
  </header>
);

export default Header;
