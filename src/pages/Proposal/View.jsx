import { useMemo, useState, useEffect } from 'react';
import { Badge, Box, Button, Image, Loader, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import classNames from 'classnames';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Header from '../../components/Proposals/ViewProposal/Header';
import Details from '../../components/Proposals/ViewProposal/Details';
import DateRange from '../../components/DateRange';
import calendar from '../../assets/data-table.svg';
import Table from '../../components/Table/Table';
import { useFetchProposalById } from '../../hooks/proposal.hooks';
import toIndianCurrency from '../../utils/currencyFormat';
import { colors } from '../../utils';
import modalConfig from '../../utils/modalConfig';
import Filter from '../../components/Inventory/Filter';
import useUserStore from '../../store/user.store';
import MenuPopover from '../../components/Proposals/ViewProposal/MenuPopover';

const ProposalDetails = () => {
  const modals = useModals();
  const navigate = useNavigate();
  const userId = useUserStore(state => state.id);
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [searchParams, setSearchParams] = useSearchParams({
    'owner': 'all',
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
  });

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleFilter = () => setShowFilter(!showFilter);

  const { id: proposalId } = useParams();
  const { data: proposalData, isLoading: isProposalDataLoading } = useFetchProposalById(
    `${proposalId}?${searchParams.toString()}`,
  );

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const toggleImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClick={id => modals.closeModal(id)}>
            {imgSrc ? (
              <Image src={imgSrc} height={580} width={580} alt="preview" />
            ) : (
              <Image src={null} height={580} width={580} withPlaceholder />
            )}
          </Box>
        ),
      },
      ...modalConfig,
    });

  const handleInventoryDetails = itemId =>
    navigate(`/inventory/view-details/${itemId}`, {
      replace: true,
    });

  const COLUMNS = useMemo(
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
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { _id, spaceName, spacePhoto, isUnderMaintenance },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggleImagePreviewModal(spacePhoto)}
                >
                  {spacePhoto ? (
                    <Image src={spacePhoto} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <Button
                  className="flex-1 max-w-[180px] px-2 text-black font-medium"
                  onClick={() => handleInventoryDetails(_id)}
                >
                  {spaceName}
                </Button>
                <Badge
                  className="capitalize"
                  variant="filled"
                  color={isUnderMaintenance ? 'yellow' : 'green'}
                >
                  {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
                </Badge>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'basicInformation.landlord',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || 'NA'}</p>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: ({
          row: {
            original: { peer, peerId },
          },
        }) =>
          useMemo(
            () => (
              <p
                className={classNames(
                  peerId === userId ? 'text-purple-450' : 'text-black',
                  'w-fit',
                )}
              >
                {peer || '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'spaceType',
        Cell: ({
          row: {
            original: { spaceType },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(colors).find(key => colors[key] === spaceType);
            return (
              <div>
                {spaceType ? (
                  <Badge color={colorType} size="lg" className="capitalize">
                    {spaceType}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
            );
          }, []),
      },
      {
        Header: 'DIMENSION',
        accessor: 'size.height',
        Cell: ({
          row: {
            original: { size },
          },
        }) => useMemo(() => <p>{`${size?.height || 0}ft x ${size?.width || 0}ft`}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions.max',
        Cell: ({
          row: {
            original: { impressions },
          },
        }) => useMemo(() => <p>{`${impressions?.max || 0}+`}</p>, []),
      },
      {
        Header: 'HEALTH',
        accessor: 'health',
        Cell: ({
          row: {
            original: { health },
          },
        }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: health, color: 'green' },
                    { value: 100 - (health || 0), color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'LOCATION',
        accessor: 'location',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location || '-'}</p>),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
        Cell: ({
          row: {
            original: { mediaType },
          },
        }) => useMemo(() => <p>{mediaType || '-'}</p>),
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { price },
          },
        }) => useMemo(() => <p className="pl-2">{price ? toIndianCurrency(price) : 0}</p>, []),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) =>
          useMemo(
            () => <MenuPopover itemId={_id} spacesData={proposalData?.inventories?.docs} />,
            [],
          ),
      },
    ],
    [proposalData?.inventories?.docs],
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

  const handleSearch = () => {
    searchParams.set('search', searchInput);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  const handleRowCount = currentLimit => {
    searchParams.set('limit', currentLimit);
    setSearchParams(searchParams);
  };

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header />
      <Details
        proposalData={proposalData?.proposal}
        isProposalDataLoading={isProposalDataLoading}
        inventoryData={proposalData?.inventories}
      />
      <div className="pl-5 pr-7 flex justify-between mt-4">
        <Text size="xl" weight="bolder">
          Selected Inventory
        </Text>
        <div className="flex gap-2">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default">
              <Image src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-[450px] bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} dateKeys={['from', 'to']} />
              </div>
            )}
          </div>
          <div>
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>

      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={handleRowCount} count={limit} />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      {isProposalDataLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {proposalData?.inventories?.docs?.length === 0 && !isProposalDataLoading ? (
        <div className="w-full min-h-[300px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      <div>
        {proposalData?.inventories?.docs?.length ? (
          <Table
            COLUMNS={COLUMNS}
            data={proposalData?.inventories?.docs || []}
            activePage={proposalData?.inventories?.page || 1}
            totalPages={proposalData?.inventories?.totalPages || 1}
            setActivePage={handlePagination}
            handleSorting={handleSortByColumn}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProposalDetails;
