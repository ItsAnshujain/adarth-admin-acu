import { Group, Text } from '@mantine/core';
import React from 'react';
import { ToWords } from 'to-words';
import { v4 as uuidv4 } from 'uuid';
import toIndianCurrency from '../../../../utils/currencyFormat';

const PurchaseOrderPreview = ({ previewData, previewSpaces = [], totalPrice, hasBookingId }) => {
  const toWords = new ToWords();

  return (
    <div className="px-5">
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
            {hasBookingId
              ? previewSpaces.map((item, index) => (
                  <div className="grid grid-cols-2" key={item?._id}>
                    <Group>
                      <p className="text-lg">{index + 1}</p>
                      <Text
                        className="overflow-hidden text-ellipsis max-w-[280px]"
                        lineClamp={1}
                        title={item?.basicInformation?.spaceName}
                      >
                        {item?.basicInformation?.spaceName}
                      </Text>
                    </Group>
                    <Group className="grid grid-cols-4">
                      <div>
                        <p>Quantity:</p>
                        <p>{item?.quantity ?? 1}</p>
                      </div>
                      <div>
                        <p>Unit:</p>
                        <p>{item?.unit ?? 1}</p>
                      </div>
                      <div>
                        <p>Rate:</p>
                        <p>{item?.campaignPrice}</p>
                      </div>
                      <div>
                        <p>Total Amount:</p>
                        <p>{+(item.quantity || 1) * item.campaignPrice}</p>
                      </div>
                    </Group>
                  </div>
                ))
              : previewData?.spaces?.map((item, index) => (
                  <div className="grid grid-cols-2" key={uuidv4()}>
                    <Group>
                      <p className="text-lg">{index + 1}</p>
                      <div>
                        <Text
                          className="overflow-hidden text-ellipsis max-w-[280px]"
                          lineClamp={1}
                          title={item?.name}
                        >
                          {item?.name}
                        </Text>
                        <Text
                          className="overflow-hidden text-ellipsis max-w-[180px]"
                          lineClamp={1}
                          title={item?.location}
                        >
                          {item?.location}
                        </Text>
                      </div>
                    </Group>
                    <Group className="grid grid-cols-3">
                      <div>
                        <p>Quantity:</p>
                        <p>{item?.quantity}</p>
                      </div>
                      <div>
                        <p>Rate:</p>
                        <p>{item?.rate}</p>
                      </div>
                      <div>
                        <p>Total Amount:</p>
                        <p>{item?.price}</p>
                      </div>
                    </Group>
                  </div>
                ))}
            <div className="flex justify-end">
              <p className="text-lg font-bold">Amount:</p>
              <p className="text-lg ml-2">{toIndianCurrency(totalPrice) || 0}</p>
            </div>
            <div className="flex justify-end">
              <p className="text-lg font-bold">GST 18%:</p>
              <p className="text-lg ml-2">{toIndianCurrency(totalPrice * 0.18) || 0}</p>
            </div>
            <div className="flex justify-end">
              <p className="text-lg font-bold">Total:</p>
              <p className="text-lg ml-2">
                {toIndianCurrency(totalPrice + totalPrice * 0.18) || 0}
              </p>
            </div>
          </section>
        </article>

        <article className="my-3">
          <section className="p-5 bg-gray-100">
            <div className="flex mb-1">
              <p className="text-lg font-bold">Amount Chargeable (in words):</p>
              <p className="text-lg ml-2">
                {(totalPrice && toWords.convert(Math.round(totalPrice + totalPrice * 0.18))) || 0}
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default PurchaseOrderPreview;
