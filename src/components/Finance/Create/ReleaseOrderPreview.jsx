import React from 'react';
import { ToWords } from 'to-words';
import toIndianCurrency from '../../../utils/currencyFormat';

const ReleaseOrderPreview = ({ previewData, previewSpaces = [], totalPrice, type }) => {
  const toWords = new ToWords();

  return (
    <div className="px-5">
      <h2 className="font-medium capitalize text-lg underline">{type} order:</h2>

      <div className="max-h-[500px] overflow-y-auto">
        <section className="my-3 p-5 bg-gray-100 grid grid-cols-2 gap-x-5">
          <p className="text-lg mb-1">
            <span className="font-bold">Release Order No:</span> {previewData?.releaseOrderNo}
          </p>
        </section>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">To:</h2>
          <section className="p-5 bg-gray-100">
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Company Name:</span> {previewData?.companyName}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Quotation No:</span> {previewData?.quotationNo}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Contact Person:</span> {previewData?.contactPerson}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Phone:</span> {previewData?.phone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Mobile:</span> {previewData?.mobile}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Email:</span> {previewData?.email}
              </p>
            </div>
            <p className="text-lg mb-1">
              <span className="font-bold">Street Address:</span> {previewData?.streetAddress}
            </p>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">City:</span> {previewData?.city}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Pin:</span> {previewData?.zip}
              </p>
            </div>
          </section>
        </article>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Supplier:</h2>
          <section className="p-5 bg-gray-100 grid grid-cols-2 gap-x-5">
            <p className="text-lg mb-1">
              <span className="font-bold">Supplier Name:</span> {previewData?.supplierName}
            </p>
            <p className="text-lg mb-1">
              <span className="font-bold">Designation:</span> {previewData?.supplierDesignation}
            </p>
          </section>
        </article>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Description of Services:</h2>
          <section className="p-5 bg-gray-100">
            {previewSpaces.map((item, index) => (
              <div className="flex" key={item?._id}>
                <p className="text-lg min-w-[30px]">{index + 1}</p>
                <p className="text-lg">{item?.basicInformation?.spaceName}</p>
              </div>
            ))}
            <div className="flex justify-end">
              <p className="text-lg font-bold">Total Price:</p>
              <p className="text-lg ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
          </section>
        </article>

        <article className="my-3">
          <section className="p-5 bg-gray-100">
            <div className="flex mb-1">
              <p className="text-lg font-bold">Amount Chargeable (in words):</p>
              <p className="text-lg ml-2">{(totalPrice && toWords.convert(totalPrice)) || 0}</p>
            </div>
            <p className="text-lg">
              <span className="font-bold">Terms & Conditions:</span>{' '}
              {previewData?.termsAndCondition}
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ReleaseOrderPreview;
