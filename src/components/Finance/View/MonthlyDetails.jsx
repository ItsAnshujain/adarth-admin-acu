import { Button } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Search from '../../Search';
import DateRange from '../../DateRange';
import calendar from '../../../assets/data-table.svg';
import ColumnPurchaseOrders from './ColumnPurchaseOrder';
import ColumnInvoices from './ColumnInvoices';
import ColumnReleaseOrders from './ColumnReleaseOrders';
import Table from '../../Table/Table';
import data from '../../../Dummydata/BOOKING_DATA.json';

const Monthly = () => {
  const { state } = useLocation();
  const [pageNumber, setPageNumber] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  return (
    <div>
      <Header {...state} pageNumber={pageNumber} />
      <div className="flex pl-5 gap-3 items-center font-medium h-20 border-b">
        <Button
          onClick={() => setPageNumber(0)}
          className={classNames(
            pageNumber === 0
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
          )}
        >
          Purchase Orders
        </Button>
        <Button
          onClick={() => setPageNumber(1)}
          className={classNames(
            pageNumber === 1
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
          )}
        >
          Release Orders
        </Button>
        <Button
          onClick={() => setPageNumber(2)}
          className={classNames(
            pageNumber === 2
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
          )}
        >
          Invoices
        </Button>
      </div>
      <div className="py-4 flex justify-end pr-7 gap-2 text-right">
        <Search />
        <div ref={ref} className=" relative">
          <Button onClick={toggleDatePicker} variant="default">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3 right-[-400px]">
              <DateRange handleClose={toggleDatePicker} />
            </div>
          )}
        </div>
      </div>
      {pageNumber === 0 ? (
        <Table COLUMNS={ColumnPurchaseOrders} data={data} />
      ) : pageNumber === 1 ? (
        <Table COLUMNS={ColumnReleaseOrders} data={data} />
      ) : (
        <Table COLUMNS={ColumnInvoices} data={data} />
      )}
    </div>
  );
};

export default Monthly;
