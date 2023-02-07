import { Button, Loader } from '@mantine/core';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../../components/Finance/Header';
import Search from '../../components/Search';
import DateRange from '../../components/DateRange';
import calendar from '../../assets/data-table.svg';
import Table from '../../components/Table/Table';
import { useFetchFinanceByYearAndMonth } from '../../hooks/finance.hooks';
import toIndianCurrency from '../../utils/currencyFormat';
import MenuPopover from '../../components/Popovers/FinanceMenuPopover';
import { downloadPdf } from '../../utils';

const DATE_FORMAT = 'DD MMM, YYYY';

const Home = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
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

  const handleTabs = (pageNum, type) => {
    searchParams.set('recordType', type);
    setSearchParams(searchParams);
    setPageNumber(pageNum);
  };

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  // TODO: disable SortBy in all col for now
  const purchaseOrderColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <p className="pl-2">{rowCount + row.index + 1}</p>;
          }, []),
      },
      {
        Header: 'ORDER ID',
        accessor: 'bookingId',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { bookingId },
          },
        }) => useMemo(() => <p>{bookingId}</p>, []),
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
        Cell: () => useMemo(() => <p className="text-green-400">??</p>, []),
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
        }) => useMemo(() => <p className="uppercase">{paymentType}</p>, []),
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
            () => <MenuPopover itemId={_id} onClickDownloadPdf={() => downloadPdf(file)} />,
            [],
          ),
      },
    ],
    [financialDataByMonth?.finances?.docs],
  );

  // TODO: disable SortBy in all col for now
  const releaseOrderColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <p className="pl-2">{rowCount + row.index + 1}</p>;
          }, []),
      },
      {
        Header: 'ORDER ID',
        accessor: 'bookingId',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { bookingId },
          },
        }) => useMemo(() => <p>{bookingId}</p>, []),
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
        Cell: () => useMemo(() => <p>??</p>, []),
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
        Cell: () => useMemo(() => <p className="text-green-400">??</p>, []),
      },
      {
        Header: 'DATE',
        accessor: 'createdAt',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => useMemo(() => <p>{dayjs(createdAt).format(DATE_FORMAT)}</p>, []),
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
        }) => useMemo(() => <p className="uppercase">{paymentType}</p>, []),
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
            () => <MenuPopover itemId={_id} onClickDownloadPdf={() => downloadPdf(file)} />,
            [],
          ),
      },
    ],
    [financialDataByMonth?.finances?.docs],
  );

  // TODO: disable SortBy in all col for now
  const invoiceColumn = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <p className="pl-2">{rowCount + row.index + 1}</p>;
          }, []),
      },
      {
        Header: 'ORDER ID',
        accessor: 'bookingId',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { bookingId },
          },
        }) => useMemo(() => <p>{bookingId}</p>, []),
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
        Cell: () => useMemo(() => <p>??</p>, []),
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
        Cell: () => useMemo(() => <p className="text-green-400">??</p>, []),
      },
      {
        Header: 'DATE',
        accessor: 'createdAt',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => useMemo(() => <p>{dayjs(createdAt).format(DATE_FORMAT)}</p>, []),
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
            original: { modeOfPayment },
          },
        }) => useMemo(() => <p>{modeOfPayment}</p>, []),
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
            () => <MenuPopover itemId={_id} onClickDownloadPdf={() => downloadPdf(file)} />,
            [],
          ),
      },
    ],
    [financialDataByMonth?.finances?.docs],
  );

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header
        year={year}
        month={month}
        pageNumber={pageNumber}
        totalSales={financialDataByMonth?.cost?.totalSales}
        totalOperationlCost={financialDataByMonth?.cost?.totalOperationlCost}
      />
      <div className="flex pl-5 gap-3 items-center font-medium h-20 border-b">
        <Button
          onClick={() => handleTabs(0, 'purchase')}
          className={classNames(
            pageNumber === 0
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
          )}
        >
          Purchase Orders
        </Button>
        <Button
          onClick={() => handleTabs(1, 'release')}
          className={classNames(
            pageNumber === 1
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
          )}
        >
          Release Orders
        </Button>
        <Button
          onClick={() => handleTabs(2, 'invoice')}
          className={classNames(
            pageNumber === 2
              ? 'text-purple-450 after:content[""] after:block after:w-full after:h-0.5 after:relative after:top-5 after:bg-purple-450'
              : 'text-black',
          )}
        >
          Invoices
        </Button>
      </div>
      <div className="py-4 flex justify-end pr-7 gap-2 text-right">
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

      {!isLoading && financialDataByMonth?.finances?.docs?.length && pageNumber === 0 ? (
        <Table
          COLUMNS={purchaseOrderColumn}
          data={financialDataByMonth?.finances?.docs}
          activePage={financialDataByMonth?.finances?.page || 1}
          totalPages={financialDataByMonth?.finances?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : !isLoading && financialDataByMonth?.finances?.docs?.length && pageNumber === 1 ? (
        <Table
          COLUMNS={releaseOrderColumn}
          data={financialDataByMonth?.finances?.docs}
          activePage={financialDataByMonth?.finances?.page || 1}
          totalPages={financialDataByMonth?.finances?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : !isLoading && financialDataByMonth?.finances?.docs?.length ? (
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

export default Home;
