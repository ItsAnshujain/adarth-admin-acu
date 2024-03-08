import { useMemo, useState } from 'react';
import { useModals } from '@mantine/modals';
import { useSearchParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { generateSlNo } from '../../../utils';
import Table from '../../Table/Table';
import LeadsListHeader from './LeadsListHeader';
import LeadMenuPopover from '../../Popovers/LeadMenuPopover';
import modalConfig from '../../../utils/modalConfig';
import AddFollowUpContent from './AddFollowUpContent';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import ViewLeadDrawer from './ViewLeadDrawer';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: 'px-8',
    close: 'mr-4',
  },
  size: 800,
};

const LeadsList = () => {
  const modals = useModals();
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewLeadDrawerOpened, viewLeadDrawerActions] = useDisclosure();

  const toggleAddFollowUp = () =>
    modals.openModal({
      title: 'Add Follow Up',
      modalId: 'addFollowUpModal',
      children: <AddFollowUpContent onCancel={() => modals.closeModal('addFollowUpModal')} />,
      ...updatedModalConfig,
    });

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);

    setSearchParams(searchParams);
  };
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
        Header: 'CONTACT PERSON',
        accessor: 'contactPerson',
      },
      {
        Header: 'STAGE',
        accessor: 'stage',
      },
      {
        Header: 'DISPLAY BRAND',
        accessor: 'displayBrand',
      },
      {
        Header: 'OBJECTIVE',
        accessor: 'objective',
      },
      {
        Header: 'PRIORITY',
        accessor: 'priority',
      },
      {
        Header: 'LEAD SOURCE',
        accessor: 'leadSource',
      },
      {
        Header: 'PRIMARY INCHARGE',
        accessor: 'primaryiIncharge',
      },
      {
        Header: 'SECONDARY INCHARGE',
        accessor: 'secondaryiIncharge',
      },
      {
        Header: 'LAST FOLLOWUP',
        accessor: 'lastFollowup',
      },
      {
        Header: 'LEAD START DATE',
        accessor: 'leadStartDate',
      },
      {
        Header: 'TARGET DATE',
        accessor: 'leadEndDate',
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({ row: { original } }) =>
          useMemo(
            () => (
              <LeadMenuPopover
                itemId={original._id}
                toggleAddFollowUp={toggleAddFollowUp}
                toggleViewLead={viewLeadDrawerActions.toggle}
              />
            ),
            [],
          ),
      },
    ],
    [],
  );
  return (
    <div className="mx-2 px-4">
      <LeadsListHeader />
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
        data={[{}]}
        COLUMNS={columns}
        activePage={1}
        totalPages={1}
        // setActivePage={currentPage => handlePagination('page', currentPage)}
        rowCountLimit={10}
        // handleSorting={handleSortByColumn}
        // loading={companiesQuery?.isLoading}
      />
      <ViewLeadDrawer isOpened={viewLeadDrawerOpened} onClose={viewLeadDrawerActions.close} />
    </div>
  );
};

export default LeadsList;
