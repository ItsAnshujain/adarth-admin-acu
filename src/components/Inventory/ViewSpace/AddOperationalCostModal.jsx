import { Box, Button, Group } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import React from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from '../../../context/formContext';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils';
import NumberInput from '../../shared/NumberInput';
import Select from '../../shared/Select';

const styles = {
  label: {
    marginBottom: 8,
    fontWeight: 700,
    fontSize: 16,
  },
  input: {
    borderRadius: 0,
    padding: 8,
  },
};

const initialValues = {
  type: { label: '', value: '' },
  cost: 0,
};

const schema = yup.object({
  type: yup
    .object({
      label: yup.string().trim(),
      value: yup.string().trim(),
    })
    .test('spaceStatus', 'Type is required', obj => obj.value !== ''),
  cost: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Cost is required'),
});

// TOOD: integration left
const AddOperationalCostModal = () => {
  const {
    data: spaceStatusData,
    isLoading: isSpaceStatusLoading,
    isSuccess: isSpaceStatusLoaded,
  } = useFetchMasters(
    serialize({ type: 'space_status', limit: 100, page: 1, sortBy: 'name', sortOrder: 'asc' }),
  );

  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmit = async formData => {
    // eslint-disable-next-line no-console
    console.log(formData);
  };

  return (
    <Box className="border-t">
      <FormProvider form={form}>
        <form className="px-5 pt-3" onSubmit={form.onSubmit(onSubmit)}>
          <Select
            label="Type"
            name="type"
            withAsterisk
            errors={form.errors}
            disabled={isSpaceStatusLoading}
            placeholder="Select..."
            size="md"
            options={
              isSpaceStatusLoaded
                ? spaceStatusData?.docs?.map(category => ({
                    label: category.name,
                    value: category._id,
                  }))
                : []
            }
            className="mb-4"
          />
          <NumberInput
            label="Amount ₹"
            name="cost"
            withAsterisk
            errors={form.errors}
            disabled={isSpaceStatusLoading}
            placeholder="Write..."
            size="md"
            className="mb-4"
            styles={styles}
            hideControls
          />
          <Group position="right">
            <Button type="submit" className="primary-button">
              Add
            </Button>
          </Group>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddOperationalCostModal;
