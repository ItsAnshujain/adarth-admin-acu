import { useMemo } from 'react';
import { generateSlNo } from '../../../utils';
import Table from '../../Table/Table';
import LeadsListHeader from './LeadsListHeader';
import LeadMenuPopover from '../../Popovers/LeadMenuPopover';

const LeadsList = () => {
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
          useMemo(() => <LeadMenuPopover itemId={original._id} toggleEdit={() => {}} />, []),
      },
    ],
    [],
  );
  return (
    <div className="mx-2 px-4">
      <LeadsListHeader />
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
    </div>
  );
};

export default LeadsList;
