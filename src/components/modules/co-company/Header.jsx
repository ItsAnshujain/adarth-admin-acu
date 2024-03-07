import { Button, Menu, Tabs } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useModals } from '@mantine/modals';
import { generateSlNo } from '../../../utils';
import Table from '../../Table/Table';
import CompanyMenuPopover from '../../Popovers/CompanyMenuPopover';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import modalConfig from '../../../utils/modalConfig';
import AddCoCompanyContent from './AddCoCompanyContent';
import useCompanies from '../../../apis/queries/companies.queries';
import SuccessModal from '../../shared/Modal';

const updatedModalConfig = {
  ...modalConfig,
  size: '1000px',
  classNames: {
    title: 'font-dmSans text-2xl font-bold px-4',
    header: 'px-4 py-4 border-b border-gray-450',
    body: '',
    close: 'mr-4',
  },
};

const Header = () => {
  const modals = useModals();
  const [open, setOpenSuccessModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: debouncedSearch,
    tab: 'parent-companies',
  });

  const tab = searchParams.get('tab');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const coCompaniesQuery = useCompanies({
    page,
    limit,
    sortBy,
    sortOrder,
    search: debouncedSearch,
    type: 'co-company',
    isParent: tab === 'parent-companies',
  });

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

  const toggleAddParentCompanyModal = () => {
    modals.openModal({
      title: 'Add Parent Company',
      modalId: 'addCompanyModal',
      children: (
        <AddCoCompanyContent
          mode="add"
          type="parentCompany"
          onCancel={() => modals.closeModal('addCompanyModal')}
          onSuccess={() => setOpenSuccessModal('Parent Company')}
        />
      ),
      ...updatedModalConfig,
    });
  };

  const toggleAddSisterCompanyModal = () => {
    modals.openModal({
      title: 'Add Sister Company',
      modalId: 'addCompanyModal',
      children: (
        <AddCoCompanyContent
          mode="add"
          type="sisterCompany"
          onCancel={() => modals.closeModal('addCompanyModal')}
          onSuccess={() => setOpenSuccessModal('Sister Company')}
        />
      ),
      ...updatedModalConfig,
    });
  };

  const toggleEditParentCompanyModal = companyData => {
    modals.openModal({
      title: 'Edit Parent Company',
      modalId: 'editCompanyModal',
      children: (
        <AddCoCompanyContent
          mode="edit"
          type="parentCompany"
          companyData={companyData}
          onCancel={() => modals.closeModal('editCompanyModal')}
        />
      ),
      ...updatedModalConfig,
    });
  };

  const toggleEditSisterCompanyModal = companyData => {
    modals.openModal({
      title: 'Edit Sister Company',
      modalId: 'editCompanyModal',
      children: (
        <AddCoCompanyContent
          mode="edit"
          type="sisterCompany"
          companyData={companyData}
          onCancel={() => modals.closeModal('editCompanyModal')}
        />
      ),
      ...updatedModalConfig,
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        show: true,
        accessor: 'id',
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, 1, 10)}</p>, []),
      },
      {
        Header: 'COMPANY NAME',
        show: true,
        accessor: 'companyName',
      },
      {
        Header: 'CITY',
        show: true,
        accessor: 'companyAddress.city',
      },
      {
        Header: 'STATE & STATE CODE',
        show: true,
        Cell: ({
          row: {
            original: {
              companyAddress: { state, stateCode },
            },
          },
        }) => useMemo(() => <p>{stateCode ? `(${stateCode}) ${state}` : '-'}</p>, []),
      },
      {
        Header: 'GSTIN',
        show: true,
        accessor: 'companyGstNumber',
        disableSortBy: true,
      },
      {
        Header: 'COMPANY TYPE',
        show: true,
        accessor: 'companyType',
      },
      {
        Header: 'PARENT COMPANY',
        show: tab === 'sister-companies',
        accessor: 'parentCompany.companyName',
      },
      {
        Header: 'NATURE OF ACCOUNT',
        show: true,
        accessor: 'natureOfAccount',
      },
      {
        Header: 'CONTACT NUMBER',
        show: true,
        accessor: 'contactNumber',
        disableSortBy: true,
      },
      {
        Header: 'EMAIL',
        show: true,
        accessor: 'email',
        disableSortBy: true,
      },
      {
        Header: 'ACTION',
        show: true,
        accessor: 'action',
        disableSortBy: true,
        Cell: ({ row: { original } }) =>
          useMemo(
            () => (
              <CompanyMenuPopover
                itemId={original._id}
                type="co-company"
                tab={tab}
                toggleEdit={() =>
                  tab === 'parent-companies'
                    ? toggleEditParentCompanyModal(original)
                    : toggleEditSisterCompanyModal(original)
                }
              />
            ),
            [],
          ),
      },
    ],
    [tab, coCompaniesQuery?.data?.docs],
  );

  const memoizedColumns = useMemo(() => {
    if (tab === 'sister-companies') {
      return columns;
    }
    return columns.filter(col => col.show);
  }, [tab, coCompaniesQuery?.data?.docs]);

  return (
    <div className="flex justify-between py-4">
      <Tabs className="w-full" value={tab}>
        <Tabs.List className="border-b">
          <div className="flex justify-between w-full pb-0">
            <div className="flex gap-4 mb-0">
              <Tabs.Tab
                value="parent-companies"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  tab === 'parent-companies' ? 'border border-b-2 border-purple-450' : '',
                )}
                onClick={() => {
                  searchParams.set('tab', 'parent-companies');
                  searchParams.set('page', 1);
                  setSearchParams(searchParams, { replace: true });
                }}
              >
                Parent Companies
              </Tabs.Tab>
              <Tabs.Tab
                value="sister-companies"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  tab === 'sister-companies' ? 'border border-b-2 border-purple-450' : '',
                )}
                onClick={() => {
                  searchParams.set('tab', 'sister-companies');
                  searchParams.set('page', 1);
                  setSearchParams(searchParams, { replace: true });
                }}
              >
                Sister Companies
              </Tabs.Tab>
            </div>
            <Menu>
              <Menu.Target>
                <Button
                  variant="default"
                  className="bg-purple-450 text-white font-normal rounded-md mb-2"
                  leftIcon={<IconChevronDown size={20} />}
                >
                  Add Co-Company
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item className="p-0 justify-start">
                  <Button
                    variant="default"
                    className="w-full border-0 font-normal"
                    onClick={toggleAddParentCompanyModal}
                  >
                    Add Parent Company
                  </Button>
                </Menu.Item>
                <Menu.Item className="p-0 justify-start">
                  <Button
                    variant="default"
                    className="w-full border-0 font-normal"
                    onClick={toggleAddSisterCompanyModal}
                  >
                    Add Sister Company
                  </Button>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Tabs.List>
        <Tabs.Panel value="parent-companies">
          <div className="mt-4 text-lg font-bold">Parent Companies List</div>
          <div className="flex justify-between h-20 items-center">
            <RowsPerPage
              setCount={currentLimit => {
                handlePagination('limit', currentLimit);
              }}
              count="10"
            />
            <Search search={searchInput} setSearch={setSearchInput} />
          </div>
          <Table
            data={coCompaniesQuery?.data?.docs || []}
            COLUMNS={memoizedColumns}
            activePage={searchParams.get('page')}
            totalPages={coCompaniesQuery?.data?.totalPages || 1}
            setActivePage={currentPage => handlePagination('page', currentPage)}
            rowCountLimit={10}
            handleSorting={handleSortByColumn}
            loading={coCompaniesQuery.isLoading}
          />
        </Tabs.Panel>
        <Tabs.Panel value="sister-companies">
          <div className="mt-4 text-lg font-bold">Sister Companies List</div>
          <div className="flex justify-between h-20 items-center">
            <RowsPerPage
              setCount={currentLimit => {
                handlePagination('limit', currentLimit);
              }}
              count="10"
            />
            <Search search={searchInput} setSearch={setSearchInput} />
          </div>
          <Table
            data={coCompaniesQuery?.data?.docs || []}
            COLUMNS={memoizedColumns}
            activePage={searchParams.get('page')}
            totalPages={coCompaniesQuery?.data?.totalPages || 1}
            setActivePage={currentPage => handlePagination('page', currentPage)}
            rowCountLimit={10}
            handleSorting={handleSortByColumn}
            loading={coCompaniesQuery.isLoading}
          />
        </Tabs.Panel>
      </Tabs>
      <SuccessModal
        title={`${open} Successfully Added`}
        prompt="Close"
        open={!!open}
        setOpenSuccessModal={setOpenSuccessModal}
      />
    </div>
  );
};

export default Header;
