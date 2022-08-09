import { Switch, Text, Button } from '@mantine/core';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import arrowLeft from '../../../assets/arrow-left.svg';

const Header = ({ isBasicInfo, setIsBasicInfo, isUnderMaintenance, setIsUnderMaintenance }) => {
  const navigate = useNavigate();
  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="flex pl-5 gap-6 items-center">
        <button onClick={() => navigate(-1)} className="mr-4" type="button">
          <img src={arrowLeft} alt="back-arrow" />
        </button>
        <button
          type="button"
          onClick={() => setIsBasicInfo(true)}
          className={classNames(
            `${
              isBasicInfo
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
                : ''
            }`,
          )}
        >
          Basic Information
        </button>
        <button
          onClick={() => setIsBasicInfo(false)}
          className={classNames(
            `${
              !isBasicInfo
                ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-8  after:bg-purple-450'
                : ''
            }`,
          )}
          type="button"
        >
          Booking
        </button>
      </div>
      <div className="flex pr-7 gap-6">
        {isBasicInfo && (
          <div className="flex gap-2">
            <Text>Under Maintenance</Text>
            <Switch
              checked={isUnderMaintenance}
              onChange={e => setIsUnderMaintenance(e.currentTarget.checked)}
              size="lg"
            />
          </div>
        )}
        <div>
          <Button className="bg-purple-450" type="button">
            Edit Space
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;