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
import AddCompanyContent from './AddCompanyContent';

const updatedModalConfig = {
  ...modalConfig,
  size: '1000px',
  classNames: {
    title: 'font-dmSans text-2xl font-bold px-4',
    header: 'px-4 pt-4',
    body: '',
    close: 'mr-4',
  },
};

const Header = () => {
  const modals = useModals();
  const [activeTab, setActiveTab] = useState('companies');
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
        Header: 'COMPANY NAME',
        accessor: 'companyName',
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
        Header: 'GSTIN',
        accessor: 'gst',
        disableSortBy: true,
      },
      {
        Header: 'COMPANY TYPE',
        accessor: 'companyType',
      },
      {
        Header: 'PARENT COMPANY',
        accessor: 'parentCompany',
      },
      {
        Header: 'NATURE OF ACCOUNT',
        accessor: 'natureOfAccount',
      },
      {
        Header: 'CONTACT NUMBER',
        accessor: 'contact',
        disableSortBy: true,
      },
      {
        Header: 'EMAIL',
        accessor: 'email',
        disableSortBy: true,
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <CompanyMenuPopover itemId={_id} />, []),
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

  const toggleAddCompanyModal = () => {
    modals.openModal({
      title: 'Add Company',
      modalId: 'addCompanyModal',
      children: <AddCompanyContent />,
      ...updatedModalConfig,
    });
  };

  const toggleAddParentCompanyModal = () => {};

  return (
    <div className="flex justify-between py-4">
      <Tabs className="w-full" value={activeTab}>
        <Tabs.List className="border-b">
          <div className="flex justify-between w-full pb-0">
            <div className="flex gap-4 mb-0">
              <Tabs.Tab
                value="companies"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  activeTab === 'companies' ? 'border border-b-2 border-purple-450' : '',
                )}
                onClick={() => setActiveTab('companies')}
              >
                Companies
              </Tabs.Tab>
              <Tabs.Tab
                value="parentCompanies"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  activeTab === 'parentCompanies' ? 'border border-b-2 border-purple-450' : '',
                )}
                onClick={() => setActiveTab('parentCompanies')}
              >
                Parent Companies
              </Tabs.Tab>
            </div>
            <Menu>
              <Menu.Target>
                <Button
                  variant="default"
                  className="bg-purple-450 text-white font-normal rounded-md mb-2"
                  leftIcon={<IconChevronDown size={20} />}
                >
                  Add Company
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item className="p-0 justify-start">
                  <Button
                    variant="default"
                    className="w-full border-0 font-normal"
                    onClick={toggleAddCompanyModal}
                  >
                    Add Company
                  </Button>
                </Menu.Item>
                <Menu.Item className="p-0 justify-start">
                  <Button
                    variant="default"
                    className="w-full border-0 font-normal"
                    onClick={toggleAddParentCompanyModal}
                  >
                    Add Parent Company
                  </Button>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Tabs.List>
        <Tabs.Panel value="companies">
          <div className="mt-4 text-lg font-bold">Companies List</div>
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
            data={[]}
            COLUMNS={columns}
            activePage={1}
            totalPages={1}
            setActivePage={() => {}}
            rowCountLimit={10}
            handleSorting={handleSortByColumn}
          />
        </Tabs.Panel>
        <Tabs.Panel value="parentCompanies">
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
            data={[]}
            COLUMNS={columns}
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
