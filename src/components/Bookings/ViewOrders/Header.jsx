import { Button } from '@mantine/core';
import classNames from 'classnames';
import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import GenerateMenu from '../../shared/GenerateMenu';

const initialState = {
  purchase: false,
  releases: false,
  invoices: false,
};

const Header = ({ pageNumber, setPageNumber }) => {
  const [showMenu, setShowMenu] = useState(initialState);

  const handleShowMenu = name => {
    setShowMenu(prevState => ({
      ...initialState,
      [name]: !prevState[name],
    }));
  };

  const { pathname } = useLocation();
  const id = pathname.split('/')[3];

  const navigate = useNavigate();
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
          <>
            <div className="relative">
              <Button
                onClick={() => handleShowMenu('purchase')}
                className="bg-black text-sm  text-white"
              >
                Generate Purchase Order <ChevronDown />
                {showMenu.purchase && (
                  <GenerateMenu
                    locationCreate="/finance/create-order/purchase"
                    location={`/bookings/generate-purchase-order/${id}`}
                  />
                )}
              </Button>
            </div>
            <div className="relative">
              <Button
                onClick={() => handleShowMenu('release')}
                className="bg-black text-sm text-white"
              >
                Generate Release Order <ChevronDown />
                {showMenu.release && (
                  <GenerateMenu
                    locationCreate="/finance/create-order/release"
                    location={`/bookings/generate-release-order/${id}`}
                  />
                )}
              </Button>
            </div>
            <div className="relative">
              <Button
                onClick={() => handleShowMenu('invoice')}
                className="bg-black text-sm text-white"
              >
                Generate Invoice <ChevronDown />
                {showMenu.invoice && (
                  <GenerateMenu
                    locationCreate="/finance/create-order/invoice"
                    location={`/bookings/generate-invoice/${id}`}
                  />
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Button onClick={() => {}} className="bg-black text-sm  text-white">
                Download Purchase Order
              </Button>
            </div>
            <div>
              <Button onClick={() => {}} className="bg-black text-white">
                Download Release Order
              </Button>
            </div>
            <div>
              <Button onClick={() => {}} className="bg-black text-white">
                Download Invoice
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
