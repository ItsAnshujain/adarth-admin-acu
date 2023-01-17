import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DateRangePicker } from '@mantine/dates';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { useStyles } from './DateRange';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const DateRangeSelector = ({ startDate, endDate, ...props }) => {
  const { classes, cx } = useStyles();
  const [dateValue, setDateValue] = useState([null, null]);
  // TODO: wip

  /**
   *
   * @param {Date} date
   */
  const excludeBookedDates = date => {
    if (dayjs(date).isSameOrAfter(startDate) && dayjs(date).isSameOrBefore(endDate)) {
      return true;
    }

    if (
      dateValue[0] &&
      dayjs(dateValue[0]).isBefore(dayjs(startDate)) &&
      dayjs(date).isAfter(startDate)
    ) {
      return true;
    }

    if (
      dateValue[0] &&
      dayjs(dateValue[0]).isAfter(dayjs(endDate)) &&
      dayjs(date).isBefore(endDate)
    ) {
      return true;
    }

    return false;
  };

  return (
    <DateRangePicker
      placeholder="Pick dates range"
      onChange={val => setDateValue(val)}
      excludeDate={date => excludeBookedDates(date, startDate, endDate)}
      disableOutsideEvents
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
