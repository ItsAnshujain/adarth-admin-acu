import { Button } from '@mantine/core';
import classNames from 'classnames';
import { ArrowLeft, ChevronDown } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ pageNumber, setPageNumber }) => {
  const { pathname } = useLocation();
  const id = pathname.split('/')[3];

  const navigate = useNavigate();
  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center overflow-auto max-w-full">
      <div className="flex pl-5 gap-3 items-center">
        <button onClick={() => navigate(-1)} className="mr-4" type="button">
          <ArrowLeft />
        </button>
        <button
          type="button"
          onClick={() => setPageNumber(0)}
          className={classNames(
            `${
              pageNumber === 0
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8 after:bg-purple-450'
                : ''
            }`,
          )}
        >
          Order Information
        </button>
        <button
          onClick={() => setPageNumber(1)}
          className={classNames(
            `${
              pageNumber === 1
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8 after:bg-purple-450'
                : ''
            }`,
          )}
          type="button"
        >
          Process Pipeline
        </button>
        <button
          onClick={() => setPageNumber(2)}
          className={classNames(
            `${
              pageNumber === 2
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8 after:bg-purple-450'
                : ''
            }`,
          )}
          type="button"
        >
          Overview
        </button>
      </div>
      <div className="flex pr-7 gap-2 ml-4">
        {pageNumber === 0 ? (
          <>
            <div>
              <Button onClick={() => {}} className="bg-black text-sm  text-white" type="button">
                Generate Purchase Order <ChevronDown />
              </Button>
            </div>
            <div>
              <Button onClick={() => {}} className="bg-black text-white" type="button">
                Generate Release Order <ChevronDown />
              </Button>
            </div>
            <div>
              <Button onClick={() => {}} className="bg-black text-white" type="button">
                Generate Invoice <ChevronDown />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Button onClick={() => {}} className="bg-black text-sm  text-white" type="button">
                Download Purchase Order
              </Button>
            </div>
            <div>
              <Button onClick={() => {}} className="bg-black text-white" type="button">
                Download Release Order
              </Button>
            </div>
            <div>
              <Button onClick={() => {}} className="bg-black text-white" type="button">
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
