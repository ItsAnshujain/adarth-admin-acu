import React, { useMemo } from 'react';
import Table from '../../Table/Table';
import data from './Data.json';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import toIndianCurrency from '../../../utils/currencyFormat';

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

const Invoice = () => {
  const COLUMNS = [
    {
      Header: '#',
      accessor: 'id',
    },
    {
      Header: 'DESCRIPTION OF GOODS AND SERVICE',
      accessor: 'description_of_goods_and_services',
      Cell: () =>
        useMemo(() => (
          <div className="w-fit">
            <p>Hoarding Rent</p>
            <p className="text-xs">At Lal Ganesh 30ft x 20ft</p>
            <p className="text-xs">20th March to 19 April 2022</p>
          </div>
        )),
    },
    {
      Header: 'DATE',
      accessor: 'date',
      Cell: () => useMemo(() => <div className="w-fit">2 Sep,2022</div>, []),
    },
    {
      Header: 'QUANTITY',
      accessor: 'quantity',
      Cell: () => useMemo(() => <div className="w-[14%]">2</div>, []),
    },
    {
      Header: 'RATE',
      accessor: 'rate',
      Cell: () => useMemo(() => <div className="w-[14%]">41.67</div>, []),
    },
    {
      Header: 'PER',
      accessor: 'per',
      Cell: () => useMemo(() => <div className="w-[14%]">41.SQF</div>, []),
    },
    {
      Header: 'PRICING',
      accessor: 'pricing',
      Cell: () => useMemo(() => <div className="w-[14%]">{toIndianCurrency(29834)}</div>, []),
    },
  ];

  return (
    <div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            styles={styles}
            label="Invoice No"
            name="invoiceNumber"
            placeholder="Write..."
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
          <TextInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="supplierPin"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Contact"
            name="supplierContact"
            placeholder="Write..."
          />
          <TextInput styles={styles} label="Email" name="supplierEmail" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Ref"
            name="supplierRef"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Other Reference(s)"
            name="otherReference"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextInput styles={styles} label="Website" name="website" placeholder="Write..." />
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
            name="contactPerson"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Contact" name="buyerContact" placeholder="Write..." />
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
          <TextInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="buyerPin"
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
            name="dispatchedDocNumber"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Dispatched through"
            name="dispatchedThrough"
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
            name="termsOfDelivery"
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
          />
        </div>
      </div>
      <div className="pl-5 pr-7 py-4 mb-10 ">
        <p className="font-bold text-2xl mb-4">Order Item Details</p>
        <div className="border-dashed border-0 border-black border-b-2 pb-4">
          <Table COLUMNS={COLUMNS} data={data} showPagination={false} className="min-h-[100px]" />
        </div>
      </div>
      <div className="pl-5 pr-7 flex flex-col gap-4 pb-6 border-b">
        <TextInput
          styles={styles}
          label="Amount Chargeable (in words)"
          name="amountChargeable"
          placeholder="Write..."
        />
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Company&apos;s Bank Details</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-4 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Bank Name" name="bankName" placeholder="Write..." />
          <TextInput styles={styles} label="A/c No." name="acNumber" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Branch &amp; IFSC Code"
            name="branchIfscCode"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Mode/Terms of Payment"
            name="modeTermOfPayment"
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
