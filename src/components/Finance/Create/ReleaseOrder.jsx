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
  input: {
    borderRadius: 0,
    padding: 8,
  },
};

const ReleaseOrder = ({
  totalPrice,
  onClickAddItems = () => {},
  bookingIdFromFinance,
  addSpaceItem,
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
        Header: 'City',
        accessor: 'city',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { city },
          },
        }) =>
          useMemo(
            () => (
              <Text
                className="overflow-hidden text-ellipsis max-w-[180px]"
                lineClamp={1}
                title={city}
              >
                {city}
              </Text>
            ),
            [],
          ),
      },
      {
        Header: 'Location',
        accessor: 'location',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { location },
          },
        }) =>
          useMemo(
            () => (
              <Text
                className="overflow-hidden text-ellipsis max-w-[180px]"
                lineClamp={1}
                title={location}
              >
                {location}
              </Text>
            ),
            [],
          ),
      },
      {
        Header: 'Media',
        accessor: 'media',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { media },
          },
        }) =>
          useMemo(
            () => (
              <Text
                className="overflow-hidden text-ellipsis max-w-[180px]"
                lineClamp={1}
                title={media}
              >
                {media}
              </Text>
            ),
            [],
          ),
      },
      {
        Header: 'Width',
        accessor: 'width',
        disableSortBy: true,
      },
      {
        Header: 'Height',
        accessor: 'height',
        disableSortBy: true,
      },
      {
        Header: 'Area',
        accessor: 'area',
        disableSortBy: true,
      },
      {
        Header: 'Total Display Cost/Month',
        accessor: 'displayCost',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { displayCost },
          },
        }) => useMemo(() => <p>{displayCost}</p>, []),
      },
      {
        Header: 'Printing Cost',
        accessor: 'printingCost',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { printingCost },
          },
        }) => useMemo(() => <p>{printingCost}</p>, []),
      },
      {
        Header: 'Mounting Cost',
        accessor: 'mountingCost',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { mountingCost },
          },
        }) => useMemo(() => <p>{mountingCost}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: {
              area,
              city,
              displayCost,
              height,
              itemId,
              location,
              media,
              mountingCost,
              printingCost,
              width,
            },
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
                        area,
                        city,
                        displayCost,
                        height,
                        itemId,
                        location,
                        media,
                        mountingCost,
                        printingCost,
                        width,
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
            label="Release Order No"
            name="releaseOrderNo"
            withAsterisk
            placeholder="Write..."
          />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">To</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Company Name"
            name="companyName"
            withAsterisk
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Quotation No"
            name="quotationNo"
            withAsterisk
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Contact Person"
            name="contactPerson"
            withAsterisk
            placeholder="Write..."
          />
          <TextInput styles={styles} label="Phone" name="phone" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Mobile"
            name="mobile"
            withAsterisk
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Email"
            name="email"
            withAsterisk
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="streetAddress"
            withAsterisk
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="city"
            withAsterisk
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="zip"
            withAsterisk
            placeholder="Write..."
          />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center ">
        <p className="font-bold text-2xl pt-4">Supplier</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-6 border-b">
        <div className="grid grid-cols-2 gap-4 ">
          <TextInput
            styles={styles}
            label="Supplier Name"
            name="supplierName"
            withAsterisk
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Designation"
            withAsterisk
            name="supplierDesignation"
            placeholder="Write..."
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
              />
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              {/* TODO: wip */}
              <p>Total Price: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              <p>Discount: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              <p>Sub Total: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              <p>GST 18%: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              <p>Total: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              <p>For 3 months: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16">
              <p>Grand Total: </p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
              <p className="ml-2">{toIndianCurrency(totalPrice) || 0}</p>
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

      <div className="pl-5 pr-7 pt-4 border-b">
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Terms &amp; Conditions"
            name="termsAndCondition"
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
          />
        </div>
      </div>
    </div>
  );
};

export default ReleaseOrder;
