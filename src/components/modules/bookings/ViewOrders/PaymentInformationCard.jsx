import React, { useMemo } from 'react';
import { Button, Group } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useSearchParams } from 'react-router-dom';
import Table from '../../../Table/Table';
import modalConfig from '../../../../utils/modalConfig';
import AddPaymentInformationForm from './AddPaymentInformationForm';
import toIndianCurrency from '../../../../utils/currencyFormat';

const PaymentInformationCard = () => {
  const modals = useModals();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

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
        accessor: 'paymentType',
        Cell: info => useMemo(() => <p>{info.row.original.paymentType}</p>, []),
      },
      {
        Header: 'AMOUNT',
        accessor: 'amount',
        Cell: info => useMemo(() => <p>{toIndianCurrency(info.row.original.amount || 0)}</p>, []),
      },

      {
        Header: 'CARD NO',
        accessor: 'cardNumber',
        Cell: info => useMemo(() => <p>{info.row.original.cardNumber}</p>, []),
      },
      {
        Header: 'PAYMENT DATE',
        accessor: 'paymentDate',
        Cell: info => useMemo(() => <p>{info.row.original.paymentDate}</p>, []),
      },
      {
        Header: 'PAYMENT REFERENCE ID',
        accessor: 'referenceId',
        Cell: info => useMemo(() => <p>{info.row.original.referenceId || 0}</p>, []),
      },
      {
        Header: 'REMARKS',
        accessor: 'remarks',
        Cell: info => useMemo(() => <p>{info.row.original.remarks}</p>, []),
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
      title: 'Add Payment Information',
      children: <AddPaymentInformationForm />,
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

      {/* //TODO: uncomment after integration */}
      {/* <div className="w-full min-h-[150px] flex justify-center items-center">
        <p className="text-xl">No records found</p>
      </div> */}

      <Table COLUMNS={COLUMNS} data={[]} activePage={page} classNameWrapper="min-h-[150px]" />
    </div>
  );
};

export default PaymentInformationCard;
