import { Button } from '@mantine/core';
import classNames from 'classnames';
import { ArrowLeft } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';

const Header = ({ tabs, setTabs }) => {
  const { id } = useParams();

  const navigate = useNavigate();
  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="flex pl-5 gap-6 items-center">
        <button onClick={() => navigate(-1)} className="mr-4" type="button">
          <ArrowLeft />
        </button>
        <button
          type="button"
          onClick={() => setTabs(0)}
          className={classNames(
            `${
              tabs === 0
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5  after:bg-purple-450'
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
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5  after:bg-purple-450'
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
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5  after:bg-purple-450'
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
          Edit Campaign
        </Button>
      </div>
    </div>
  );
};

export default Header;
