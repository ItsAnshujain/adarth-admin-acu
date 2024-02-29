import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useModals } from '@mantine/modals';
import Table from '../../components/Table/Table';
import { generateSlNo } from '../../utils';
import ContactMenuPopover from '../../components/Popovers/ContactMenuPopover';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Header from '../../components/modules/contact/Header';
import useContacts from '../../apis/queries/contacts.queries';
import { DATE_SECOND_FORMAT } from '../../utils/constants';
import modalConfig from '../../utils/modalConfig';
import AddContactContent from '../../components/modules/contact/AddContactContent';

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

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder');

  const contactsQuery = useContacts({
    page,
    limit,
    sortBy,
    sortOrder,
    search: debouncedSearch,
  });

  const modals = useModals();

  const toggleAddContact = mode => {
    modals.openModal({
      title: `${mode} Contact`,
      modalId: 'addContact',
      children: <AddContactContent onCancel={() => modals.closeModal('addContact')} />,
      ...updatedModalConfig,
    });
  };

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
        accessor: 'company.companyName',
      },
      {
        Header: 'PARENT COMPANY NAME',
        accessor: 'parentCompany.companyName',
      },
      {
        Header: 'CITY',
        accessor: 'address.city',
      },
      {
        Header: 'STATE & STATE CODE',
        accessor: 'address.state',
        Cell: ({
          row: {
            original: {
              address: { state, stateCode },
            },
          },
        }) =>
          useMemo(
            () => (
              <div>
                ({stateCode}) {state}
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'BIRTHDAY',
        accessor: 'birthDate',
        Cell: ({
          row: {
            original: { birthDate },
          },
        }) =>
          useMemo(
            () => <p className="bg-gray-450 px-1">{dayjs(birthDate).format(DATE_SECOND_FORMAT)}</p>,
            [],
          ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <ContactMenuPopover toggleEdit={toggleAddContact} itemId={_id} />, []),
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
        <Header toggleAddContact={toggleAddContact} />
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
          data={contactsQuery?.data?.docs || []}
          COLUMNS={columns}
          activePage={searchParams.get('page')}
          totalPages={contactsQuery?.data?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
          rowCountLimit={10}
          handleSorting={handleSortByColumn}
        />
      </div>
    </div>
  );
};

export default ContactPage;
