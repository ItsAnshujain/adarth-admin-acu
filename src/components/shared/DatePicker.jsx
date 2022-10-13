import { DatePicker as MantineDatePicker } from '@mantine/dates';
import { useState } from 'react';
import { useFormContext } from '../../context/formContext';

const DatePicker = ({ name = '', styles, errors, ...props }) => {
  const [dateValue, setDateValue] = useState(new Date());
  const form = useFormContext();

  return (
    <MantineDatePicker
      name={name}
      placeholder="DD/MM/YYYY"
      inputFormat="MM/DD/YYYY"
      value={dateValue}
      styles={styles}
      error={errors}
      onChange={setDateValue}
      {...form.getInputProps(name)}
      {...props}
    />
  );
};

export default DatePicker;
