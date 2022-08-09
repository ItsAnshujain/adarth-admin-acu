import { Button } from '@mantine/core';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import arrowLeft from '../../../assets/arrow-left.svg';

const Header = ({ tabs, setTabs }) => {
  const { pathname } = useLocation();
  const id = pathname.split('/')[3];

  const navigate = useNavigate();
  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="flex pl-5 gap-6 items-center">
        <button onClick={() => navigate(-1)} className="mr-4" type="button">
          <img src={arrowLeft} alt="back-arrow" />
        </button>
        <button
          type="button"
          onClick={() => setTabs(0)}
          className={classNames(
            `${
              tabs === 0
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
                : ''
            }`,
          )}
        >
          Campaign Overview
        </button>
        <button
          onClick={() => setTabs(1)}
          className={classNames(
            `${
              tabs === 1
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
                : ''
            }`,
          )}
          type="button"
        >
          Spaces List
        </button>
        <button
          onClick={() => setTabs(2)}
          className={classNames(
            `${
              tabs === 2
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
                : ''
            }`,
          )}
          type="button"
        >
          Total Bookings
        </button>
      </div>

      <div className="pr-7">
        <Button
          onClick={() => navigate(`/campaigns/edit-details/${id}`)}
          className="bg-purple-450"
          type="button"
        >
          Edit Space
        </Button>
      </div>
    </div>
  );
};

export default Header;
