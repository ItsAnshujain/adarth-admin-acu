import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import Table from '../../components/Table/Table';
import Header from '../../components/modules/termsAndConditions/Header';
import { generateSlNo } from '../../utils';
import TermsAndConditionsMenuPopover from '../../components/Popovers/TermsAndConditionsMenuPopover';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import { useProposalTerms } from '../../apis/queries/proposal.queries';

const TermsAndConditionsPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 200);

  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'isGlobal',
    sortOrder: 'desc',
  });

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const proposalTermsQuery = useProposalTerms({
    page,
    limit,
    sortBy,
    sortOrder,
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
        Header: 'TERMS AND CONDITIONS',
        accessor: 'name',
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
    <div className="overflow-y-auto px-5 col-span-10">
      <Header />
      <div className="flex justify-between h-20 items-center">
        <RowsPerPage
          setCount={currentLimit => {
            handlePagination('limit', currentLimit);
          }}
          count="10"
        />
        <Search
          search={searchInput}
          setSearch={val => {
            setSearchInput(val);
            searchParams.set('page', 1);
            setSearchParams(searchParams, {
              replace: true,
            });
          }}
        />
      </div>
      <Table
        data={proposalTermsQuery?.data?.docs || []}
        COLUMNS={columns}
        activePage={searchParams.get('page')}
        totalPages={proposalTermsQuery?.data?.totalPages || 1}
        setActivePage={currentPage => handlePagination('page', currentPage)}
        rowCountLimit={10}
        handleSorting={handleSortByColumn}
        loading={proposalTermsQuery.isLoading}
      />
    </div>
  );
};

export default TermsAndConditionsPage;
