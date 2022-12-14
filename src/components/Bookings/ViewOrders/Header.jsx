import { Button } from '@mantine/core';
import classNames from 'classnames';
import { ArrowLeft } from 'react-feather';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../Finance/Menu';

const Header = ({ pageNumber, setPageNumber, bookingId, bookingData }) => {
  const navigate = useNavigate();

  const purchaseOrderList = useMemo(
    () => [
      {
        label: 'Manual Entry',
        path: `/finance/create-order/purchase?id=${bookingId}`,
      },
      {
        label: 'Upload',
        path: `/finance/create-order/purchase/upload?id=${bookingId}`,
      },
    ],
    [bookingId],
  );
  const releaseOrderList = useMemo(
    () => [
      {
        label: 'Manual Entry',
        path: `/finance/create-order/release?id=${bookingId}`,
      },
      {
        label: 'Upload',
        path: `/finance/create-order/release/upload?id=${bookingId}`,
      },
    ],
    [bookingId],
  );
  const invoiceList = useMemo(
    () => [
      {
        label: 'Manual Entry',
        path: `/finance/create-order/invoice?id=${bookingId}`,
      },
      {
        label: 'Upload',
        path: `/finance/create-order/invoice/upload?id=${bookingId}`,
      },
    ],
    [bookingId],
  );

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center flex-wrap">
      <div className="flex pl-5 gap-3 items-center font-medium">
        <Button onClick={() => navigate(-1)} className="mr-4 px-0 text-black">
          <ArrowLeft />
        </Button>
        <Button
          onClick={() => setPageNumber(0)}
          className={classNames(
            `${
              pageNumber === 0
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-3 after:bg-purple-450'
                : 'text-black'
            }`,
            'px-0',
          )}
        >
          Order Information
        </Button>
        <Button
          onClick={() => setPageNumber(1)}
          className={classNames(
            `${
              pageNumber === 1
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-3 after:bg-purple-450'
                : 'text-black'
            }`,
          )}
        >
          Process Pipeline
        </Button>
        <Button
          onClick={() => setPageNumber(2)}
          className={classNames(
            `${
              pageNumber === 2
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-3 after:bg-purple-450'
                : 'text-black'
            }`,
            'px-0',
          )}
        >
          Overview
        </Button>
      </div>
      <div className="flex pr-7 gap-2 ml-4 flex-wrap">
        {pageNumber === 0 ? (
          <div className="flex gap-2 flex-wrap">
            <Menu btnLabel="Generate Purchase Order" options={purchaseOrderList} />
            <Menu btnLabel="Generate Release Order" options={releaseOrderList} />
            <Menu btnLabel=" Generate Invoice" options={invoiceList} />
          </div>
        ) : (
          <>
            <div>
              <a
                href={bookingData?.purchaseOrder}
                className={classNames(
                  bookingData?.purchaseOrder
                    ? 'text-white cursor-pointer bg-black'
                    : 'pointer-events-none text-black bg-gray-450',
                  'font-medium py-2 px-3 rounded-md',
                )}
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download Purchase Order
              </a>
            </div>
            <div>
              <a
                href={bookingData?.releaseOrder}
                className={classNames(
                  bookingData?.releaseOrder
                    ? 'text-white cursor-pointer bg-black'
                    : 'pointer-events-none text-black bg-gray-450',
                  'font-medium py-2 px-3 rounded-md',
                )}
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download Release Order
              </a>
            </div>
            <div>
              <a
                href={bookingData?.invoice}
                className={classNames(
                  bookingData?.invoice
                    ? 'text-white cursor-pointer bg-black'
                    : 'pointer-events-none text-black bg-gray-450',
                  'font-medium py-2 px-3 rounded-md',
                )}
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download Invoice
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
