import { Box, Button, Group } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import React from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from '../../../../context/formContext';
import DatePicker from '../../../shared/DatePicker';
import TextInput from '../../../shared/TextInput';
import NumberInput from '../../../shared/NumberInput';
import Select from '../../../shared/Select';
import { MODE_OF_PAYMENT } from '../../../../utils/constants';

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
  paymentType: { label: '', value: '' },
};

const schema = yup.object({
  paymentType: yup.mixed().test('type', 'Payment Type is required', obj => obj.value !== ''),
  amount: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Amount is required'),
  cardNumber: yup.string().trim(),
  referenceId: yup.string().trim(),
  remarks: yup.string().trim(),
});

const AddPaymentInformationForm = () => {
  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmit = async formData => {
    const data = { ...formData };
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <Box className="border-t">
      <FormProvider form={form}>
        <form className="px-5 pt-3" onSubmit={form.onSubmit(onSubmit)}>
          <Select
            label="Payment Type"
            name="paymentType"
            withAsterisk
            errors={form.errors}
            placeholder="Select..."
            size="md"
            options={MODE_OF_PAYMENT}
            className="mb-4"
          />
          <NumberInput
            label="Amount ₹"
            name="amount"
            withAsterisk
            errors={form.errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            styles={styles}
            hideControls
          />

          <TextInput
            styles={styles}
            label="Card Number"
            name="cardNumber"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />

          <DatePicker
            label="Payment Date"
            name="paymentDate"
            withAsterisk
            placeholder="DD/MM/YYYY"
            minDate={new Date()}
            size="md"
            styles={styles}
            className="mb-4"
          />
          <TextInput
            styles={styles}
            label="Payment Reference ID"
            name="referenceId"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
          />
          <TextInput
            styles={styles}
            label="Remarks"
            name="remarks"
            placeholder="Write..."
            maxLength={200}
            className="mb-4"
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

export default AddPaymentInformationForm;
