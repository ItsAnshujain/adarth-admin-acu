import React from 'react';
import { ToWords } from 'to-words';
import toIndianCurrency from '../../../utils/currencyFormat';

const InvoicePreview = ({ previewData, previewSpaces = [], totalPrice }) => {
  const toWords = new ToWords();

  return (
    <div className="px-5">
      <div className="max-h-[500px] overflow-y-auto">
        <section className="my-3 p-5 bg-gray-100 grid grid-cols-2 gap-x-5">
          <p className="text-lg mb-1">
            <span className="font-bold">Invoice No:</span> {previewData?.invoiceNo}
          </p>
        </section>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Supplier:</h2>
          <section className="p-5 bg-gray-100">
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Supplier Name:</span> {previewData?.supplierName}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">GSTIN/UIN:</span> {previewData?.supplierGst}
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
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Contact:</span> {previewData?.supplierPhone}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Email:</span> {previewData?.supplierEmail}
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
            <p className="text-lg mb-1">
              <span className="font-bold">Website:</span> {previewData?.supplierWebsite}
            </p>
          </section>
        </article>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Buyer Details:</h2>
          <section className="p-5 bg-gray-100">
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Buyer Name:</span> {previewData?.buyerName}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Contact Person:</span> {previewData?.buyerContactPerson}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Contact:</span> {previewData?.buyerPhone}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">GSTIN/UIN:</span> {previewData?.buyerGst}
              </p>
            </div>
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
            <p className="text-lg mb-1">
              <span className="font-bold">Buyer&apos;s Order No.:</span>{' '}
              {previewData?.buyerOrderNumber}
            </p>
            <p className="text-lg mb-1">
              <span className="font-bold">Dispatched Document No.:</span>{' '}
              {previewData?.dispatchDocumentNumber}
            </p>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Dispatched through:</span>{' '}
                {previewData?.dispatchThrough}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Destination:</span> {previewData?.destination}
              </p>
            </div>
            <p className="text-lg mb-1">
              <span className="font-bold">Delivery Note:</span> {previewData?.deliveryNote}
            </p>
            <p className="text-lg mb-1">
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

        <article className="my-3 p-5 bg-gray-100 flex mb-1">
          <p className="text-lg font-bold">Amount Chargeable (in words):</p>
          <p className="text-lg ml-2">{(totalPrice && toWords.convert(totalPrice)) || 0}</p>
        </article>

        <article className="my-3">
          <h2 className="font-medium capitalize text-xl mb-2">Company&apos;s Bank Details:</h2>
          <section className="p-5 bg-gray-100">
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Bank Name:</span> {previewData?.bankName}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">A/c No.:</span> {previewData?.accountNo}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <p className="text-lg mb-1">
                <span className="font-bold">Branch & IFSC Code:</span> {previewData?.ifscCode}
              </p>
              <p className="text-lg mb-1">
                <span className="font-bold">Mode/Terms of Payment:</span>{' '}
                {previewData?.modeOfPayment}
              </p>
            </div>
            <p className="text-lg mb-1">
              <span className="font-bold">Declaration:</span> {previewData?.declaration}
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default InvoicePreview;
