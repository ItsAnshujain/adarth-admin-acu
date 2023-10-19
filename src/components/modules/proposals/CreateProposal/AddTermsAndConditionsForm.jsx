import { Box, Button, Group } from '@mantine/core';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import ControlledTextInput from '../../../shared/FormInputs/Controlled/ControlledTextInput';
import { useCreateProposalTerms } from '../../../../apis/queries/proposal.queries';

const schema = yup.object({
  name: yup.string().required('Title is required'),
  description: yup.mixed(),
});

const AddTermsAndConditionsForm = ({ onClose }) => {
  const queryClient = useQueryClient();
  const form = useForm({ resolver: yupResolver(schema) });

  const createProposalTerms = useCreateProposalTerms();

  const onSubmit = form.handleSubmit(async formData => {
    const data = { ...formData };

    createProposalTerms.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(['proposal-terms']);
        showNotification({
          title: 'Terms & Conditions added successfully',
          color: 'green',
        });
        onClose();
      },
    });
  });

  return (
    <Box className="border-t">
      <FormProvider {...form}>
        <form className="px-3 pt-3" onSubmit={onSubmit}>
          <ControlledTextInput
            label="Title"
            name="name"
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
              disabled={createProposalTerms.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="primary-button"
              loading={createProposalTerms.isLoading}
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
