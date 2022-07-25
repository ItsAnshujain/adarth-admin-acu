import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Text } from '@mantine/core';
import { RangeCalendar, DatePicker } from '@mantine/dates';
import cal from '../assets/calendar.svg';

const DateRange = ({ handleClose }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [value, setValue] = useState([null, null]);

  const handleSetStartDate = startingDate => {
    setStartDate(startingDate);
    setValue(prev => {
      if (endDate < startingDate) return [startingDate, null];
      return [startingDate, prev[1]];
    });
  };
  const handleSetEndDate = endingDate => {
    setEndDate(endingDate);
    setValue(prev => {
      if (endingDate < startDate) return [null, endingDate];
      return [prev[0], endingDate];
    });
  };

  const handleRangeSetting = val => {
    setStartDate(val[0]);
    setEndDate(val[1]);
    if (val[1] < val[0]) {
      setValue([null, val[1]]);
      return;
    }
    setValue(val);
  };

  return (
    <div className="flex flex-col w-[605px] p-8 shadow-2xl">
      <div className="flex justify-between pb-4 border-b">
        <div>
          <Text size="xl" weight="700">
            Date Range
          </Text>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleClose} variant="filled" color="dark">
            Cancel
          </Button>
          <button
            onClick={() => {
              navigate(`?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            }}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
            type="button"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="flex gap-8 pt-4">
        <div className="border rounded-md flex-1 p-4 py-6">
          <RangeCalendar value={value} onChange={handleRangeSetting} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Text size="lg" font="bold">
            Picked Date
          </Text>
          <DatePicker
            clearable={false}
            onChange={handleSetStartDate}
            value={startDate}
            label="Date From"
            icon={<img className="absolute left-[500%]" src={cal} alt="calendar" />}
          />
          <DatePicker
            clearable={false}
            onChange={handleSetEndDate}
            value={endDate}
            label="Date To"
            icon={<img className="absolute left-[500%]" src={cal} alt="calendar" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRange;
