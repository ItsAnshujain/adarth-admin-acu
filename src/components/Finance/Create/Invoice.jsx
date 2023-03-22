import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ToWords } from 'to-words';
import { ActionIcon, Button, Group, Menu, Text } from '@mantine/core';
import { Edit2, Trash2 } from 'react-feather';
import Table from '../../Table/Table';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import toIndianCurrency from '../../../utils/currencyFormat';
import NumberInput from '../../shared/NumberInput';
import NoData from '../../shared/NoData';
import MenuIcon from '../../Menu';

const DATE_FORMAT = 'DD MMM YYYY';

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
};

const Invoice = ({
  totalPrice,
  onClickAddItems = () => {},
  bookingIdFromFinance,
  addSpaceItem = [],
  setAddSpaceItem = () => {},
}) => {
  const toWords = new ToWords();

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
            original: { startDate },
          },
        }) =>
          useMemo(
            () => (
              <div className="w-fit">
                {startDate ? dayjs(startDate).format(DATE_FORMAT) : <NoData type="na" />}
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'QUANTITY',
        accessor: 'quantity',
        disableSortBy: true,
        Cell: () => useMemo(() => <p className="w-[14%]">1</p>, []),
      },
      {
        Header: 'RATE',
        accessor: 'rate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p className="pl-2">
                {basicInformation?.price
                  ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                  : 0}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'PER',
        accessor: 'per',
        disableSortBy: true,
        Cell: () => useMemo(() => <p className="w-[14%]">1</p>, []),
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p className="pl-2">
                {basicInformation?.price
                  ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                  : 0}
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
        Header: 'PER',
        accessor: 'per',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { per },
          },
        }) => useMemo(() => <p className="w-[14%]">{per}</p>, []),
      },
      {
        Header: 'PRICING',
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
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            styles={styles}
            label="Invoice No"
            name="invoiceNo"
            withAsterisk
            placeholder="Write..."
            id="invoiceNo"
          />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Supplier</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Name"
            name="supplierName"
            withAsterisk
            placeholder="Write..."
            id="supplierName"
          />
          <TextInput
            styles={styles}
            label="GSTIN/UIN"
            name="supplierGst"
            withAsterisk
            placeholder="Write..."
            id="supplierGst"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            withAsterisk
            name="supplierStreetAddress"
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="supplierCity"
            withAsterisk
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="supplierZip"
            withAsterisk
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Contact"
            name="supplierPhone"
            withAsterisk
            placeholder="Write..."
            id="supplierPhone"
          />
          <TextInput
            styles={styles}
            label="Email"
            name="supplierEmail"
            withAsterisk
            placeholder="Write..."
            id="supplierEmail"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Ref"
            name="supplierRefNo"
            withAsterisk
            placeholder="Write..."
            id="supplierRefNo"
          />
          <TextInput
            styles={styles}
            label="Other Reference(s)"
            name="supplierOtherReference"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Website"
            name="supplierWebsite"
            placeholder="Write..."
          />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Buyer Details</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Buyer Name"
            name="buyerName"
            withAsterisk
            placeholder="Write..."
            id="buyerName"
          />
          <TextInput
            styles={styles}
            label="Contact Person"
            name="buyerContactPerson"
            withAsterisk
            placeholder="Write..."
            id="buyerContactPerson"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Contact"
            name="buyerPhone"
            withAsterisk
            placeholder="Write..."
            id="buyerPhone"
          />
          <TextInput
            styles={styles}
            label="GSTIN/UIN"
            name="buyerGst"
            withAsterisk
            placeholder="Write..."
            id="buyerGst"
          />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="buyerStreetAddress"
            withAsterisk
            placeholder="Write..."
            id="buyerStreetAddress"
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="buyerCity"
            withAsterisk
            placeholder="Write..."
            id="buyerCity"
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="buyerZip"
            withAsterisk
            placeholder="Write..."
            id="buyerZip"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Buyer's Order No."
            name="buyerOrderNumber"
            withAsterisk
            placeholder="Write..."
            id="buyerOrderNumber"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Dispatched Document No."
            name="dispatchDocumentNumber"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Dispatched through"
            name="dispatchThrough"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Destination"
            name="destination"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextareaInput
            label="Delivery Note"
            name="deliveryNote"
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Terms of Delivery"
            name="termOfDelivery"
            withAsterisk
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
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
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16 text-lg">
              <p>Total Price: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
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
          value={toWords.convert(totalPrice)}
          readOnly
          disabled
        />
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Company&apos;s Bank Details</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-4 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Bank Name"
            name="bankName"
            withAsterisk
            placeholder="Write..."
            id="bankName"
          />
          <TextInput
            styles={styles}
            label="A/c No."
            name="accountNo"
            withAsterisk
            placeholder="Write..."
            id="accountNo"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Branch &amp; IFSC Code"
            name="ifscCode"
            withAsterisk
            placeholder="Write..."
            id="ifscCode"
          />
          <TextInput
            styles={styles}
            label="Mode/Terms of Payment"
            name="modeOfPayment"
            withAsterisk
            placeholder="Write..."
            id="modeOfPayment"
          />
        </div>
      </div>
      <div className="pl-5 pr-7 pt-4 border-b">
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Declaration"
            name="declaration"
            withAsterisk
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
            id="declaration"
          />
        </div>
      </div>
    </div>
  );
};

export default Invoice;
