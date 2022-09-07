import { useState } from 'react';
import { Text, Button, Select } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';

const Header = ({ text }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [value, setValue] = useState();
  const ref = useClickOutside(() => setShowDatePicker(false));

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
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
            <div className="absolute z-20 -translate-x-[80%] bg-white -top-0.3">
              <DateRange handleClose={openDatePicker} />
            </div>
          )}
        </div>
        <div className="mr-2">
          <Select
            value={value}
            onChange={setValue}
            placeholder="Sort By"
            data={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'yearly', label: 'Yearly' },
              { value: 'lastFiveYears', label: 'Last Five Years' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
