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
        <Button onClick={() => navigate(-1)} className="mr-4 px-0 text-black">
          <ArrowLeft />
        </Button>
        <Button
          onClick={() => setTabs(0)}
          className={classNames(
            `${
              tabs === 0
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-3  after:bg-purple-450'
                : 'text-black'
            }`,
            'px-0',
          )}
        >
          Campaign Overview
        </Button>
        <Button
          onClick={() => setTabs(1)}
          className={classNames(
            `${
              tabs === 1
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-3  after:bg-purple-450'
                : 'text-black'
            }`,
          )}
        >
          Spaces List
        </Button>
        <Button
          onClick={() => setTabs(2)}
          className={classNames(
            `${
              tabs === 2
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-3  after:bg-purple-450'
                : 'text-black'
            }`,
            'px-0',
          )}
        >
          Total Bookings
        </Button>
      </div>

      <div className="pr-7">
        <Button onClick={() => navigate(`/campaigns/edit-details/${id}`)} className="bg-purple-450">
          Edit Campaign
        </Button>
      </div>
    </div>
  );
};

export default Header;
