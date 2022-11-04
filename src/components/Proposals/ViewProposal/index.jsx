import { useMemo, useState, useEffect } from 'react';
import { Badge, Box, Button, Image, Loader, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useParams, useSearchParams } from 'react-router-dom';
import { useClickOutside, useDebouncedState } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Header from './Header';
import Details from './Details';
import DateRange from '../../DateRange';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import MenuPopover from '../MenuPopover';
import { useFetchProposalById } from '../../../hooks/proposal.hooks';
import toIndianCurrency from '../../../utils/currencyFormat';
import { colors } from '../../../utils';
import modalConfig from '../../../utils/modalConfig';
import Filter from '../../Inventory/Filter';

const ProposalDetails = () => {
  const modals = useModals();
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [count, setCount] = useState('10');
  const [showShare, setShowShare] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));
  const [searchParams, setSearchParams] = useSearchParams({
    'owner': 'all',
    'page': 1,
    'limit': 10,
    'sortBy': 'createdAt',
    'sortOrder': 'asc',
  });

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleFilter = () => setShowFilter(!showFilter);

  const { id: proposalId } = useParams();
  const { data: proposalData, isLoading: isProposalDataLoading } = useFetchProposalById(
    `${proposalId}?${searchParams.toString()}`,
  );

  const page = 1; // TODO: make api changes for pagination in spaces array

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
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * count;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { spaceName, spacePhoto, isUnderMaintenance },
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
                <Button className="flex-1 max-w-[180px] px-2 text-black font-medium">
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
        accessor: 'mediaOwner',
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
            original: { peer },
          },
        }) => useMemo(() => <p className="w-fit">{peer || '-'}</p>, []),
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
              <Badge color={colorType} size="lg" className="capitalize">
                {spaceType || <span>-</span>}
              </Badge>
            );
          }),
      },
      {
        Header: 'DIMENSION',
        accessor: 'dimension',
        Cell: ({
          row: {
            original: { size },
          },
        }) => useMemo(() => <p>{`${size?.height || 0}ft x ${size?.width || 0}ft`}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions',
        Cell: ({
          row: {
            original: { impressions },
          },
        }) => useMemo(() => <p>{`${impressions?.min}+`}</p>, []),
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
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
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
        Header: '',
        accessor: 'details',
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} proposalData={proposalData} />, []),
      },
    ],
    [proposalData?.inventories?.docs],
  );

  const handleSearch = () => {
    searchParams.set('spaceName', searchInput);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('spaceName');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div>
      <Header showShare={showShare} setShowShare={setShowShare} />
      <Details proposalData={proposalData?.proposal} />
      <div className="pl-5 pr-7 flex justify-between mt-4">
        <Text size="xl" weight="bolder">
          Selected Inventory
        </Text>
        <div className="flex gap-2">
          <div ref={ref} className="mr-2 relative">
            <Button onClick={toggleDatePicker} variant="default" type="button">
              <Image src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-[450px] bg-white -top-0.3">
                <DateRange handleClose={toggleDatePicker} />
              </div>
            )}
          </div>
          <div>
            <Button onClick={toggleFilter} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
      </div>

      <div className="flex justify-between h-20 items-center pr-7">
        <RowsPerPage setCount={setCount} count={count} />
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
          <Table COLUMNS={COLUMNS} data={proposalData?.inventories?.docs || []} />
        ) : null}
      </div>
    </div>
  );
};

export default ProposalDetails;
