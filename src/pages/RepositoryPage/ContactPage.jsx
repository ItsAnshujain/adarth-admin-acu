import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import Table from '../../components/Table/Table';
import { generateSlNo } from '../../utils';
import TermsAndConditionsMenuPopover from '../../components/Popovers/TermsAndConditionsMenuPopover';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Header from '../../components/modules/contact/Header';

const ContactPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: debouncedSearch,
  });

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, 1, 10)}</p>, []),
      },
      {
        Header: 'NAME',
        accessor: 'name',
      },
      {
        Header: 'CONTACT NUMBER',
        accessor: 'contactNumber',
        disableSortBy: true,
      },
      {
        Header: 'EMAIL',
        accessor: 'email',
        disableSortBy: true,
      },
      {
        Header: 'DEPARTMENT',
        accessor: 'department',
      },
      {
        Header: 'COMPANY NAME',
        accessor: 'companyName',
      },
      {
        Header: 'PARENT COMPANY NAME',
        accessor: 'parentCompanyName',
      },
      {
        Header: 'CITY',
        accessor: 'city',
      },
      {
        Header: 'STATE & STATE CODE',
        accessor: 'state',
      },
      {
        Header: 'BIRTHDAY',
        accessor: 'birthday',
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <TermsAndConditionsMenuPopover itemId={_id} />, []),
      },
    ],
    [],
  );

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams);
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams);
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };
  return (
    <div className="overflow-y-auto px-3 col-span-10">
      <div className="overflow-y-auto px-3 col-span-10">
        <Header />
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={currentLimit => {
              handlePagination('limit', currentLimit);
            }}
            count={10}
          />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
        <Table
          data={[
            {
              id: 10,
              termsAndCondition: 'asd',
            },
          ]}
          COLUMNS={columns}
          activePage={1}
          totalPages={1}
          setActivePage={() => {}}
          rowCountLimit={10}
          handleSorting={handleSortByColumn}
        />
      </div>
    </div>
  );
};

export default ContactPage;