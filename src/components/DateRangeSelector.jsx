import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mantine/dates';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { createStyles } from '@mantine/core';
import { DATE_FORMAT } from '../utils/constants';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const useStyles = createStyles({
  outside: { opacity: 0 },
  disabled: { color: '#ced4da !important' },
  weekend: { color: '#495057 !important' },
  selectedRange: { color: '#FFF !important' },
});

const DateRangeSelector = ({ dateValue, dateRange, onChange, ...props }) => {
  const { classes, cx } = useStyles();
  const [value, setValue] = useState([null, null]);

  /**
   *
   * @param {Date} date
   */
  const excludeBookedDates = date =>
    dateRange.some(item => {
      if (
        value[0] &&
        dayjs(value[0]).isBefore(dayjs(item?.startDate).format(DATE_FORMAT)) &&
        dayjs(date).isAfter(dayjs(item?.startDate).format(DATE_FORMAT)) &&
        item?.remainingUnit === 0
      ) {
        return true;
      }

      if (
        value[0] &&
        dayjs(value[0]).isAfter(dayjs(item?.endDate).format(DATE_FORMAT)) &&
        dayjs(date).isBefore(dayjs(item?.endDate).format(DATE_FORMAT)) &&
        item?.remainingUnit === 0
      ) {
        return true;
      }

      if (
        dayjs(dayjs(date).format(DATE_FORMAT)).isSameOrAfter(
          dayjs(item?.startDate).format(DATE_FORMAT),
        ) &&
        dayjs(dayjs(date).format(DATE_FORMAT)).isSameOrBefore(
          dayjs(item?.endDate).format(DATE_FORMAT),
        ) &&
        item?.remainingUnit === 0
      ) {
        return true;
      }
      return false;
    });

  const handleChange = val => {
    setValue(val);
    if (val[0] === null && val[1] === null) onChange(val);
    if (onChange && val[0] && val[1]) onChange(val);
  };

  return (
    <DateRangePicker
      placeholder="Pick dates range"
      onChange={handleChange}
      excludeDate={excludeBookedDates}
      disableOutsideEvents
      allowSingleDateInRange
      defaultValue={dateValue}
      dayClassName={(_, modifiers) =>
        cx({
          [classes.outside]: modifiers.outside,
          [classes.weekend]: modifiers.weekend,
          [classes.selectedRange]: modifiers.selectedInRange,
          [classes.disabled]: modifiers.disabled,
        })
      }
      {...props}
    />
  );
};

export default DateRangeSelector;
