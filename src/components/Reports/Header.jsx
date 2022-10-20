import { useState } from 'react';
import { Text, Button } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';

const Header = ({ text }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
      <div className="pl-5">
        <Text size="lg" weight="bold">
          {text}
        </Text>
      </div>
      <div className="flex justify-around mr-7">
        <div ref={ref} className="mr-2 relative">
          <Button onClick={openDatePicker} variant="default" type="button">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-[90%] bg-white -top-0.3">
              <DateRange handleClose={openDatePicker} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
