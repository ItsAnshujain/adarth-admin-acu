import { Button, Group } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from '../../components/shared/DatePicker';
import NumberInput from '../../components/shared/NumberInput';
import TextInput from '../../components/shared/TextInput';
import { FormProvider, useForm } from '../../context/formContext';

const initialValues = {
  description: '',
  date: '',
  quantity: null,
  rate: null,
  per: null,
  price: null,
};

const schema = yup.object({
  description: yup.string().trim().required('Description is required'),
  date: yup.string().trim().required('Date is required'),
  quantity: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Quantity is required'),
  rate: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Rate is required'),
  per: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Per is required'),
  price: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pricing is required'),
});

const ManualEntryContent = ({
  onClose = () => {},
  setAddSpaceItem = () => {},
  addSpaceItem,
  item,
}) => {
  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmit = async formData => {
    if (item) {
      const tempArr = [...addSpaceItem];
      const res = tempArr.map(ele => {
        if (ele.itemId === item.itemId) {
          return { ...formData, itemId: item.itemId };
        }
        return ele;
      });
      setAddSpaceItem(res);
      onClose();
      return;
    }
    setAddSpaceItem(prevState => [...prevState, { ...formData, itemId: uuidv4() }]);
    onClose();
  };

  useEffect(() => {
    if (item) {
      form.setValues({
        description: item?.description,
        date: item?.date,
        quantity: item?.quantity,
        rate: item?.rate,
        per: item?.per,
        price: item?.price,
      });
    }
  }, [item]);

  return (
    <FormProvider form={form}>
      <form className="px-5" onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Description of Goods and Service"
          name="description"
          withAsterisk
          placeholder="Write..."
          size="md"
          className="mb-4"
        />
        <DatePicker
          label="Date"
          name="date"
          withAsterisk
          placeholder="DD/MM/YYYY"
          minDate={new Date()}
          size="md"
          className="mb-4"
        />
        <div className="grid grid-cols-2 gap-x-4">
          <NumberInput
            label="Quantity"
            name="quantity"
            withAsterisk
            errors={form.errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            hideControls
          />
          <NumberInput
            label="Rate"
            name="rate"
            withAsterisk
            errors={form.errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            hideControls
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <NumberInput
            label="Per"
            name="per"
            withAsterisk
            errors={form.errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            hideControls
          />
          <NumberInput
            label="Pricing"
            name="price"
            withAsterisk
            errors={form.errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            hideControls
          />
        </div>
        <Group position="right">
          <Button type="submit" className="primary-button">
            {item ? 'Edit' : 'Add'}
          </Button>
        </Group>
      </form>
    </FormProvider>
  );
};

export default ManualEntryContent;
