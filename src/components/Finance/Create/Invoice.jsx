import React, { useMemo } from 'react';
import { Button } from '@mantine/core';
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
          <TextInput styles={styles} label="Invoice No" placeholder="Write..." />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Supplier</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Supplier Name" placeholder="Write..." />
          <TextInput styles={styles} label="GSTIN/UIN" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            placeholder="Write..."
          />
          <TextInput className="col-span-1" styles={styles} label="City" placeholder="Write..." />
          <TextInput className="col-span-1" styles={styles} label="Pin" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Contact" placeholder="Write..." />
          <TextInput styles={styles} label="Email" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Supplier Ref" placeholder="Write..." />
          <TextInput styles={styles} label="Other Reference(s)" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextInput styles={styles} label="Website" placeholder="Write..." />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Buyer Details</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Buyer Name" placeholder="Write..." />
          <TextInput styles={styles} label="Contact Person" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Contact" placeholder="Write..." />
          <TextInput styles={styles} label="GSTIN/UIN" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            placeholder="Write..."
          />
          <TextInput className="col-span-1" styles={styles} label="City" placeholder="Write..." />
          <TextInput className="col-span-1" styles={styles} label="Pin" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextInput styles={styles} label="Buyer&amp;s Order No." placeholder="Write..." />
        </div>
        <div className="grid grid-cols-3 gap-4 pb-4">
          <TextInput styles={styles} label="Despatched Document No." placeholder="Write..." />
          <TextInput styles={styles} label="Despatched through" placeholder="Write..." />
          <TextInput styles={styles} label="Destination" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-1 gap-4 pb-4">
          <TextareaInput
            label="Delivery Note"
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Terms of Delivery"
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
        <TextInput styles={styles} label="Amount Chargeable (in words)" placeholder="Write..." />
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Company&apos;s Bank Details</p>
      </div>
      <div className="pl-5 pr-7 pt-4 pb-4 border-b">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Bank Name" placeholder="Write..." />
          <TextInput styles={styles} label="A/c No." placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Branch &amp; IFSC Code" placeholder="Write..." />
          <TextInput styles={styles} label="Mode/Terms of Payment" placeholder="Write..." />
        </div>
      </div>
      <div className="pl-5 pr-7 pt-4">
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Declaration"
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
          />
        </div>
      </div>
      <div className="flex justify-end pr-7 gap-3 pt-4">
        <Button variant="outline" className="border rounded-md p-2 text-black">
          Cancel
        </Button>
        <Button className="border rounded-md p-2 bg-purple-450 text-white">Create</Button>
      </div>
    </div>
  );
};

export default Invoice;
