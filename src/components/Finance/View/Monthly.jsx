import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Folder } from 'react-feather';
import Header from '../Header';
import toIndianCurrency from '../../../utils/currencyFormat';

const data = {
  totalSale: 90000,
  operationalCost: 2000,
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dummyData = months.map(month => ({ ...data, month }));

const Monthly = () => {
  const [financeData, _] = useState(dummyData);
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const year = pathname.split('/')[2];

  return (
    <div>
      <Header {...state} />
      <div className="flex flex-wrap gap-4 mt-4 pl-5 pr-7">
        {financeData.map(finance => (
          <div
            aria-hidden
            onClick={() =>
              navigate('details', {
                state: {
                  totalSale: finance.totalSale,
                  operationalCost: finance.operationalCost,
                  year,
                  month: finance.month,
                },
              })
            }
            className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer"
          >
            <Folder size={32} strokeWidth="1.2" />
            <p className="font-bold text-lg">{finance.month}</p>
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-400">Total Sales</p>
                <p className="text-orange-400">{toIndianCurrency(finance.totalSale)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Total Operational Cost</p>
                <p className="text-green-400">{toIndianCurrency(finance.operationalCost)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monthly;
