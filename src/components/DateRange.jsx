import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { RangeCalendar, DatePicker } from '@mantine/dates';
import { Calendar } from 'react-feather';

const DateRange = ({ handleClose = () => {} }) => {
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

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setValue(null);
  };

  return (
    <div className="flex flex-col w-[605px] p-8 shadow-2xl">
      <div className="flex justify-between pb-4 border-b">
        <div>
          <p className="text-2xl font-bold">Date Range</p>
        </div>
        <div className="flex gap-2">
          <Button className="hover:bg-white" onClick={handleClear} variant="outline" color="dark">
            Clear
          </Button>
          <Button className="bg-black text-white" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              navigate(`?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
            }}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          >
            Apply
          </Button>
        </div>
      </div>
      <div className="flex gap-8 pt-4">
        <div className="border rounded-md flex-1 p-4 py-6">
          <RangeCalendar value={value} onChange={handleRangeSetting} />
        </div>
        <div className="flex-1 flex flex-col items-start gap-2">
          <p className="text-lg font-bold">Picked Date</p>
          <p className="font-bold">Date From</p>
          <DatePicker
            clearable={false}
            onChange={handleSetStartDate}
            value={startDate}
            icon={<Calendar className="text-black absolute left-[500%]" />}
          />
          <p className="font-bold mt-3">Date To</p>
          <DatePicker
            clearable={false}
            onChange={handleSetEndDate}
            value={endDate}
            icon={<Calendar className="text-black absolute left-[500%]" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRange;
