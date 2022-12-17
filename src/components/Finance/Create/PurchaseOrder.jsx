import React, { useMemo } from 'react';
import { Badge, Box, Image, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useModals } from '@mantine/modals';
import Table from '../../Table/Table';
import data from './Data.json';
import TextareaInput from '../../shared/TextareaInput';
import TextInput from '../../shared/TextInput';
import image from '../../../assets/image.png';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFormContext } from '../../../context/formContext';
import NumberInput from '../../shared/NumberInput';
import { useUploadFile } from '../../../hooks/upload.hooks';
import modalConfig from '../../../utils/modalConfig';

const supportedType = ['JPG', 'JPEG', 'PNG'];

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

const PurchaseOrder = () => {
  const { errors, getInputProps, setFieldValue, values } = useFormContext();
  const { mutateAsync: upload, isLoading } = useUploadFile();
  const modals = useModals();
  const onHandleDrop = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);
    setFieldValue('signature', res?.[0].Location);
  };

  const toggleImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClick={id => modals.closeModal(id)}>
            {imgSrc ? (
              <Image src={imgSrc} height={580} width={580} alt="preview" fit="contain" />
            ) : (
              <Image src={null} height={580} width={580} withPlaceholder />
            )}
          </Box>
        ),
      },
      ...modalConfig,
    });

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

  // const COLUMNS = useMemo(
  //   () => [
  //     {
  //       Header: '#',
  //       accessor: 'id',
  //       disableSortBy: true,
  //       Cell: ({ row: { index } }) => index + 1,
  //     },
  //     {
  //       Header: 'SPACE NAME & PHOTO',
  //       accessor: 'basicInformation.spaceName',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { _id, basicInformation, isUnderMaintenance },
  //         },
  //       }) =>
  //         useMemo(
  //           () => (
  //             <div className="flex items-center gap-2 ">
  //               <Box
  //                 className="bg-white border rounded-md cursor-zoom-in"
  //                 onClick={() => toggleImagePreviewModal(basicInformation?.spacePhoto)}
  //               >
  //                 {basicInformation?.spacePhoto ? (
  //                   <Image src={basicInformation?.spacePhoto} alt="banner" height={32} width={32} />
  //                 ) : (
  //                   <Image src={null} withPlaceholder height={32} width={32} />
  //                 )}
  //               </Box>
  //               <Button
  //                 className="text-black font-medium px-2 max-w-[180px]"
  //                 // onClick={() => handleInventoryDetails(_id)}
  //               >
  //                 <span className="overflow-hidden text-ellipsis">
  //                   {basicInformation?.spaceName}
  //                 </span>
  //               </Button>
  //               <Badge
  //                 className="capitalize"
  //                 variant="filled"
  //                 color={isUnderMaintenance ? 'yellow' : 'green'}
  //               >
  //                 {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
  //               </Badge>
  //             </div>
  //           ),
  //           [],
  //         ),
  //     },
  //     {
  //       Header: 'MEDIA OWNER NAME',
  //       accessor: 'landlord',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { basicInformation },
  //         },
  //       }) =>
  //         useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || 'NA'}</p>, []),
  //     },
  //     {
  //       Header: 'PEER',
  //       accessor: 'peer',
  //       disableSortBy: true,
  //       Cell: () => useMemo(() => <p>-</p>),
  //     },
  //     {
  //       Header: 'SPACE TYPE',
  //       accessor: 'basicInformation.spaceType.name',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { basicInformation },
  //         },
  //       }) =>
  //         useMemo(() => {
  //           const colorType = Object.keys(colors).find(
  //             key => colors[key] === basicInformation?.spaceType?.name,
  //           );

  //           return (
  //             <Badge color={colorType} size="lg" className="capitalize">
  //               {basicInformation?.spaceType?.name || <span>-</span>}
  //             </Badge>
  //           );
  //         }),
  //     },
  //     {
  //       Header: 'DIMENSION',
  //       accessor: 'specifications.size.min',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { specifications },
  //         },
  //       }) =>
  //         useMemo(
  //           () => (
  //             <p>{`${specifications?.size?.height || 0}ft x ${
  //               specifications?.size?.width || 0
  //             }ft`}</p>
  //           ),
  //           [],
  //         ),
  //     },
  //     {
  //       Header: 'IMPRESSION',
  //       accessor: 'specifications.impressions.min',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { specifications },
  //         },
  //       }) => useMemo(() => <p>{`${specifications?.impressions?.min || 0}+`}</p>, []),
  //     },
  //     {
  //       Header: 'HEALTH STATUS',
  //       accessor: 'specifications.health',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { specifications },
  //         },
  //       }) =>
  //         useMemo(
  //           () => (
  //             <div className="w-24">
  //               <Progress
  //                 sections={[
  //                   { value: specifications?.health, color: 'green' },
  //                   { value: 100 - (specifications?.health || 0), color: 'red' },
  //                 ]}
  //               />
  //             </div>
  //           ),
  //           [],
  //         ),
  //     },
  //     {
  //       Header: 'LOCATION',
  //       accessor: 'location.city',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { location },
  //         },
  //       }) => useMemo(() => <p>{location?.city}</p>, []),
  //     },
  //     {
  //       Header: 'MEDIA TYPE',
  //       accessor: 'mediaType',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { basicInformation },
  //         },
  //       }) => useMemo(() => <p>{basicInformation?.mediaType?.name}</p>),
  //     },
  //     {
  //       Header: 'PRICING',
  //       accessor: 'basicInformation.price',
  //       disableSortBy: true,
  //       Cell: ({
  //         row: {
  //           original: { basicInformation },
  //         },
  //       }) =>
  //         useMemo(
  //           () => (
  //             <p className="pl-2">
  //               {basicInformation?.price
  //                 ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
  //                 : 0}
  //             </p>
  //           ),
  //           [],
  //         ),
  //     },
  //   ],
  //   [spacesList],
  // );

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
          errors={errors}
          placeholder="Write..."
        />
        <div className="grid grid-cols-2 gap-4 pb-4">
          <NumberInput
            styles={styles}
            label="Voucher No"
            name="invoiceNo"
            errors={errors}
            placeholder="Write..."
          />
          <TextInput styles={styles} label="GST" name="supplierGst" placeholder="Write..." />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <TextInput
            className="col-span-2"
            styles={styles}
            label="Street Address"
            name="supplierStreetAddress"
            errors={errors}
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="supplierCity"
            errors={errors}
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="supplierZip"
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
            errors={errors}
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="GST"
            name="buyerGst"
            errors={errors}
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <TextInput
            styles={styles}
            label="Supplier Ref"
            name="buyerRefNo" // TODO: should be buyerRefNo
            errors={errors}
            placeholder="Write..."
          />
          <TextInput
            styles={styles}
            label="Other Reference(s)"
            name="buyerOtherReference" // TODO: should be buyerOtherReference
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
            errors={errors}
            placeholder="Write..."
          />
          <TextInput
            className="col-span-1"
            styles={styles}
            label="City"
            name="buyerCity"
            errors={errors}
            placeholder="Write..."
          />
          <NumberInput
            className="col-span-1"
            styles={styles}
            label="Pin"
            name="buyerZip"
            errors={errors}
            placeholder="Write..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <TextareaInput
            label="Terms of delivery"
            name="termOfDelivery"
            errors={errors}
            styles={styles}
            maxLength={200}
            placeholder="Maximum 200 characters"
            className="mb-7"
          />
        </div>
      </div>
      {/* <div className="pl-5 pr-7 py-4 mb-2">
        <p className="font-bold text-2xl mb-4">Order Item Details</p>
        {spacesList.length ? (
          <>
            <div className="border-dashed border-0 border-black border-b-2 pb-4">
              <Table COLUMNS={COLUMNS} data={spacesList || []} showPagination={false} />
            </div>
            <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16 text-lg">
              <p>Total Price: </p>
              <p>100000</p>
            </div>
          </>
        ) : null}
      </div> */}
      <div className="pl-5 pr-7 py-4 mb-2">
        <p className="font-bold text-2xl mb-4">Order Item Details</p>
        <div className="border-dashed border-0 border-black border-b-2 pb-4">
          <Table COLUMNS={COLUMNS} data={data} showPagination={false} className="min-h-[100px]" />
        </div>
        <div className="max-w-screen mt-3 flex justify-end mr-7 pr-16 text-lg">
          <p>Total Price: </p>
          <p>100000</p>
        </div>
      </div>
      <div className="pl-5 pr-7 flex flex-col gap-4 pb-6 border-b">
        <TextInput
          styles={styles}
          label="Amount Chargeable (in words)"
          name="amountChargeable"
          placeholder="Write..."
          readOnly
          disabled
        />
      </div>
      <div className="flex justify-between pl-5 pr-7 items-center">
        <p className="font-bold text-2xl pt-4">Authorized Signatory</p>
      </div>
      <div className="border-b">
        <p className="font-semibold text-lg pt-4 pl-5 mb-2">Signature and Stamp</p>
        <div className="pl-5 mb-3">
          {supportedType.map(item => (
            <Badge key={item} className="mr-2">
              {item}
            </Badge>
          ))}
        </div>
        <div className="flex items-start">
          <div className="h-[180px] w-[350px] mx-4 mb-6">
            <Dropzone
              onDrop={onHandleDrop}
              accept={['image/png', 'image/jpeg', 'image/jpg']}
              className="h-full w-full flex justify-center items-center bg-slate-100"
              loading={isLoading}
              name="signature"
              multiple={false}
              {...getInputProps('signature')}
            >
              <div className="flex items-center justify-center">
                <Image src={image} alt="placeholder" height={50} width={50} />
              </div>
              <p>
                Drag and Drop your files here,or{' '}
                <span className="text-purple-450 border-none">browse</span>
              </p>
            </Dropzone>
            {errors?.signature ? (
              <p className="mt-1 text-xs text-red-450">{errors?.signature}</p>
            ) : null}
          </div>
          <Box
            className="bg-white border rounded-md cursor-zoom-in"
            onClick={() => toggleImagePreviewModal(values?.signature)}
          >
            {values?.signature ? (
              <Image
                src={values?.signature}
                alt="signature-preview"
                height={180}
                width={350}
                className="bg-slate-100"
                fit="contain"
                placeholder={
                  <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                }
              />
            ) : null}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;