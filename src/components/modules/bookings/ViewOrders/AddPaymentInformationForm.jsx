import { Box, Button, Group, Text } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import { FormProvider, useForm } from 'react-hook-form';
import { ChevronDown } from 'react-feather';
import { useQueryClient } from '@tanstack/react-query';
import { DATE_FORMAT, MODE_OF_PAYMENT } from '../../../../utils/constants';
import { useCreatePayment } from '../../../../apis/queries/payment.queries';
import { useUploadFile } from '../../../../apis/queries/upload.queries';
import ControlledDropzone from '../../../shared/FormInputs/Controlled/ControlledDropzone';
import ControlledTextInput from '../../../shared/FormInputs/Controlled/ControlledTextInput';
import ControlledNumberInput from '../../../shared/FormInputs/Controlled/ControlledNumberInput';
import ControlledSelect from '../../../shared/FormInputs/Controlled/ControlledSelect';
import ControlledDatePicker from '../../../shared/FormInputs/Controlled/ControlledDatePicker';

const schema = yup.object({
  type: yup.string().required('Payment Type is required'),
  amount: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Amount is required'),
});

const AddPaymentInformationForm = ({ bookingId, onClose }) => {
  const queryClient = useQueryClient();
  const form = useForm({ resolver: yupResolver(schema) });
  const createPayment = useCreatePayment();
  const upload = useUploadFile();

  const handleInvoiceUpload = async params => {
    const formData = new FormData();
    formData.append('files', params);
    const res = await upload.mutateAsync(formData);
    return res?.Location;
  };

  const onSubmit = form.handleSubmit(async formData => {
    const data = { ...formData, bookingId };

    data.paymentDate = data.paymentDate && dayjs(data.paymentDate).format(DATE_FORMAT);

    if (data?.invoice) {
      const uploaded = handleInvoiceUpload(data.invoice);
      data.invoice = uploaded;
    }

    createPayment.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(['payment']);
        form.reset();
        onClose();
        showNotification({
          title: 'Payment added successfully',
          color: 'green',
        });
      },
    });
  });

  return (
    <Box className="border-t">
      <FormProvider {...form}>
        <form className="px-3 pt-3" onSubmit={onSubmit}>
          <ControlledSelect
            label="Payment Type"
            name="type"
            data={MODE_OF_PAYMENT}
            placeholder="Select..."
            rightSection={<ChevronDown size={16} />}
            className="mb-4"
          />
          <ControlledNumberInput
            label="Amount ₹"
            name="amount"
            withAsterisk
            placeholder="Write..."
            className="mb-4"
          />
          <ControlledTextInput
            label="Card Number"
            name="cardNumber"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />
          <ControlledDatePicker
            label="Payment Date"
            name="paymentDate"
            placeholder="Select date..."
            clearable={false}
            className="mb-4"
          />
          <ControlledTextInput
            label="Payment Reference ID"
            name="referenceNumber"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />
          <ControlledTextInput
            label="Remarks"
            name="remarks"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />
          <Group position="center">
            <ControlledDropzone name="invoice" />
            <Text>Upload Invoice</Text>
          </Group>
          <Group position="right">
            <Button
              type="submit"
              className="primary-button"
              loading={createPayment.isLoading || upload.isLoading}
            >
              Add
            </Button>
          </Group>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddPaymentInformationForm;
