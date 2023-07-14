import React from 'react';
import { useFormContext } from 'react-hook-form';
import TextInput from '../TextInput';

const ControlledTextInput = ({ name, ...props }) => {
  const form = useFormContext();

  return (
    <TextInput
      {...form.register(name)}
      error={form.formState?.errors?.[name]?.message}
      {...props}
    />
  );
};

export default ControlledTextInput;
