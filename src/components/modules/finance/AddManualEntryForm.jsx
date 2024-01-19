import { ActionIcon, Button, Group, Image } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { showNotification } from '@mantine/notifications';
import DatePicker from '../../shared/DatePicker';
import NumberInput from '../../shared/NumberInput';
import TextInput from '../../shared/TextInput';
import { FormProvider, useForm, useFormContext } from '../../../context/formContext';
import TrashIcon from '../../../assets/trash.svg';
import { useFetchMasters } from '../../../apis/queries/masters.queries';
import { serialize } from '../../../utils';
import Select from '../../shared/Select';
import { FACING_VALUE_LIST } from '../../../utils/constants';

const query = {
  parentId: null,
  limit: 100,
  page: 1,
  sortBy: 'name',
  sortOrder: 'asc',
};

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
  area: null,
  displayCost: null,
  printingCost: 0,
  mountingCost: 0,
  size: [
    {
      height: null,
      width: null,
      key: uuidv4(),
    },
  ],
  unit: null,
  facing: { label: '', value: '' },
};

const releaseSchema = yup.object({
  city: yup.string().trim().required('City is required'),
  location: yup.string().trim().required('Location is required'),
  media: yup.string().trim().required('Media is required'),
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
  size: yup.array().of(
    yup.object({
      height: yup
        .number()
        .positive('Must be a positive number')
        .typeError('Must be a number')
        .nullable()
        .required('Height is required'),
      width: yup
        .number()
        .positive('Must be a positive number')
        .typeError('Must be a number')
        .nullable()
        .required('Width is required'),
    }),
  ),
  unit: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Unit is required'),
  facing: yup
    .object({
      label: yup.string().trim(),
      value: yup.string().trim(),
    })
    .test('facing', 'Facing is required', obj => obj.value !== ''),
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
  hsn: yup.number(),
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

const PurchaseAndInvoiceContent = ({ type }) => {
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
      <div
        className={classNames('grid gap-x-4', type === 'invoice' ? ' grid-cols-3' : 'grid-cols-2')}
      >
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
        {type === 'invoice' ? (
          <NumberInput
            label="HSN"
            name="hsn"
            errors={errors}
            placeholder="Write..."
            size="md"
            className="mb-4"
            min={0}
            hideControls
            precision={2}
          />
        ) : null}
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
          precision={2}
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
          precision={2}
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
          precision={2}
        />
      </div>
    </>
  );
};

const ReleaseContent = ({ mountingSqftCost, printingSqftCost }) => {
  const { errors, values, setFieldValue, setValues, insertListItem, removeListItem } =
    useFormContext();

  const {
    data: facingData,
    isLoading: isFacingLoading,
    isSuccess: isFacingLoaded,
  } = useFetchMasters(serialize({ type: 'facing', ...query }));

  const getFacingValue = (facing = 'single') => {
    const facingIndex = FACING_VALUE_LIST.findIndex(item => facing.toLowerCase().includes(item));

    return facingIndex + 1;
  };

  const memoizedFacingData = useMemo(() => {
    if (isFacingLoaded) {
      return facingData.docs.map(category => ({
        label: category.name,
        value: getFacingValue(category.name),
      }));
    }
    return [];
  }, [facingData, isFacingLoaded]);

  useEffect(() => {
    setValues({
      ...values,
      printingCost: printingSqftCost * values.area,
      mountingCost: mountingSqftCost * values.area,
    });
  }, [values.area, mountingSqftCost, printingSqftCost]);

  const calculateHeightWidth = useMemo(() => {
    const total = values.size?.reduce((acc, item) => {
      if (item?.width && item?.height) {
        return acc + item.width * item.height;
      }
      return acc;
    }, 0);

    return total || 0;
  }, [values.size]);

  useEffect(() => {
    setFieldValue('area', calculateHeightWidth * (values.unit || 0) * (values.facing?.value || 0));
  }, [calculateHeightWidth, values.unit, values.facing?.value]);

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

        <div className="max-h-[240px] overflow-y-scroll mb-2">
          {values.size?.map((item, index) => (
            <div key={item?.key} className="grid grid-cols-2 gap-4 relative">
              {index !== 0 ? (
                <ActionIcon
                  className="absolute right-0"
                  onClick={() => removeListItem('size', index)}
                >
                  <Image src={TrashIcon} height={15} width={15} />
                </ActionIcon>
              ) : null}
              <div>
                <p className="mt-[2px] font-medium text-[15px]">
                  Width <span className="text-red-450">*</span>{' '}
                  <span className="text-xs text-gray-500">(in ft)</span>
                </p>
                <NumberInput
                  name={`size.${index}.width`}
                  withAsterisk
                  errors={errors}
                  placeholder="Write..."
                  size="md"
                  className="mb-4"
                  precision={2}
                />
              </div>
              <div>
                <p className="mt-[2px] font-medium text-[15px]">
                  Height <span className="text-red-450">*</span>{' '}
                  <span className="text-xs text-gray-500">(in ft)</span>
                </p>
                <NumberInput
                  name={`size.${index}.height`}
                  withAsterisk
                  errors={errors}
                  placeholder="Write..."
                  size="md"
                  className="mb-4"
                  precision={2}
                />
              </div>
            </div>
          ))}

          <Button
            className="secondary-button mb-2"
            onClick={() => insertListItem('size', { height: '', width: '', key: uuidv4() })}
          >
            Add More
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <NumberInput
          label="Unit"
          name="unit"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
        />
        <Select
          label="Facing"
          name="facing"
          withAsterisk
          errors={errors}
          placeholder="Select..."
          size="md"
          disabled={isFacingLoading}
          classNames={{ label: 'font-medium mb-0' }}
          options={memoizedFacingData}
          className="mb-4"
        />
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
          precision={2}
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
          precision={2}
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
          precision={2}
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
          precision={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberInput
          label="Display Cost Discount"
          name="displayCostDiscount"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          min={0}
          // max={calculatedData?.initTotal?.display}
        />
        <NumberInput
          label="Printing Cost Discount"
          name="printingCostDiscount"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          min={0}
          // max={calculatedData?.initTotal?.printing}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <NumberInput
          label="Mounting Cost Discount"
          name="mountingCostDiscount"
          errors={errors}
          placeholder="Write..."
          size="md"
          className="mb-4"
          hideControls
          min={0}
          // max={calculatedData?.initTotal?.mounting}
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
      showNotification({
        title: 'Item updated successfully',
        color: 'green',
      });
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
        hsn: item?.hsn,
        size: item?.size?.map(ele => ({
          height: ele?.height,
          width: ele?.width,
        })),
        unit: item?.unit,
        facing: { label: item?.facing?.label, value: item?.facing?.value },
        displayCostDiscount: item.displayCostDiscount,
        mountingCostDiscount: item.mountingCostDiscount,
        printingCostDiscount: item.printingCostDiscount,
      });
    }
  }, [item]);

  return (
    <FormProvider form={form}>
      <form className="px-5" onSubmit={form.onSubmit(onSubmit)}>
        <ManualEntries
          mountingSqftCost={mountingSqftCost}
          printingSqftCost={printingSqftCost}
          type={type}
        />
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
