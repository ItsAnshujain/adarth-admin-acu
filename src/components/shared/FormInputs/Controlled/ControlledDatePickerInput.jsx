import { DatePickerInput } from '@mantine/dates';
import { useController, useFormContext } from 'react-hook-form';

const ControlledDatePickerInput = ({ name, ...props }) => {
  const form = useFormContext();
  const { field, fieldState } = useController({
    name,
    control: form.control,
  });

  return <DatePickerInput {...props} {...field} error={fieldState.error?.message} />;
};

export default ControlledDatePickerInput;
