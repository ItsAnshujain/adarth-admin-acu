import { Controller } from 'react-hook-form';
import { TextInput, PasswordInput } from '@mantine/core';

export const ControlledFormTextInput = ({
  name,
  control,
  isLoading,
  size,
  placeholder,
  label,
  styles = {},
  errors,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextInput
        label={label}
        styles={styles}
        disabled={isLoading}
        size={size}
        placeholder={placeholder}
        error={errors[name]?.message}
        {...field}
      />
    )}
  />
);

export const ControlledFormPasswordInput = ({
  name,
  control,
  isLoading,
  size,
  placeholder,
  label,
  styles = {},
  errors,
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <PasswordInput
        label={label}
        styles={styles}
        disabled={isLoading}
        size={size}
        placeholder={placeholder}
        error={errors[name]?.message}
        {...field}
      />
    )}
  />
);
