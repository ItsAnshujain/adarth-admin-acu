import { useState } from 'react';
import { Button, Select } from '@mantine/core';
import { useDistinctCities } from '../../../apis/queries/inventory.queries';
import CustomDateRangePicker from '../../CustomDateRangePicker';

const VacantInventoryFilter = ({ onClose }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [city, setCity] = useState('');
  const distinctCityQuery = useDistinctCities();

  const handleSetStartDate = startingDate => {
    setDateRange([startingDate, dateRange[1]]);
  };
  const handleSetEndDate = endDate => {
    setDateRange([dateRange[0], endDate]);
  };

  const handleRangeSetting = val => {
    if (val[1] < val[0]) {
      setDateRange([null, val[1]]);

      return;
    }

    setDateRange(val);
  };
  return (
    <div className="h-full relative">
      <div className="px-6 pb-6 flex flex-col">
        <Select
          label="City"
          name="city"
          placeholder="Select..."
          size="md"
          classNames={{ label: 'font-medium mb-0' }}
          data={distinctCityQuery?.data || []}
          className="mb-4"
          onChange={setCity}
          value={city}
          clearable
        />

        <CustomDateRangePicker
          value={dateRange}
          handleSetStartDate={handleSetStartDate}
          handleSetEndDate={handleSetEndDate}
          handleRangeSetting={handleRangeSetting}
        />

        <div className="flex gap-4 bottom-0 absolute w-[93%]">
          <Button className="secondary-button font-medium text-base mt-2 w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="primary-button font-medium text-base mt-2 w-full"
            onClick={() => onClose(city, dateRange[0], dateRange[1])}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VacantInventoryFilter;
