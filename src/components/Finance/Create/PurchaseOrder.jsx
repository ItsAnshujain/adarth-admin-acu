import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ToWords } from 'to-words';
import { DatePicker } from '@mantine/dates';
import Table from '../../Table/Table';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFormContext } from '../../../context/formContext';
import NumberInput from '../../shared/NumberInput';
import NoData from '../../shared/NoData';
import { useStyles } from '../../DateRange';

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

const PurchaseOrder = ({ spacesList, totalPrice }) => {
  const { classes, cx } = useStyles();
  const { errors, setFieldValue, values } = useFormContext();
  const toWords = new ToWords();
  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const updateData = (key, val, id) => {
    setUpdatedInventoryData(prev =>
      prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );

    setFieldValue(
      'spaces',
      values.spaces.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );
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
                <div className="text-black font-medium px-2">
                  <span className="overflow-hidden text-ellipsis">
                    {basicInformation?.spaceName}
                  </span>
                </div>
                <div className="text-black font-light px-2 text-sm">
                  <span className="overflow-hidden text-ellipsis">{location?.address}</span>
                </div>
                <div className="text-black font-light px-2 text-xs">
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
                defaultValue={dueOn}
                placeholder="DD/MM/YYYY"
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
        Cell: ({
          row: {
            original: { per, _id },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                hideControls
                defaultValue={+(per || 1)}
                onBlur={e => updateData('per', e.target.value, _id)}
              />
            ),
            [],
          ),
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
    [updatedInventoryData],
  );

  useEffect(() => {
    if (spacesList) {
      setUpdatedInventoryData(spacesList);
      setFieldValue('spaces', spacesList);
    }
  }, [spacesList]);

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
        />
        <div className="grid grid-cols-2 gap-4 pb-4">
          <NumberInput
            styles={styles}
            label="Voucher No"
            name="invoiceNo"
            withAsterisk
            errors={errors}
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="GST"
            name="supplierGst"
            withAsterisk
            placeholder="Write..."
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
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="supplierCity"
            withAsterisk
            errors={errors}
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="supplierZip"
            withAsterisk
            errors={errors}
            placeholder="Write..."
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
          />
          <TextInput
            styles={styles}
            label="GST"
            name="buyerGst"
            withAsterisk
            errors={errors}
            placeholder="Write..."
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
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="buyerCity"
            withAsterisk
            errors={errors}
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="buyerZip"
            withAsterisk
            errors={errors}
            placeholder="Write..."
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
          />
        </div>
      </div>
      <div className="pl-5 pr-7 py-4 mb-2">
        <p className="font-bold text-2xl mb-4">Order Item Details</p>
        {updatedInventoryData?.length ? (
          <>
            <div className="border-dashed border-0 border-black border-b-2 pb-4">
              <Table COLUMNS={COLUMNS} data={updatedInventoryData || []} showPagination={false} />
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
    </div>
  );
};

export default PurchaseOrder;
