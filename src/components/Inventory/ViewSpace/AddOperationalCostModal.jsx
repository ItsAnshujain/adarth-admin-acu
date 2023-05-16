import { Box, Button, Group } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from '../../../context/formContext';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import {
  useAddOperationalCost,
  useUpdateOperationalCost,
} from '../../../hooks/operationalCost.hooks';
import { serialize } from '../../../utils';
import NumberInput from '../../shared/NumberInput';
import Select from '../../shared/Select';
import TextareaInput from '../../shared/TextareaInput';
import DatePicker from '../../shared/DatePicker';
import { useBookings } from '../../../hooks/booking.hooks';

const bookingQueries = {
  page: 1,
  limit: 100,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

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
  amount: null,
  description: '',
  date: '',
  inventoryId: '',
  bookingId: '',
};

const schema = yup.object({
  type: yup
    .object({
      label: yup.string().trim(),
      value: yup.string().trim(),
    })
    .test('operationalCostType', 'Type is required', obj => obj.value !== ''),
  amount: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Amount is required'),
});

const AddOperationalCostModal = ({
  inventoryId,
  onClose,
  costId,
  type,
  amount,
  description,
  date,
  bookingId,
}) => {
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const {
    data: operationalCostData,
    isLoading: isOperationalCostLoading,
    isSuccess: isOperationalCostLoaded,
  } = useFetchMasters(
    serialize({
      type: 'operational_cost_type',
      limit: 100,
      page: 1,
      sortBy: 'name',
      sortOrder: 'asc',
    }),
  );

  const {
    data: bookingDatas,
    isLoading: isBookingDatasLoading,
    isSuccess: isBookingDatasLoaded,
  } = useBookings(serialize(bookingQueries));

  const { mutate: addCost, isLoading: isAddLoading } = useAddOperationalCost();
  const { mutate: editCost, isLoading: isEditLoading } = useUpdateOperationalCost();

  const onSubmit = async formData => {
    const data = { ...formData };
    data.type = data.type.value;
    data.inventoryId = inventoryId;

    if (data.bookingId?.value) {
      data.bookingId = data.bookingId.value;
    }

    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        delete data[key];
      }
    });

    if (costId) {
      editCost({ id: costId, data }, { onSuccess: () => onClose() });
    } else {
      addCost(data, { onSuccess: () => onClose() });
    }
  };

  useEffect(() => {
    if (costId) {
      form.setValues({
        amount,
        type: {
          label: type?.name,
          value: type?._id,
        },
        date: new Date(date) || new Date(),
        description,
        bookingId: {
          value: bookingId,
        },
      });
    }
  }, [costId]);

  return (
    <Box className="border-t">
      <FormProvider form={form}>
        <form className="px-5 pt-3" onSubmit={form.onSubmit(onSubmit)}>
          <DatePicker
            label="Date"
            name="date"
            withAsterisk
            placeholder="DD/MM/YYYY"
            minDate={new Date()}
            size="md"
            styles={styles}
            className="mb-4"
          />
          <Select
            label="Type"
            name="type"
            withAsterisk
            errors={form.errors}
            disabled={isOperationalCostLoading || isAddLoading || isEditLoading}
            placeholder="Select..."
            size="md"
            options={
              isOperationalCostLoaded
                ? operationalCostData?.docs?.map(category => ({
                    label: category.name,
                    value: category._id,
                  }))
                : []
            }
            className="mb-4"
          />
          <NumberInput
            label="Amount ₹"
            name="amount"
            withAsterisk
            errors={form.errors}
            disabled={isOperationalCostLoading || isAddLoading || isEditLoading}
            placeholder="Write..."
            size="md"
            className="mb-4"
            styles={styles}
            hideControls
          />
          <TextareaInput
            styles={styles}
            label="Description"
            name="description"
            disabled={isOperationalCostLoading || isAddLoading || isEditLoading}
            placeholder="Maximun 200 characters"
            maxLength={200}
            className="mb-4"
          />
          <Select
            label="Bookings"
            name="bookingId"
            errors={form.errors}
            disabled={
              isOperationalCostLoading || isAddLoading || isEditLoading || isBookingDatasLoading
            }
            placeholder="Select..."
            size="md"
            options={
              isBookingDatasLoaded
                ? bookingDatas?.docs?.map(booking => ({
                    label: booking?.campaign?.name,
                    value: booking?._id,
                  }))
                : []
            }
            className="mb-4"
          />
          <Group position="right">
            <Button
              type="submit"
              className="primary-button"
              disabled={isAddLoading || isEditLoading}
              loading={isAddLoading || isEditLoading}
            >
              {costId ? 'Edit' : 'Add'}
            </Button>
          </Group>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddOperationalCostModal;
