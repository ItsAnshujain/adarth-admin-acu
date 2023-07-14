import { Button, Group } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from '../../shared/DatePicker';
import NumberInput from '../../shared/NumberInput';
import TextInput from '../../shared/TextInput';
import { FormProvider, useForm, useFormContext } from '../../../context/formContext';

const initialPurchaseValues = {
  name: '',
  location: '',
  titleDate: '',
  dueOn: '',
  quantity: null,
  rate: null,
  price: null,
};

const purchaseSchema = yup.object({
  name: yup.string().trim().required('Description is required'),
  location: yup.string().trim().required('Location is required'),
  titleDate: yup.string().trim().required('Date is required'),
  dueOn: yup.string().trim().required('Due On Date is required'),
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
  price: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pricing is required'),
});

const initialReleaseValues = {
  city: '',
  location: '',
  media: '',
  width: null,
  height: null,
  area: null,
  displayCost: null,
  printingCost: 0,
  mountingCost: 0,
};

const releaseSchema = yup.object({
  city: yup.string().trim().required('City is required'),
  location: yup.string().trim().required('Location is required'),
  media: yup.string().trim().required('Media is required'),
  width: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Width is required'),
  height: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Height is required'),
  area: yup
    .number()
    .min(0, 'Must be greater than or equal to 0')
    .typeError('Must be a number')
    .nullable(),
  displayCost: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Display Cost is required'),
  printingCost: yup
    .number()
    .min(0, 'Must be greater than or equal to 0')
    .typeError('Must be a number'),
  mountingCost: yup
    .number()
    .min(0, 'Must be greater than or equal to 0')
    .typeError('Must be a number'),
});

const initialInvoiceValues = {
  name: '',
  location: '',
  titleDate: '',
  dueOn: '',
  quantity: null,
  rate: null,
  price: null,
};

const invoiceSchema = yup.object({
  name: yup.string().trim().required('Description is required'),
  location: yup.string().trim().required('Location is required'),
  titleDate: yup.string().trim().required('Date is required'),
  dueOn: yup.string().trim().required('Due On Date is required'),
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
  price: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pricing is required'),
});

const initialValues = {
  purchase: initialPurchaseValues,
  release: initialReleaseValues,
  invoice: initialInvoiceValues,
};

const schema = {
  purchase: purchaseSchema,
  release: releaseSchema,
  invoice: invoiceSchema,
};

const PurchaseAndInvoiceContent = () => {
  const { values, errors, setFieldValue } = useFormContext();

  useEffect(() => {
    setFieldValue('price', values.quantity * values.rate);
  }, [values.quantity, values.rate]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <TextInput
          label="Description of Goods and Services"
          name="name"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
        />
        <TextInput
          label="Location"
          name="location"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <DatePicker
          label="Date"
          name="titleDate"
          withAsterisk
          placeholder="DD/MM/YYYY"
          minDate={new Date()}
          errors={errors}
          size="md"
          className="mb-4"
        />
        <DatePicker
          label="Due On"
          name="dueOn"
          withAsterisk
          placeholder="DD/MM/YYYY"
          minDate={new Date()}
          errors={errors}
          size="md"
          className="mb-4"
        />
      </div>
      <div className="grid grid-cols-3 gap-x-4">
        <NumberInput
          label="Quantity"
          name="quantity"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
        />
        <NumberInput
          label="Rate"
          name="rate"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
        />
        <NumberInput
          label="Total Amount"
          name="price"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          readOnly
          disabled
        />
      </div>
    </>
  );
};

const ReleaseContent = ({ mountingSqftCost, printingSqftCost }) => {
  const { errors, values, setFieldValue, setValues } = useFormContext();

  useEffect(() => {
    setValues({
      ...values,
      printingCost: printingSqftCost * values.area,
      mountingCost: mountingSqftCost * values.area,
    });
  }, [values.area, mountingSqftCost, printingSqftCost]);

  useEffect(() => {
    setFieldValue('area', (values.width || 0) * (values.height || 0));
  }, [values.width, values.height]);

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <TextInput
          label="City"
          name="city"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
        />
        <TextInput
          label="Location"
          name="location"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <TextInput
          label="Media"
          name="media"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
        />
        <div className="grid grid-cols-2 gap-x-4">
          <NumberInput
            label="Width"
            name="width"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            hideControls
            onChange={e => {
              if (e !== null || !Number.isNaN(e)) {
                setFieldValue('width', e);
              }
            }}
          />
          <NumberInput
            label="Height"
            name="height"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            hideControls
            onChange={e => {
              if (e !== null || !Number.isNaN(e)) {
                setFieldValue('height', e);
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberInput
          label="Area"
          name="area"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          readOnly
          disabled
        />
        <NumberInput
          label="Total Display Cost/Month"
          name="displayCost"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberInput
          label="Printing Cost"
          name="printingCost"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          readOnly
          disabled
        />
        <NumberInput
          label="Mounting Cost"
          name="mountingCost"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          readOnly
          disabled
        />
      </div>
    </>
  );
};

const contents = {
  purchase: PurchaseAndInvoiceContent,
  release: ReleaseContent,
  invoice: PurchaseAndInvoiceContent,
};

const ManualEntryContent = ({
  onClose = () => {},
  setAddSpaceItem = () => {},
  addSpaceItem,
  item,
  type,
  mountingSqftCost,
  printingSqftCost,
}) => {
  const form = useForm({ validate: yupResolver(schema[type]), initialValues: initialValues[type] });
  const ManualEntries = contents[type] ?? <div />;
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
        name: item?.name,
        location: item?.location,
        titleDate: item?.titleDate,
        dueOn: item?.dueOn,
        quantity: item?.quantity,
        rate: item?.rate,
        price: item?.price,
        area: item?.area,
        city: item?.city,
        displayCost: item?.displayCost,
        height: item?.height,
        itemId: item?.itemId,
        media: item?.media,
        mountingCost: item?.mountingCost,
        printingCost: item?.printingCost,
        width: item?.width,
      });
    }
  }, [item]);

  return (
    <FormProvider form={form}>
      <form className="px-5" onSubmit={form.onSubmit(onSubmit)}>
        <ManualEntries mountingSqftCost={mountingSqftCost} printingSqftCost={printingSqftCost} />
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
