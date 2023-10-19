import { Box, Button, Group } from '@mantine/core';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledTextInput from '../../../shared/FormInputs/Controlled/ControlledTextInput';

const schema = yup.object({
  name: yup.string().required('Title is required'),
  description: yup.mixed(),
});

const AddTermsAndConditionsForm = ({ onClose }) => {
  const form = useForm({ resolver: yupResolver(schema) });

  const onSubmit = form.handleSubmit(async formData => {
    // TODO: api integration left
    // eslint-disable-next-line no-unused-vars
    const data = { ...formData };
  });

  return (
    <Box className="border-t">
      <FormProvider {...form}>
        <form className="px-3 pt-3" onSubmit={onSubmit}>
          <ControlledTextInput
            label="Title"
            name="title"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />
          <ControlledTextInput
            label="Description"
            name="description"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />
          <Group position="right">
            <Button
              className="dark-button"
              onClick={onClose}
              // disabled={createPayment.isLoading || updatePayment.isLoading || upload.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="primary-button"
              // loading={createPayment.isLoading || updatePayment.isLoading || upload.isLoading}
            >
              Add
            </Button>
          </Group>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddTermsAndConditionsForm;
