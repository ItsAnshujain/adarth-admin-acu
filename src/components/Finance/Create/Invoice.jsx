import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ToWords } from 'to-words';
import Table from '../../Table/Table';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import toIndianCurrency from '../../../utils/currencyFormat';
import NumberInput from '../../shared/NumberInput';
import NoData from '../../shared/NoData';

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

const Invoice = ({ spacesList, totalPrice }) => {
  const toWords = new ToWords();

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
    [spacesList],
  );

  return (
    <div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput styles={styles} label="Invoice No" name="invoiceNo" placeholder="Write..." />
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
            placeholder="Write..."
          />
          <TextInput styles={styles} label="GSTIN/UIN" name="supplierGst" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="supplierStreetAddress"
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="supplierCity"
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="supplierZip"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Contact" name="supplierPhone" placeholder="Write..." />
          <TextInput styles={styles} label="Email" name="supplierEmail" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Ref"
            name="supplierRefNo"
            placeholder="Write..."
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
          <TextInput styles={styles} label="Buyer Name" name="buyerName" placeholder="Write..." />
          <TextInput
            styles={styles}
            label="Contact Person"
            name="buyerContactPerson"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Contact" name="buyerPhone" placeholder="Write..." />
          <TextInput styles={styles} label="GSTIN/UIN" name="buyerGst" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="buyerStreetAddress"
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="buyerCity"
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="buyerZip"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Buyer's Order No."
            name="buyerOrderNumber"
            placeholder="Write..."
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
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
          />
        </div>
      </div>
      <div className="pl-5 pr-7 py-4 mb-2">
        <p className="font-bold text-2xl mb-4">Order Item Details</p>
        {spacesList?.length ? (
          <>
            <div className="border-dashed border-0 border-black border-b-2 pb-4">
              <Table COLUMNS={COLUMNS} data={spacesList || []} showPagination={false} />
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
          <TextInput styles={styles} label="Bank Name" name="bankName" placeholder="Write..." />
          <TextInput styles={styles} label="A/c No." name="accountNo" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Branch &amp; IFSC Code"
            name="ifscCode"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Mode/Terms of Payment"
            name="modeOfPayment"
            placeholder="Write..."
          />
        </div>
      </div>
      <div className="pl-5 pr-7 pt-4 border-b">
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Declaration"
            name="declaration"
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

export default Invoice;
