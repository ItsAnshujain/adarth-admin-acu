import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ToWords } from 'to-words';
import { DatePicker } from '@mantine/dates';
import { ActionIcon, Button, Group, Menu, Text } from '@mantine/core';
import { Edit2, Trash2 } from 'react-feather';
import Table from '../../Table/Table';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFormContext } from '../../../context/formContext';
import NumberInput from '../../shared/NumberInput';
import NoData from '../../shared/NoData';
import { useStyles } from '../../DateRange';
import MenuIcon from '../../Menu';

const DATE_FORMAT = 'DD MMM YYYY';

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
    padding: 8,
  },
};

const PurchaseOrder = ({
  totalPrice,
  onClickAddItems = () => {},
  bookingIdFromFinance,
  addSpaceItem = [],
  setAddSpaceItem = () => {},
}) => {
  const { classes, cx } = useStyles();
  const { errors, setFieldValue, values } = useFormContext();
  const toWords = new ToWords();

  const updateData = (key, val, id) => {
    setAddSpaceItem(prev => prev.map(item => (item._id === id ? { ...item, [key]: val } : item)));

    setFieldValue(
      'spaces',
      values.spaces.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );
  };

  const handleDeleteSpaceItem = spaceId => {
    setAddSpaceItem(addSpaceItem?.filter(item => item.itemId !== spaceId));
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row: { index } }) => index + 1,
      },
      {
        Header: 'DESCRIPTION OF GOODS AND SERVICE',
        accessor: 'basicInformation.spaceName',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { basicInformation, location, startDate, endDate },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex flex-col items-start gap-1">
                <Text
                  className="overflow-hidden text-ellipsis max-w-[280px]"
                  lineClamp={1}
                  title={basicInformation?.spaceName}
                >
                  {basicInformation?.spaceName}
                </Text>
                <Text
                  className="overflow-hidden text-ellipsis max-w-[280px]"
                  lineClamp={1}
                  title={location?.address}
                >
                  {location?.address}
                </Text>
                <div className="text-black font-light pr-2 text-xs">
                  <span className="overflow-hidden text-ellipsis">
                    {startDate ? dayjs(startDate).format(DATE_FORMAT) : <NoData type="na" />}
                    {' to '}
                  </span>
                  <span className="overflow-hidden text-ellipsis">
                    {endDate ? dayjs(endDate).format(DATE_FORMAT) : <NoData type="na" />}
                  </span>
                </div>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'DATE',
        accessor: 'date',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { dueOn, _id },
          },
        }) =>
          useMemo(
            () => (
              <DatePicker
                defaultValue={dueOn || new Date()}
                placeholder="Month Day, Year"
                minDate={new Date()}
                onChange={val => updateData('dueOn', val, _id)}
                dayClassName={(_, modifiers) =>
                  cx({
                    [classes.outside]: modifiers.outside,
                    [classes.weekend]: modifiers.weekend,
                    [classes.disabled]: modifiers.disabled,
                    [classes.selected]: modifiers.selected,
                  })
                }
              />
            ),
            [dueOn],
          ),
      },
      {
        Header: 'QUANTITY',
        accessor: 'quantity',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { quantity = 1, _id },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                hideControls
                defaultValue={+quantity || 1}
                onBlur={e => updateData('quantity', e.target.value, _id)}
                min={1}
              />
            ),
            [quantity],
          ),
      },
      {
        Header: 'RATE',
        accessor: 'rate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaignPrice },
          },
        }) =>
          useMemo(
            () => <p className="pl-2">{campaignPrice ? toIndianCurrency(+campaignPrice) : 0}</p>,
            [],
          ),
      },
      {
        Header: 'TOTAL AMOUNT',
        accessor: 'basicInformation.price',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { campaignPrice, quantity = 1 },
          },
        }) =>
          useMemo(
            () => (
              <p className="pl-2">
                {campaignPrice ? toIndianCurrency(+campaignPrice * (+quantity || 1)) : 0}
              </p>
            ),
            [],
          ),
      },
    ],
    [addSpaceItem],
  );

  const manualEntryColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row: { index } }) => index + 1,
      },
      {
        Header: 'DESCRIPTION OF GOODS AND SERVICE',
        accessor: 'name',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { name, location, titleDate },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex flex-col items-start gap-1">
                <Text
                  className="overflow-hidden text-ellipsis max-w-[280px]"
                  lineClamp={1}
                  title={name}
                >
                  {name}
                </Text>
                <Text
                  className="overflow-hidden text-ellipsis max-w-[180px]"
                  lineClamp={1}
                  title={typeof location !== 'object' ? location : '-'}
                >
                  {typeof location !== 'object' ? location : '-'}
                </Text>
                <div className="text-black font-light pr-2 text-xs">
                  <span className="overflow-hidden text-ellipsis">
                    {titleDate ? dayjs(titleDate).format(DATE_FORMAT) : <NoData type="na" />}
                  </span>
                </div>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'DATE',
        accessor: 'date',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { dueOn },
          },
        }) =>
          useMemo(
            () => <p>{dueOn ? dayjs(dueOn).format(DATE_FORMAT) : <NoData type="na" />}</p>,
            [],
          ),
      },
      {
        Header: 'QUANTITY',
        accessor: 'quantity',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { quantity },
          },
        }) => useMemo(() => <p className="w-[14%]">{quantity}</p>, []),
      },
      {
        Header: 'RATE',
        accessor: 'rate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { rate },
          },
        }) =>
          useMemo(
            () => <p className="pl-2">{rate ? toIndianCurrency(Number.parseInt(rate, 10)) : 0}</p>,
            [],
          ),
      },
      {
        Header: 'TOTAL AMOUNT',
        accessor: 'price',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { price },
          },
        }) =>
          useMemo(
            () => (
              <p className="pl-2">{price ? toIndianCurrency(Number.parseInt(price, 10)) : 0}</p>
            ),
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { itemId, name, location, titleDate, dueOn, quantity, rate, per, price },
          },
        }) =>
          useMemo(
            () => (
              <Menu shadow="md" width={140} withinPortal>
                <Menu.Target>
                  <ActionIcon className="py-0" onClick={e => e.preventDefault()}>
                    <MenuIcon />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    className="cursor-pointer flex items-center gap-1"
                    icon={<Edit2 className="h-4" />}
                    onClick={() =>
                      onClickAddItems({
                        name,
                        location,
                        titleDate,
                        dueOn,
                        quantity,
                        rate,
                        per,
                        price,
                        itemId,
                      })
                    }
                  >
                    <span className="ml-1">Edit</span>
                  </Menu.Item>

                  <Menu.Item
                    className="cursor-pointer flex items-center gap-1"
                    icon={<Trash2 className="h-4" />}
                    onClick={() => handleDeleteSpaceItem(itemId)}
                  >
                    <span className="ml-1">Delete</span>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ),
            [],
          ),
      },
    ],
    [addSpaceItem],
  );

  return (
    <div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Invoice To</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <TextInput
          className="w-full pb-4"
          styles={styles}
          label="Company Name"
          name="supplierName"
          withAsterisk
          errors={errors}
          placeholder="Write..."
          id="supplierName"
        />
        <div className="grid grid-cols-2 gap-4 pb-4">
          <NumberInput
            styles={styles}
            label="Voucher No"
            name="invoiceNo"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="invoiceNo"
          />
          <TextInput
            styles={styles}
            label="GSTIN"
            name="supplierGst"
            withAsterisk
            placeholder="Write..."
            id="supplierGst"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="supplierStreetAddress"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="supplierStreetAddress"
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="supplierCity"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="supplierCity"
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="supplierZip"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="supplierZip"
          />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Supplier</p>
      </div>
      <div className="pl-5 pr-7 pt-4 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Name"
            name="buyerName"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="buyerName"
          />
          <TextInput
            styles={styles}
            label="GSTIN"
            name="buyerGst"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="buyerGst"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Ref"
            name="supplierRefNo"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="supplierRefNo"
          />
          <TextInput
            styles={styles}
            label="Other Reference(s)"
            name="supplierOtherReference"
            errors={errors}
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Dispatch Through"
            name="dispatchThrough"
            errors={errors}
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Destination"
            name="destination"
            errors={errors}
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="buyerStreetAddress"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="buyerStreetAddress"
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="buyerCity"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="buyerCity"
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="buyerZip"
            withAsterisk
            errors={errors}
            placeholder="Write..."
            id="buyerZip"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Terms of Delivery"
            name="termOfDelivery"
            withAsterisk
            errors={errors}
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
            id="termOfDelivery"
          />
        </div>
      </div>
      <div className="pl-5 pr-7 py-4 mb-2">
        <Group position="apart" align="center" className="mb-4">
          <p className="font-bold text-2xl">Order Item Details</p>
          {!bookingIdFromFinance ? (
            <Button className="secondary-button" onClick={() => onClickAddItems()}>
              Add Items
            </Button>
          ) : null}
        </Group>
        {addSpaceItem?.length ? (
          <>
            <div className="border-dashed border-0 border-black border-b-2 pb-4">
              <Table
                COLUMNS={bookingIdFromFinance ? COLUMNS : manualEntryColumn}
                data={bookingIdFromFinance ? addSpaceItem : addSpaceItem}
                showPagination={false}
                classNameWrapper="min-h-[150px]"
              />
            </div>
            <div className="max-w-screen mt-3 flex flex-col justify-end mr-7 pr-16 text-lg">
              <div className="flex justify-end">
                <p className="text-lg font-bold">Amount:</p>
                <p className="text-lg ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              </div>
              <div className="flex justify-end">
                <p className="text-lg font-bold">GST 18%:</p>
                <p className="text-lg ml-2">{toIndianCurrency(totalPrice * 0.18) || 0}</p>
              </div>
              <div className="flex justify-end">
                <p className="text-lg font-bold">Total:</p>
                <p className="text-lg ml-2">
                  {toIndianCurrency(totalPrice + totalPrice * 0.18) || 0}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full min-h-[100px] flex justify-center items-center">
            <p className="text-xl">No records found</p>
          </div>
        )}
      </div>
      <div className="pl-5 pr-7 flex flex-col gap-4 pb-6 border-b">
        <TextInput
          styles={styles}
          label="Amount Chargeable (in words)"
          name="amountChargeable"
          placeholder="Write..."
          value={toWords.convert(Math.round(totalPrice + totalPrice * 0.18))}
          readOnly
          disabled
        />
      </div>
    </div>
  );
};

export default PurchaseOrder;
