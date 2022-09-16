import classNames from 'classnames';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Button } from '@mantine/core';
import GenerateMenu from '../shared/GenerateMenu';
import toIndianCurrency from '../../utils/currencyFormat';

const initialState = {
  purchase: false,
  releases: false,
  invoices: false,
};

const Header = ({ operationalCost, totalSale, year, month, pageNumber }) => {
  const [showMenu, setShowMenu] = useState(initialState);

  const handleShowMenu = name => {
    setShowMenu(prevState => ({
      ...initialState,
      [name]: !prevState[name],
    }));
  };

  return (
    <header className="flex justify-between gap-2 pr-7 h-20 border-b items-center flex-wrap">
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
        <div className="relative">
          <Button
            onClick={() => handleShowMenu('purchase')}
            className="bg-black text-sm  text-white"
            type="button"
          >
            Generate Purchase Order <ChevronDown />
            {showMenu.purchase && (
              <GenerateMenu
                location="/finance/create-order/purchase/upload"
                locationCreate="/finance/create-order/purchase"
              />
            )}
          </Button>
        </div>
        <div className="relative">
          <Button
            onClick={() => handleShowMenu('release')}
            className="bg-black text-sm text-white"
            type="button"
          >
            Generate Release Order <ChevronDown />
            {showMenu.release && (
              <GenerateMenu
                location="/finance/create-order/release/upload"
                locationCreate="/finance/create-order/release"
              />
            )}
          </Button>
        </div>
        <div className="relative">
          <Button
            onClick={() => handleShowMenu('invoice')}
            className="bg-black text-sm text-white"
            type="button"
          >
            Generate Invoice <ChevronDown />
            {showMenu.invoice && (
              <GenerateMenu
                location="/finance/create-order/invoice/upload"
                locationCreate="/finance/create-order/invoice/"
              />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
