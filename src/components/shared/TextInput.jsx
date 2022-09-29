import React from 'react';
import { TextInput as MantineTextInput } from '@mantine/core';
import { useFormContext } from '../../context/formContext';

const TextInput = ({ name, errors, styles, ...props }) => {
  const form = useFormContext();

  return (
    <MantineTextInput
      name={name}
      styles={styles}
      error={errors}
      {...form.getInputProps(name)}
      {...props}
    />
  );
};

export default TextInput;
