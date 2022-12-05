import React, { useMemo } from 'react';
import { Image } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import Table from '../../Table/Table';
import data from './Data.json';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import image from '../../../assets/image.png';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFormContext } from '../../../context/formContext';

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

const ReleaseOrder = () => {
  const { errors, getInputProps } = useFormContext();

  const onHandleDrop = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    // const res = await upload(formData);
    // setFieldValue('photos', res?.[0].Location);
  };

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
            label="Release Order No"
            name="releaseOrderNumber"
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
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Quotation No"
            name="quotationNumber"
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Contact Person"
            name="contactPerson"
            placeholder="Write..."
          />
          <TextInput styles={styles} label="Phone" name="phone" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput styles={styles} label="Mobile" name="mobile" placeholder="Write..." />
          <TextInput styles={styles} label="Email" name="email" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="streetAddress"
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="city"
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="pin"
            placeholder="Write..."
          />
        </div>
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Supplier</p>
      </div>
      <div className="pl-5 pr-7 pt-4">
        <div className="grid grid-cols-2 gap-4 ">
          <TextInput
            styles={styles}
            label="Supplier Name"
            name="supplierName"
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Designation"
            name="designation"
            placeholder="Write..."
          />
        </div>
      </div>
      <div className="border-b">
        <p className="font-semibold text-lg pt-4 pl-5">Signature and Stamp</p>
        <div className="h-[180px] w-[350px] mt-4 ml-4 mb-6">
          <Dropzone
            onDrop={onHandleDrop}
            accept={['image/png', 'image/jpeg']}
            className="h-full w-full flex justify-center items-center bg-slate-100"
            //   loading={isLoading}
            name="signatureStampPhoto"
            multiple={false}
            {...getInputProps('signatureStampPhoto')}
          >
            <div className="flex items-center justify-center">
              <Image src={image} alt="placeholder" height={50} width={50} />
            </div>
            <p>
              Drag and Drop your files here,or{' '}
              <span className="text-purple-450 border-none">browse</span>
            </p>
          </Dropzone>
          {errors?.signatureStampPhoto ? (
            <p className="mt-1 text-xs text-red-450">{errors?.signatureStampPhoto}</p>
          ) : null}
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

      <div className="pl-5 pr-7 pt-4 border-b">
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Terms &amp; Conditions"
            name="termsAndConditions"
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
