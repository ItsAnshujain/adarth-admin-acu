import { useMemo, useState } from 'react';
import { useModals } from '@mantine/modals';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { ActionIcon, Badge } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons';
import dayjs from 'dayjs';
import { generateSlNo } from '../../../utils';
import Table from '../../Table/Table';
import LeadsListHeader from './LeadsListHeader';
import LeadMenuPopover from '../../Popovers/LeadMenuPopover';
import modalConfig from '../../../utils/modalConfig';
import AddFollowUpContent from './AddFollowUpContent';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import ViewLeadDrawer from './ViewLeadDrawer';
import useLeads from '../../../apis/queries/leads.queries';
import {
  DATE_SECOND_FORMAT,
  leadPriorityOptions,
  leadStageOptions,
} from '../../../utils/constants';

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
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [viewLeadDrawerOpened, viewLeadDrawerActions] = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: debouncedSearch,
  });

  const leadsQuery = useLeads(searchParams.toString());

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

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, 1, 10)}</p>, []),
      },
      {
        Header: 'COMPANY NAME',
        accessor: 'leadCompany.companyName',
      },
      {
        Header: 'CONTACT PERSON',
        accessor: 'contact.name',
      },
      {
        Header: 'STAGE',
        accessor: 'stage',
        Cell: ({
          row: {
            original: { stage },
          },
        }) =>
          useMemo(() => {
            const leadStage = leadStageOptions?.filter(({ value }) => value === stage)?.[0];
            return (
              <Badge bg={leadStage?.color} className="text-white capitalize">
                {leadStage?.label}
              </Badge>
            );
          }, []),
      },
      {
        Header: 'DISPLAY BRAND',
        accessor: 'brandDisplay',
      },
      {
        Header: 'OBJECTIVE',
        accessor: 'objective',
      },
      {
        Header: 'PRIORITY',
        accessor: 'priority',
        Cell: ({
          row: {
            original: { priority },
          },
        }) =>
          useMemo(() => {
            const leadPriority = leadPriorityOptions?.filter(
              ({ value }) => value === priority,
            )?.[0];
            return (
              <Badge bg={leadPriority?.color} className="text-white capitalize">
                {leadPriority?.label}
              </Badge>
            );
          }, []),
      },
      {
        Header: 'LEAD SOURCE',
        accessor: 'leadSource',
      },
      {
        Header: 'PRIMARY INCHARGE',
        accessor: 'primaryInCharge.name',
      },
      {
        Header: 'SECONDARY INCHARGE',
        accessor: 'secondaryInCharge.name',
      },
      {
        Header: 'LAST FOLLOWUP',
        accessor: 'lastFollowup',
      },
      {
        Header: 'LEAD START DATE',
        accessor: 'targetStartDate',
        Cell: ({
          row: {
            original: { targetStartDate },
          },
        }) => useMemo(() => <div>{dayjs(targetStartDate).format(DATE_SECOND_FORMAT)}</div>, []),
      },
      {
        Header: 'TARGET DATE',
        accessor: 'targetEndDate',
        Cell: ({
          row: {
            original: { targetEndDate },
          },
        }) => useMemo(() => <div>{dayjs(targetEndDate).format(DATE_SECOND_FORMAT)}</div>, []),
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
      {
        Header: '',
        accessor: 'action1',
        disableSortBy: true,
        sticky: true,
        Cell: () =>
          useMemo(
            () => (
              <ActionIcon className="bg-purple-450" onClick={viewLeadDrawerActions.open}>
                <IconChevronLeft size={20} color="white" />
              </ActionIcon>
            ),
            [],
          ),
      },
    ],
    [leadsQuery?.data?.docs],
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
        data={leadsQuery?.data?.docs || []}
        COLUMNS={columns}
        activePage={leadsQuery?.data?.page}
        totalPages={leadsQuery?.data?.totalPages}
        setActivePage={currentPage => handlePagination('page', currentPage)}
        rowCountLimit={10}
        handleSorting={handleSortByColumn}
        loading={leadsQuery?.isLoading}
      />

      <ViewLeadDrawer isOpened={viewLeadDrawerOpened} onClose={viewLeadDrawerActions.close} />
    </div>
  );
};

export default LeadsList;