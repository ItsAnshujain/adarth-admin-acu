import React from 'react';
import { DatePicker as MantineDatePicker } from '@mantine/dates';

const DatePicker = React.forwardRef(({ ...props }, ref) => (
  <MantineDatePicker
    ref={ref}
    classNames={{
      label: 'font-medium text-gray-700 text-base mb-2',
      input: 'border-[1px] border-gray-450',
    }}
    {...props}
  />
));

DatePicker.displayName = 'DatePicker';
export default DatePicker;
