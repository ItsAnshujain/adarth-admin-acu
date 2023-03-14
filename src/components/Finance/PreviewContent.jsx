import { Button, Loader } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useFetchFinanceByYearAndMonth, useUpdateFinanceById } from '../../hooks/finance.hooks';
import { downloadPdf, serialize } from '../../utils';

const DATE_FORMAT = 'DD MMM, YYYY';

const PurchseSection = ({ financeData }) => (
  <>
    <div className="flex justify-end">
      <Button className="secondary-button mr-3" onClick={() => downloadPdf(financeData?.[0]?.file)}>
        Download File
      </Button>
    </div>
    <p className="font-medium">
      Order Id: <span className="text-gray-600">{financeData?.[0]?.bookingId}</span>
    </p>
    <p className="font-medium">
      Voucher No: <span className="text-gray-600">{financeData?.[0]?.invoiceNo}</span>
    </p>
    <p className="font-medium">
      Invoice To: <span className="text-gray-600">{financeData?.[0]?.buyerName}</span>
    </p>
    <p className="font-medium">
      Supplier: <span className="text-gray-600">{financeData?.[0]?.supplierName}</span>
    </p>
    <p className="font-medium">
      Date:{' '}
      <span className="text-gray-600">
        {financeData?.[0]?.createdAt ? dayjs(financeData[0].createdAt).format(DATE_FORMAT) : '-'}
      </span>
    </p>
    <p className="font-medium">
      Total Amount: <span className="text-gray-600">{financeData?.[0]?.total}</span>
    </p>
    <p className="font-medium">
      Payment Method:{' '}
      <span className="text-gray-600 uppercase">{financeData?.[0]?.paymentType}</span>
    </p>
  </>
);

const ReleaseSection = ({ financeData }) => (
  <>
    <div className="flex justify-end">
      <Button className="secondary-button mr-3" onClick={() => downloadPdf(financeData?.[0]?.file)}>
        Download File
      </Button>
    </div>
    <p className="font-medium">
      Order Id: <span className="text-gray-600">{financeData?.[0]?.bookingId}</span>
    </p>
    <p className="font-medium">
      RO Id: <span className="text-gray-600">{financeData?.[0]?.releaseOrderNo}</span>
    </p>
    <p className="font-medium">
      RO Date:{' '}
      <span className="text-gray-600">
        {financeData?.[0]?.createdAt ? dayjs(financeData[0].createdAt).format(DATE_FORMAT) : '-'}
      </span>
    </p>
    <p className="font-medium">
      To: <span className="text-gray-600">{financeData?.[0]?.companyName}</span>
    </p>
    <p className="font-medium">
      Contact Person: <span className="text-gray-600">{financeData?.[0]?.contactPerson}</span>
    </p>
    <p className="font-medium">
      Supplier: <span className="text-gray-600">{financeData?.[0]?.supplierName}</span>
    </p>
    <p className="font-medium">
      Total Amount: <span className="text-gray-600">{financeData?.[0]?.total}</span>
    </p>
    <p className="font-medium">
      Payment Method:{' '}
      <span className="text-gray-600 uppercase">{financeData?.[0]?.paymentType}</span>
    </p>
  </>
);

const InvoiceSection = ({ financeData }) => (
  <>
    <div className="flex justify-end">
      <Button className="secondary-button mr-3" onClick={() => downloadPdf(financeData?.[0]?.file)}>
        Download File
      </Button>
    </div>
    <p className="font-medium">
      Order Id: <span className="text-gray-600">{financeData?.[0]?.bookingId}</span>
    </p>
    <p className="font-medium">
      Inovice Id: <span className="text-gray-600">{financeData?.[0]?.invoiceNo}</span>
    </p>
    <p className="font-medium">
      Buyer Order No: <span className="text-gray-600">{financeData?.[0]?.buyerOrderNumber}</span>
    </p>
    <p className="font-medium">
      To: <span className="text-gray-600">{financeData?.[0]?.supplierName}</span>
    </p>
    <p className="font-medium">
      Buyer: <span className="text-gray-600">{financeData?.[0]?.buyerName}</span>
    </p>
    <p className="font-medium">
      Invoice Date:{' '}
      <span className="text-gray-600">
        {financeData?.[0]?.createdAt ? dayjs(financeData[0].createdAt).format(DATE_FORMAT) : '-'}
      </span>
    </p>
    <p className="font-medium">
      Supplier Ref: <span className="text-gray-600">{financeData?.[0]?.supplierRefNo}</span>
    </p>
    <p className="font-medium">
      Total Amount: <span className="text-gray-600">{financeData?.[0]?.total}</span>
    </p>
    <p className="font-medium">
      Payment Method:{' '}
      <span className="text-gray-600 uppercase">{financeData?.[0]?.modeOfPayment}</span>
    </p>
  </>
);

const recordContent = {
  purchase: PurchseSection,
  release: ReleaseSection,
  invoice: InvoiceSection,
};

const PreviewContent = ({ financeRecordId, year, month, recordType }) => {
  const modals = useModals();
  const queryClient = useQueryClient();
  const [financeData, setFinanceData] = useState();
  const [activeStatus, setActiveStatus] = useState();
  const financeQuery = {
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'asc',
    'recordType': recordType,
  };

  const Section = recordContent[recordType] ?? <div />;

  const { data: financialDataByMonth, isLoading } = useFetchFinanceByYearAndMonth(
    `${year}/${month}?${serialize(financeQuery)}`,
  );

  const { mutate, isLoading: isUpdateFinaceLoading } = useUpdateFinanceById();

  const invalidate = () => {
    modals.closeModal();
    queryClient.invalidateQueries(['finance-by-month']);
  };

  const handleApprovalStatus = (financeId, value) => {
    setActiveStatus(value);
    mutate(
      { id: financeId, data: { approvalStatus: value } },
      {
        onSuccess: invalidate,
      },
    );
  };

  useEffect(() => {
    if (financeRecordId) {
      // TODO: api dependent for finance get by id
      const currentRecord = financialDataByMonth?.finances?.docs.filter(
        item => item._id === financeRecordId,
      );
      setFinanceData(currentRecord);
    }
  }, [financialDataByMonth, financeRecordId]);

  return (
    <div className="px-5">
      {isLoading ? (
        <Loader className="mx-auto my-10" />
      ) : (
        <section>
          <Section financeData={financeData} />
          <footer className="flex justify-end">
            <Button
              className="primary-button mr-3"
              onClick={() => handleApprovalStatus(financeRecordId, 'approved')}
              disabled={isUpdateFinaceLoading || financeData?.[0]?.approvalStatus === 'approved'}
              loading={activeStatus === 'approved' && isUpdateFinaceLoading}
            >
              {financeData?.[0]?.approvalStatus === 'approved' ? 'Approved' : 'Approve'}
            </Button>
            <Button
              className="danger-button"
              onClick={() => handleApprovalStatus(financeRecordId, 'rejected')}
              disabled={isUpdateFinaceLoading || financeData?.[0]?.approvalStatus === 'rejected'}
              loading={activeStatus === 'rejected' && isUpdateFinaceLoading}
            >
              {financeData?.[0]?.approvalStatus === 'rejected' ? 'Rejected' : 'Reject'}
            </Button>
          </footer>
        </section>
      )}
    </div>
  );
};

export default PreviewContent;
