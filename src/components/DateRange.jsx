import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, createStyles } from '@mantine/core';
import { RangeCalendar, DatePicker } from '@mantine/dates';
import { Calendar } from 'react-feather';
import dayjs from 'dayjs';

const styles = {
  monthPickerControlActive: { backgroundColor: '#4B0DAF !important' },
  yearPickerControlActive: { backgroundColor: '#4B0DAF !important' },
};

export const useStyles = createStyles({ weekend: { color: '#495057 !important' } });

const DateRange = ({ handleClose = () => {}, dateKeys = ['startDate', 'endDate'] }) => {
  const { classes, cx } = useStyles();
  const [value, setValue] = useState([null, null]);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSetStartDate = startingDate => {
    searchParams.set(dateKeys[0], startingDate);
    setValue(prev => {
      if (prev[1] < startingDate) return [startingDate, null];
      return [startingDate, prev[1]];
    });
  };

  const handleSetEndDate = endingDate => {
    searchParams.set(dateKeys[1], endingDate);
    setValue(prev => {
      if (endingDate < prev[0]) return [null, endingDate];
      return [prev[0], endingDate];
    });
  };

  const handleRangeSetting = val => {
    if (val[1] < val[0]) {
      setValue([null, val[1]]);
      searchParams.set(dateKeys[1], val[1]);
      searchParams.delete(dateKeys[0]);

      return;
    }

    dateKeys.forEach((item, index) => {
      if (val[index]) searchParams.set(item, val[index]);
      else searchParams.delete(item);
    });
    setValue(val);
  };

  const handleClear = () => {
    setValue([null, null]);
    dateKeys.forEach(item => searchParams.delete(item));
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setValue(p => {
      const newState = [...p];
      dateKeys.forEach((item, index) => {
        newState[index] = new Date(searchParams.get(item)) || null;
      });

      return newState;
    });
  }, []);

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
              dateKeys.forEach(item =>
                searchParams.set(item, dayjs(searchParams.get(item)).format('YYYY-MM-DD')),
              );
              setSearchParams(searchParams);
              handleClose();
            }}
            className="bg-purple-450 flex align-center py-2 text-white rounded-md px-4"
          >
            Apply
          </Button>
        </div>
      </div>
      <div className="flex gap-8 pt-4">
        <div className="border rounded-md flex-1 p-4 py-6">
          <RangeCalendar
            value={value}
            onChange={handleRangeSetting}
            dayClassName={(_, modifiers) =>
              cx({ [classes.outside]: modifiers.outside, [classes.weekend]: modifiers.weekend })
            }
          />
        </div>
        <div className="flex-1 flex flex-col items-start gap-2">
          <p className="text-lg font-bold">Picked Date</p>
          <p className="font-bold">Date From</p>
          <DatePicker
            clearable={false}
            onChange={handleSetStartDate}
            value={value[0]}
            icon={<Calendar className="text-black absolute left-[500%]" />}
            styles={styles}
            dayClassName={(_, modifiers) =>
              cx({ [classes.outside]: modifiers.outside, [classes.weekend]: modifiers.weekend })
            }
          />
          <p className="font-bold mt-3">Date To</p>
          <DatePicker
            clearable={false}
            onChange={handleSetEndDate}
            value={value[1]}
            icon={<Calendar className="text-black absolute left-[500%]" />}
            styles={styles}
            dayClassName={(_, modifiers) =>
              cx({ [classes.outside]: modifiers.outside, [classes.weekend]: modifiers.weekend })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DateRange;
