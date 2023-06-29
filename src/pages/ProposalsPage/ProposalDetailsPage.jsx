import { useMemo, useState, useEffect } from 'react';
import { Badge, Box, Button, Image, Loader, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import classNames from 'classnames';
import { getWord } from 'num-count';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import Header from '../../components/modules/proposals/ViewProposal/Header';
import Details from '../../components/modules/proposals/ViewProposal/Details';
import Table from '../../components/Table/Table';
import { useFetchProposalById } from '../../apis/queries/proposal.queries';
import toIndianCurrency from '../../utils/currencyFormat';
import { categoryColors } from '../../utils';
import modalConfig from '../../utils/modalConfig';
import Filter from '../../components/modules/inventory/Filter';
import useUserStore from '../../store/user.store';
import ProposalSpacesMenuPopover from '../../components/Popovers/ProposalSpacesMenuPopover';

const ProposalDetailsPage = () => {
  const modals = useModals();
  const userId = useUserStore(state => state.id);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    'owner': 'all',
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'desc',
  });

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
                <Link to={`/inventory/view-details/${_id}`} className="font-medium px-2 underline">
                  <Text
                    className="overflow-hidden text-ellipsis max-w-[180px] text-purple-450"
                    lineClamp={1}
                    title={spaceName}
                  >
                    {spaceName}
                  </Text>
                </Link>
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
        Header: 'INVENTORY ID',
        accessor: 'inventoryId',
        Cell: info => useMemo(() => <p>{info.row.original.inventoryId || '-'}</p>, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'mediaOwner',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <p className="w-fit">{mediaOwner || '-'}</p>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: ({
          row: {
            original: { peer, peerId, mediaOwner },
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
                {peer ? mediaOwner : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'CATEGORY',
        accessor: 'category',
        Cell: ({
          row: {
            original: { category },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(categoryColors).find(
              key => categoryColors[key] === category,
            );
            return (
              <div>
                {category ? (
                  <Badge color={colorType} size="lg" className="capitalize">
                    {category}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
            );
          }, []),
      },
      {
        Header: 'DIMENSION (WxH)',
        accessor: 'size.height',
        Cell: ({
          row: {
            original: { size },
          },
        }) => useMemo(() => <p>{`${size?.width || 0}ft x ${size?.height || 0}ft`}</p>, []),
      },
      {
        Header: 'UNIT',
        accessor: 'unit',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { unit },
          },
        }) => useMemo(() => <p>{unit || '-'}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions.max',
        Cell: ({
          row: {
            original: { impressions },
          },
        }) =>
          useMemo(
            () => (
              <p className="capitalize font-medium w-32">
                {impressions?.max ? `${getWord(impressions.max)}+` : 'NA'}
              </p>
            ),
            [],
          ),
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
        accessor: 'price',
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
            original: { _id, createdBy },
          },
        }) =>
          useMemo(
            () => (
              <ProposalSpacesMenuPopover
                inventoryId={_id}
                spacesData={proposalData?.inventories?.docs}
                enableEdit={createdBy && !createdBy?.isPeer}
                enableDelete={createdBy && !createdBy?.isPeer}
              />
            ),
            [],
          ),
      },
    ],
    [proposalData?.inventories?.docs],
  );

  const handleSortByColumn = colId => {
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'desc') {
      searchParams.set('sortOrder', 'asc');
      setSearchParams(searchParams, { replace: true });
      return;
    }
    if (searchParams.get('sortBy') === colId && searchParams.get('sortOrder') === 'asc') {
      searchParams.set('sortOrder', 'desc');
      setSearchParams(searchParams, { replace: true });
      return;
    }

    searchParams.set('sortBy', colId);
    setSearchParams(searchParams, { replace: true });
  };

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? page : 1);
    setSearchParams(searchParams, { replace: true });
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearch]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <Header isPeer={proposalData?.proposal?.isPeer} />
      <Details
        proposalData={proposalData?.proposal}
        isProposalDataLoading={isProposalDataLoading}
        inventoryData={proposalData?.inventories}
      />
      <div className="flex justify-between mt-4">
        <Text size="xl" weight="bolder">
          Selected Inventory
        </Text>
        <div className="flex gap-2">
          <div>
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>

      <div className="flex justify-between h-20 items-center">
        <RowsPerPage
          setCount={currentLimit => handlePagination('limit', currentLimit)}
          count={limit}
        />
        <Search search={searchInput} setSearch={setSearchInput} />
      </div>
      {isProposalDataLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {!proposalData?.inventories?.docs?.length && !isProposalDataLoading ? (
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
            setActivePage={currentPage => handlePagination('page', currentPage)}
            handleSorting={handleSortByColumn}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ProposalDetailsPage;
