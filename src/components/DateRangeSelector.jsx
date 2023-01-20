import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mantine/dates';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useStyles } from './DateRange';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const DateRangeSelector = ({ dateValue, dateRange, onChange, ...props }) => {
  const { classes, cx } = useStyles();
  // TODO: wip

  /**
   *
   * @param {Date} date
   */
  const excludeBookedDates = date =>
    dateRange.some(item => {
      if (
        dateValue[0] &&
        dayjs(dateValue[0]).isBefore(dayjs(item?.startDate).format('YYYY-MM-DD')) &&
        dayjs(date).isAfter(dayjs(item?.startDate).format('YYYY-MM-DD'))
      ) {
        return true;
      }

      if (
        dateValue[0] &&
        dayjs(dateValue[0]).isAfter(dayjs(item?.endDate).format('YYYY-MM-DD')) &&
        dayjs(date).isBefore(dayjs(item?.endDate).format('YYYY-MM-DD'))
      ) {
        return true;
      }

      if (
        dayjs(dayjs(date).format('YYYY-MM-DD')).isSameOrAfter(
          dayjs(item?.startDate).format('YYYY-MM-DD'),
        ) &&
        dayjs(dayjs(date).format('YYYY-MM-DD')).isSameOrBefore(
          dayjs(item?.endDate).format('YYYY-MM-DD'),
        )
      ) {
        return true;
      }
      return false;
    });

  const handleChange = val => {
    // setDateValue(val);
    onChange?.(val);
  };

  return (
    <DateRangePicker
      placeholder="Pick dates range"
      onChange={handleChange}
      excludeDate={date => excludeBookedDates(date)}
      disableOutsideEvents
      defaultValue={dateValue}
      dayClassName={(_, modifiers) =>
        cx({
          [classes.weekend]: modifiers.weekend,
          [classes.disabled]: modifiers.disabled,
          [classes.selectedInRange]: modifiers.selectedInRange,
        })
      }
      {...props}
    />
  );
};

export default DateRangeSelector;
