import React from 'react';
import { Select as MantineSelect } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useFormContext } from '../../context/formContext';

const styles = {
  label: {
    marginBottom: '4px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
};

const Select = ({ options = [], name, ...props }) => {
  const form = useFormContext();
  const { onChange, value, error } = form.getInputProps(name);

  return (
    <MantineSelect
      {...props}
      data={options}
      styles={styles}
      error={error}
      value={value?.value}
      rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
      onChange={val => {
        onChange(options?.find(item => item?.value === val));
      }}
    />
  );
};

export default Select;
