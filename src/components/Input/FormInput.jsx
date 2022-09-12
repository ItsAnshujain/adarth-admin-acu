import { Controller } from 'react-hook-form';
import { TextInput, PasswordInput } from '@mantine/core';

export const ControlledFormTextInput = ({
  name,
  initialValues,
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
    defaultValue={initialValues[name]}
    control={control}
    render={({ field }) => (
      <TextInput
        label={label}
        styles={styles}
        disabled={isLoading}
        {...field}
        size={size}
        placeholder={placeholder}
        error={errors[name]?.message}
      />
    )}
  />
);

export const ControlledFormPasswordInput = ({
  name,
  initialValues,
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
    defaultValue={initialValues[name]}
    control={control}
    render={({ field }) => (
      <PasswordInput
        label={label}
        styles={styles}
        disabled={isLoading}
        {...field}
        size={size}
        placeholder={placeholder}
        error={errors[name]?.message}
      />
    )}
  />
);
