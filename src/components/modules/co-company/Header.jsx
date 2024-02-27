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
  const [activeTab, setActiveTab] = useState('parent-companies');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: debouncedSearch,
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
          type="parentCompany"
          onCancel={() => modals.closeModal('addCompanyModal')}
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
          type="sisterCompany"
          onCancel={() => modals.closeModal('addCompanyModal')}
        />
      ),
      ...updatedModalConfig,
    });
  };

  const toggleEditParentCompanyModal = () => {
    modals.openModal({
      title: 'Edit Parent Company',
      modalId: 'editCompanyModal',
      children: (
        <AddCoCompanyContent
          type="parentCompany"
          onCancel={() => modals.closeModal('editCompanyModal')}
        />
      ),
      ...updatedModalConfig,
    });
  };

  const toggleEditSisterCompanyModal = () => {
    modals.openModal({
      title: 'Edit Sister Company',
      modalId: 'editCompanyModal',
      children: (
        <AddCoCompanyContent
          type="sisterCompany"
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
        accessor: 'city',
      },
      {
        Header: 'STATE & STATE CODE',
        show: true,
        accessor: 'state',
      },
      {
        Header: 'GSTIN',
        show: true,
        accessor: 'gst',
        disableSortBy: true,
      },
      {
        Header: 'COMPANY TYPE',
        show: true,
        accessor: 'companyType',
      },
      {
        Header: 'PARENT COMPANY',
        show: activeTab === 'sister-companies',
        accessor: 'parentCompany',
      },
      {
        Header: 'NATURE OF ACCOUNT',
        show: true,
        accessor: 'natureOfAccount',
      },
      {
        Header: 'CONTACT NUMBER',
        show: true,
        accessor: 'contact',
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
        Cell: ({
          row: {
            original: { _id },
          },
        }) =>
          useMemo(
            () => (
              <CompanyMenuPopover
                itemId={_id}
                type={activeTab}
                toggleEdit={
                  activeTab === 'parent-companies'
                    ? toggleEditParentCompanyModal
                    : toggleEditSisterCompanyModal
                }
              />
            ),
            [],
          ),
      },
    ],
    [activeTab],
  );

  const memoizedColumns = useMemo(() => {
    if (activeTab === 'sister-companies') {
      return columns;
    }
    return columns.filter(col => col.show);
  }, [activeTab]);
  return (
    <div className="flex justify-between py-4">
      <Tabs className="w-full" value={activeTab}>
        <Tabs.List className="border-b">
          <div className="flex justify-between w-full pb-0">
            <div className="flex gap-4 mb-0">
              <Tabs.Tab
                value="parent-companies"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  activeTab === 'parent-companies' ? 'border border-b-2 border-purple-450' : '',
                )}
                onClick={() => setActiveTab('parent-companies')}
              >
                Parent Companies
              </Tabs.Tab>
              <Tabs.Tab
                value="sister-companies"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  activeTab === 'sister-companies' ? 'border border-b-2 border-purple-450' : '',
                )}
                onClick={() => setActiveTab('sister-companies')}
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
              count={10}
            />
            <Search search={searchInput} setSearch={setSearchInput} />
          </div>
          <Table
            data={[{}]}
            COLUMNS={memoizedColumns}
            activePage={1}
            totalPages={1}
            setActivePage={() => {}}
            rowCountLimit={10}
            handleSorting={handleSortByColumn}
          />
        </Tabs.Panel>
        <Tabs.Panel value="sister-companies">
          <div className="mt-4 text-lg font-bold">Sister Companies List</div>
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
            data={[{}]}
            COLUMNS={memoizedColumns}
            activePage={1}
            totalPages={1}
            setActivePage={() => {}}
            rowCountLimit={10}
            handleSorting={handleSortByColumn}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Header;
