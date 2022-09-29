import React from 'react';
import { Select as MantineSelect } from '@mantine/core';
import { useFormContext } from '../../context/formContext';

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderRadius: 0,
    padding: 8,
  },
};

const Select = ({ options = [], name, errors, ...props }) => {
  const form = useFormContext();

  return (
    <MantineSelect
      data={options}
      styles={styles}
      error={errors}
      {...form.getInputProps(name)}
      {...props}
    />
  );
};

export default Select;
