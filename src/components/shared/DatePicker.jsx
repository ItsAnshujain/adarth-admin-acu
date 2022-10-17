import { DatePicker as MantineDatePicker } from '@mantine/dates';
import { useFormContext } from '../../context/formContext';

const DatePicker = ({ name = '', styles, errors, ...props }) => {
  const form = useFormContext();

  return (
    <MantineDatePicker
      name={name}
      placeholder="DD/MM/YYYY"
      inputFormat="DD/MM/YYYY"
      defaultValue={new Date()}
      styles={styles}
      error={errors}
      {...form.getInputProps(name)}
      {...props}
    />
  );
};

export default DatePicker;
