import { useState } from 'react';
import { Folder } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import toIndianCurrency from '../../utils/currencyFormat';

const data = {
  year: 2020,
  totalSale: 90000,
  operationalCost: 2000,
};

const dummyData = new Array(10).fill(data);

const Finance = () => {
  const [financeData, _] = useState(dummyData);
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4 mt-4 pl-5 pr-7">
      {financeData.map(finance => (
        <div
          aria-hidden
          onClick={() =>
            navigate(`${finance.year}`, {
              state: {
                totalSale: finance.totalSale,
                operationalCost: finance.operationalCost,
                year: finance.year,
              },
            })
          }
          className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer"
        >
          <Folder size={32} strokeWidth="1.2" />
          <p className="font-bold text-lg">Year {finance.year}</p>
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
  );
};

export default Finance;
