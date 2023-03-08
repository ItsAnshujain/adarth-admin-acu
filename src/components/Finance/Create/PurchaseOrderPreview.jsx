import React from 'react';
import { ToWords } from 'to-words';
import toIndianCurrency from '../../../utils/currencyFormat';

const PurchaseOrderPreview = ({ previewData, previewSpaces = [], totalPrice, type }) => {
  const toWords = new ToWords();

  return (
    <div className="px-5">
      <h1>Booking Name</h1>
      <h2 className="font-medium capitalize text-lg underline">{type} order:</h2>

      <div className="max-h-[500px] overflow-y-auto">
        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Invoice To:</h2>
          <section className="p-5 bg-gray-100">
            <p className="text-lg mb-1">
              <span className="font-bold">Company Name:</span> {previewData?.supplierName}
            </p>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Voucher No:</span> {previewData?.invoiceNo}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">GST:</span> {previewData?.supplierGst}
              </p>
            </div>
            <p className="text-lg mb-1">
              <span className="font-bold">Street Address:</span>{' '}
              {previewData?.supplierStreetAddress}
            </p>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">City:</span> {previewData?.supplierCity}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Pin:</span> {previewData?.supplierZip}
              </p>
            </div>
          </section>
        </article>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Supplier:</h2>
          <section className="p-5 bg-gray-100">
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Supplier Name:</span> {previewData?.buyerName}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">GST:</span> {previewData?.buyerGst}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Supplier Ref:</span> {previewData?.supplierRefNo}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Other Reference(s):</span>{' '}
                {previewData?.supplierOtherReference}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Dispatch Through:</span> {previewData?.dispatchThrough}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Destination:</span> {previewData?.destination}
              </p>
            </div>
            <div>
              <p className="text-lg mb-1">
                <span className="font-bold">Street Address:</span> {previewData?.buyerStreetAddress}
              </p>
              <div className="grid grid-cols-2 gap-x-5">
                <p className="text-lg mb-1">
                  <span className="font-bold">City:</span> {previewData?.buyerCity}
                </p>
                <p className="text-lg mb-1">
                  <span className="font-bold">Pin:</span> {previewData?.buyerZip}
                </p>
              </div>
            </div>
            <p className="text-lg">
              <span className="font-bold">Terms of Delivery:</span> {previewData?.termOfDelivery}
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
          </section>
        </article>
      </div>
    </div>
  );
};

export default PurchaseOrderPreview;
