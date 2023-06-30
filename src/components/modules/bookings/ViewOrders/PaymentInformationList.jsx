import React, { useMemo } from 'react';
import { Button, Group } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Table from '../../../Table/Table';
import modalConfig from '../../../../utils/modalConfig';
import AddPaymentInformationForm from './AddPaymentInformationForm';
import toIndianCurrency from '../../../../utils/currencyFormat';
import { usePayment } from '../../../../apis/queries/payment.queries';
import { DATE_FORMAT } from '../../../../utils/constants';

const PaymentInformationList = () => {
  const modals = useModals();
  const { id: bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const paymentQuery = usePayment(
    { bookingId, limit: 10, page: 1, sortBy: 'name', sortOrder: 'asc' },
    !!bookingId,
  );

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info =>
          useMemo(() => {
            const currentPage = Math.max(page, 1);
            const rowCount = (currentPage - 1) * +(limit || 0);
            return <p className="pl-2">{rowCount + info.row.index + 1}</p>;
          }, [page, limit]),
      },
      {
        Header: 'PAYMENT TYPE',
        accessor: 'type',
        Cell: info => useMemo(() => <p className="uppercase">{info.row.original.type}</p>, []),
      },
      {
        Header: 'AMOUNT',
        accessor: 'amount',
        Cell: info => useMemo(() => <p>{toIndianCurrency(info.row.original.amount || 0)}</p>, []),
      },

      {
        Header: 'CARD NO',
        accessor: 'cardNumber',
        Cell: info => useMemo(() => <p>{info.row.original.cardNumber || '-'}</p>, []),
      },
      {
        Header: 'PAYMENT DATE',
        accessor: 'paymentDate',
        Cell: info =>
          useMemo(
            () => (
              <p>
                {info.row.original.paymentDate
                  ? dayjs(info.row.original.paymentDate).format(DATE_FORMAT)
                  : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'PAYMENT REFERENCE ID',
        accessor: 'referenceNumber',
        Cell: info => useMemo(() => <p>{info.row.original.referenceNumber || '-'}</p>, []),
      },
      {
        Header: 'REMARKS',
        accessor: 'remarks',
        Cell: info => useMemo(() => <p>{info.row.original.remarks || '-'}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: () => useMemo(() => <p />, []),
      },
    ],
    [],
  );

  const handleAddPayment = () =>
    modals.openModal({
      modalId: 'addPaymentInformation',
      title: 'Add Payment Information',
      children: (
        <AddPaymentInformationForm
          bookingId={bookingId}
          onClose={() => modals.closeModal('addPaymentInformation')}
        />
      ),
      ...modalConfig,
    });

  return (
    <div className="mb-5">
      <Group position="apart" className="pb-3">
        <p className="font-bold text-lg">Payment Info</p>
        <Button className="primary-button" onClick={handleAddPayment}>
          Add Payment Information
        </Button>
      </Group>

      {paymentQuery.data?.docs.length ? (
        <Table
          COLUMNS={COLUMNS}
          data={paymentQuery.data?.docs || []}
          activePage={page}
          classNameWrapper="min-h-[150px]"
        />
      ) : (
        <div className="w-full min-h-[150px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      )}
    </div>
  );
};

export default PaymentInformationList;
