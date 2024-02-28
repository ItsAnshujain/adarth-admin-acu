import { Button, Loader, Select } from '@mantine/core';
import { useClickOutside, useDebouncedValue } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronDown } from 'react-feather';
import { useModals } from '@mantine/modals';
import Header from '../../components/modules/finance/Header';
import Search from '../../components/Search';
import DateRange from '../../components/DateRange';
import calendar from '../../assets/data-table.svg';
import Table from '../../components/Table/Table';
import { useFetchFinanceByYearAndMonth } from '../../apis/queries/finance.queries';
import toIndianCurrency from '../../utils/currencyFormat';
import FinanceMenuPopover from '../../components/Popovers/FinanceMenuPopover';
import { downloadPdf, generateSlNo, orderTitle, ROLES } from '../../utils';
import RoleBased from '../../components/RoleBased';
import modalConfig from '../../utils/modalConfig';
import PreviewContent from '../../components/modules/finance/PreviewContent';
import VerifyApprovalContent from '../../components/VerifyApprovalContent';

const updatedModalConfig = { ...modalConfig, size: 'xl' };

const DATE_FORMAT = 'DD MMM, YYYY';

const approvalStatList = [
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Sent for Approval', value: 'sent_for_approval' },
];

const FinanceMonthlyDetailsPage = () => {
  const modals = useModals();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'asc',
    'recordType': 'purchase',
  });
  const { year, month } = useParams();
  const { data: financialDataByMonth, isLoading } = useFetchFinanceByYearAndMonth(
    `${year}/${month}?${searchParams.toString()}`,
  );

  const ref = useClickOutside(() => setShowDatePicker(false));
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const financeRecordId = searchParams.get('id');
  const recordType = searchParams.get('recordType');
  const [pageType, setPageType] = useState(recordType || 'purchase');

  const handleTabs = type => {
    searchParams.set('recordType', type);
    searchParams.set('page', 1);
    searchParams.delete('id');
    setSearchParams(searchParams);
    setPageType(type);
  };

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? page : 1);
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const toggleApproveModal = (financeId, value) =>
    modals.openContextModal('basic', {
      title: '',
      modalId: financeId,
      innerProps: {
        modalBody: (
          <VerifyApprovalContent
            onClickCancel={() => modals.closeModal(financeId)}
            financeId={financeId}
            value={value}
          />
        ),
      },
      ...modalConfig,
    });

  const purchaseOrderColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
      },
      {
        Header: 'ORDER ID',
        accessor: 'financeId',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { financeId },
          },
        }) => useMemo(() => <p>{financeId || '-'}</p>, []),
      },
      {
        Header: 'ORGANIZATION',
        accessor: 'company',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdBy },
          },
        }) => useMemo(() => <p className="capitalize">{createdBy?.[0]?.company || '-'}</p>),
      },
      {
        Header: 'VOUCHER NO',
        accessor: 'invoiceNo',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { invoiceNo },
          },
        }) => useMemo(() => <p>{invoiceNo}</p>, []),
      },
      {
        Header: 'INVOICE TO',
        disableSortBy: true,
        accessor: 'buyerName',
        Cell: ({
          row: {
            original: { buyerName },
          },
        }) => useMemo(() => <p>{buyerName}</p>, []),
      },
      {
        Header: 'SUPPLIER',
        disableSortBy: true,
        accessor: 'supplierName',
        Cell: ({
          row: {
            original: { supplierName },
          },
        }) => useMemo(() => <p>{supplierName}</p>, []),
      },
      {
        Header: 'STATUS',
        disableSortBy: true,
        accessor: 'status',
        Cell: ({
          row: {
            original: { _id, approvalStatus },
          },
        }) =>
          useMemo(() => {
            const updatedList = [...approvalStatList];

            if (!approvalStatus || approvalStatus === '') {
              updatedList.unshift({ label: 'Select', value: '' });
            }

            const filteredList = updatedList.map(item => ({
              ...item,
              disabled: approvalStatus?.includes(item.value) || item.value === 'sent_for_approval',
            }));

            return (
              <div>
                <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.MANAGEMENT]}>
                  <Select
                    className="mr-2"
                    data={filteredList}
                    disabled={approvalStatus?.toLowerCase() === 'rejected'}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                    rightSectionWidth={40}
                    onChange={e => toggleApproveModal(_id, e)}
                    value={approvalStatus || ''}
                  />
                </RoleBased>
                <RoleBased acceptedRoles={[ROLES.SUPERVISOR, ROLES.ASSOCIATE]}>
                  <p
                    className={classNames(
                      approvalStatus === 'approved'
                        ? 'text-green-400'
                        : approvalStatus === 'rejected'
                        ? 'text-red-450'
                        : 'text-purple-450',
                      'font-medium',
                    )}
                  >
                    {approvalStatus === 'sent_for_approval'
                      ? 'Sent for Approval'
                      : approvalStatus === 'approved'
                      ? 'Approved'
                      : approvalStatus === 'rejected'
                      ? 'Rejected'
                      : '-'}
                  </p>
                </RoleBased>
              </div>
            );
          }, []),
      },
      {
        Header: 'DATE',
        disableSortBy: true,
        accessor: 'createdAt',
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => useMemo(() => <p>{dayjs(createdAt).format(DATE_FORMAT)}</p>, []),
      },
      {
        Header: 'TOTAL AMOUNT',
        disableSortBy: true,
        accessor: 'total',
        Cell: ({
          row: {
            original: { total },
          },
        }) => useMemo(() => <p>{toIndianCurrency(total || 0)}</p>, []),
      },
      {
        Header: 'PAYMENT METHOD',
        disableSortBy: true,
        accessor: 'payment_method',
        Cell: ({
          row: {
            original: { paymentType },
          },
        }) => useMemo(() => <p className="uppercase">{paymentType || '-'}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: '',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, file },
          },
        }) =>
          useMemo(
            () => (
              <FinanceMenuPopover
                itemId={_id}
                onClickDownloadPdf={() => downloadPdf(file)}
                type={recordType}
              />
            ),
            [],
          ),
      },
    ],
    [financialDataByMonth?.finances?.docs],
  );

  const releaseOrderColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
      },
      {
        Header: 'ORDER ID',
        accessor: 'financeId',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { financeId },
          },
        }) => useMemo(() => <p>{financeId || '-'}</p>, []),
      },
      {
        Header: 'ORGANIZATION',
        accessor: 'company',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdBy },
          },
        }) => useMemo(() => <p className="capitalize">{createdBy?.[0]?.company || '-'}</p>),
      },
      {
        Header: 'RO ID',
        accessor: 'releaseOrderNo',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { releaseOrderNo },
          },
        }) => useMemo(() => <p>{releaseOrderNo}</p>, []),
      },
      {
        Header: 'RO DATE',
        accessor: 'ro_date',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => useMemo(() => <p>{dayjs(createdAt).format(DATE_FORMAT)}</p>, []),
      },
      {
        Header: 'TO',
        accessor: 'companyName',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { companyName },
          },
        }) => useMemo(() => <p>{companyName}</p>, []),
      },
      {
        Header: 'CONTACT PERSON',
        accessor: 'contactPerson',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { contactPerson },
          },
        }) => useMemo(() => <p>{contactPerson}</p>, []),
      },
      {
        Header: 'SUPPLIER',
        accessor: 'supplierName',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { supplierName },
          },
        }) => useMemo(() => <p>{supplierName}</p>, []),
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, approvalStatus },
          },
        }) =>
          useMemo(() => {
            const updatedList = [...approvalStatList];

            if (!approvalStatus || approvalStatus === '') {
              updatedList.unshift({ label: 'Select', value: '' });
            }

            const filteredList = updatedList.map(item => ({
              ...item,
              disabled: approvalStatus?.includes(item.value) || item.value === 'sent_for_approval',
            }));

            return (
              <div>
                <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.MANAGEMENT]}>
                  <Select
                    className="mr-2"
                    data={filteredList}
                    disabled={approvalStatus?.toLowerCase() === 'rejected'}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                    rightSectionWidth={40}
                    onChange={e => toggleApproveModal(_id, e)}
                    defaultValue={approvalStatus || ''}
                  />
                </RoleBased>
                <RoleBased acceptedRoles={[ROLES.SUPERVISOR, ROLES.ASSOCIATE]}>
                  <p
                    className={classNames(
                      approvalStatus === 'approved'
                        ? 'text-green-400'
                        : approvalStatus === 'rejected'
                        ? 'text-red-450'
                        : 'text-purple-450',
                      'font-medium',
                    )}
                  >
                    {approvalStatus === 'sent_for_approval'
                      ? 'Sent for Approval'
                      : approvalStatus === 'approved'
                      ? 'Approved'
                      : approvalStatus === 'rejected'
                      ? 'Rejected'
                      : '-'}
                  </p>
                </RoleBased>
              </div>
            );
          }, [approvalStatus]),
      },
      {
        Header: 'TOTAL AMOUNT',
        accessor: 'total',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { total },
          },
        }) => useMemo(() => <p>{toIndianCurrency(total || 0)}</p>, []),
      },
      {
        Header: 'PAYMENT METHOD',
        accessor: 'payment_method',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { paymentType },
          },
        }) => useMemo(() => <p className="uppercase">{paymentType || '-'}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: '',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, file },
          },
        }) =>
          useMemo(
            () => (
              <FinanceMenuPopover
                itemId={_id}
                onClickDownloadPdf={() => downloadPdf(file)}
                type={recordType}
              />
            ),
            [],
          ),
      },
    ],
    [financialDataByMonth?.finances?.docs],
  );

  const invoiceColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
      },
      {
        Header: 'ORDER ID',
        accessor: 'financeId',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { financeId },
          },
        }) => useMemo(() => <p>{financeId || '-'}</p>, []),
      },
      {
        Header: 'ORGANIZATION',
        accessor: 'company',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdBy },
          },
        }) => useMemo(() => <p className="capitalize">{createdBy?.[0]?.company || '-'}</p>),
      },
      {
        Header: 'INVOICE ID',
        accessor: 'invoiceNo',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { invoiceNo },
          },
        }) => useMemo(() => <p>{invoiceNo}</p>, []),
      },
      {
        Header: 'BUYER ORDER NO',
        accessor: 'buyerOrderNumber',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { buyerOrderNumber },
          },
        }) => useMemo(() => <p>{buyerOrderNumber}</p>, []),
      },
      {
        Header: 'TO',
        accessor: 'supplierName',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { supplierName },
          },
        }) => useMemo(() => <p>{supplierName}</p>, []),
      },
      {
        Header: 'BUYER',
        accessor: 'buyerName',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { buyerName },
          },
        }) => useMemo(() => <p>{buyerName}</p>, []),
      },
      {
        Header: 'INVOICE DATE',
        accessor: 'invoice_date',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => useMemo(() => <p>{dayjs(createdAt).format(DATE_FORMAT)}</p>, []),
      },
      {
        Header: 'SUPPLIER REF',
        accessor: 'supplierRefNo',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { supplierRefNo },
          },
        }) => useMemo(() => <p>{supplierRefNo}</p>, []),
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, approvalStatus },
          },
        }) =>
          useMemo(() => {
            const updatedList = [...approvalStatList];

            if (!approvalStatus || approvalStatus === '') {
              updatedList.unshift({ label: 'Select', value: '' });
            }

            const filteredList = updatedList.map(item => ({
              ...item,
              disabled: approvalStatus?.includes(item.value) || item.value === 'sent_for_approval',
            }));

            return (
              <div>
                <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.MANAGEMENT]}>
                  <Select
                    className="mr-2"
                    data={filteredList}
                    disabled={approvalStatus?.toLowerCase() === 'rejected'}
                    styles={{ rightSection: { pointerEvents: 'none' } }}
                    rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                    rightSectionWidth={40}
                    onChange={e => toggleApproveModal(_id, e)}
                    defaultValue={approvalStatus || ''}
                  />
                </RoleBased>
                <RoleBased acceptedRoles={[ROLES.SUPERVISOR, ROLES.ASSOCIATE]}>
                  <p
                    className={classNames(
                      approvalStatus === 'approved'
                        ? 'text-green-400'
                        : approvalStatus === 'rejected'
                        ? 'text-red-450'
                        : 'text-purple-450',
                      'font-medium',
                    )}
                  >
                    {approvalStatus === 'sent_for_approval'
                      ? 'Sent for Approval'
                      : approvalStatus === 'approved'
                      ? 'Approved'
                      : approvalStatus === 'rejected'
                      ? 'Rejected'
                      : '-'}
                  </p>
                </RoleBased>
              </div>
            );
          }, []),
      },
      {
        Header: 'TOTAL AMOUNT',
        accessor: 'total',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { total },
          },
        }) => useMemo(() => <p>{toIndianCurrency(total || 0)}</p>, []),
      },
      {
        Header: 'PAYMENT METHOD',
        accessor: 'modeOfPayment',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { modeOfPayment, paymentType },
          },
        }) => useMemo(() => <p className="uppercase">{modeOfPayment || paymentType || '-'}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: '',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id, file },
          },
        }) =>
          useMemo(
            () => (
              <FinanceMenuPopover
                itemId={_id}
                onClickDownloadPdf={() => downloadPdf(file)}
                type={recordType}
              />
            ),
            [],
          ),
      },
    ],
    [financialDataByMonth?.finances?.docs],
  );

  const togglePreviewModal = () =>
    modals.openContextModal('basic', {
      title: `${orderTitle[recordType]} Current Status`,
      innerProps: {
        modalBody: (
          <PreviewContent
            financeRecordId={financeRecordId}
            recordType={recordType}
            onClose={() => {
              searchParams.delete('id');
              setSearchParams(searchParams);
            }}
          />
        ),
      },
      closeOnClickOutside: false,
      ...updatedModalConfig,
    });

  useEffect(() => {
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (financeRecordId) {
      togglePreviewModal();
    }
  }, [financeRecordId]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <Header
        year={year}
        month={month}
        totalSales={financialDataByMonth?.cost?.totalSales}
        totalOperationlCost={financialDataByMonth?.cost?.totalOperationlCost}
      />
      <div className="flex gap-x-5 items-center font-medium h-20 border-b">
        <Button
          onClick={() => handleTabs('purchase')}
          className={classNames(
            pageType === 'purchase'
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
            'px-0',
          )}
        >
          Purchase Orders
        </Button>
        <Button
          onClick={() => handleTabs('release')}
          className={classNames(
            pageType === 'release'
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
            'px-0',
          )}
        >
          Release Orders
        </Button>
        <Button
          onClick={() => handleTabs('invoice')}
          className={classNames(
            pageType === 'invoice'
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
            'px-0',
          )}
        >
          Invoices
        </Button>
      </div>
      <div className="py-4 flex justify-end gap-2 text-right">
        <Search search={searchInput} setSearch={setSearchInput} />
        <div ref={ref} className=" relative">
          <Button onClick={toggleDatePicker} variant="default">
            <img src={calendar} className="h-5" alt="calendar" />
          </Button>
          {showDatePicker && (
            <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3 right-[-400px]">
              <DateRange handleClose={toggleDatePicker} dateKeys={['startDate', 'endDate']} />
            </div>
          )}
        </div>
      </div>

      {isLoading ? <Loader className="w-full mt-20" /> : null}

      {!financialDataByMonth?.finances?.docs?.length && !isLoading ? (
        <div className="w-full mt-10 flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}

      {!isLoading && financialDataByMonth?.finances?.docs?.length && pageType === 'purchase' ? (
        <Table
          COLUMNS={purchaseOrderColumn}
          data={financialDataByMonth?.finances?.docs}
          activePage={financialDataByMonth?.finances?.page || 1}
          totalPages={financialDataByMonth?.finances?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : !isLoading && financialDataByMonth?.finances?.docs?.length && pageType === 'release' ? (
        <Table
          COLUMNS={releaseOrderColumn}
          data={financialDataByMonth?.finances?.docs}
          activePage={financialDataByMonth?.finances?.page || 1}
          totalPages={financialDataByMonth?.finances?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : !isLoading && financialDataByMonth?.finances?.docs?.length && pageType === 'invoice' ? (
        <Table
          COLUMNS={invoiceColumn}
          data={financialDataByMonth?.finances?.docs}
          activePage={financialDataByMonth?.finances?.page || 1}
          totalPages={financialDataByMonth?.finances?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : null}
    </div>
  );
};

export default FinanceMonthlyDetailsPage;
