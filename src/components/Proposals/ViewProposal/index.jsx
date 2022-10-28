import { useMemo, useState } from 'react';
import { Badge, Box, Button, Image, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useClickOutside } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Header from './Header';
import Details from './Details';
import Filter from '../../Filter';
import DateRange from '../../DateRange';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import MenuPopover from '../MenuPopover';
import { useFetchProposalById } from '../../../hooks/proposal.hooks';
import toIndianCurrency from '../../../utils/currencyFormat';
import { colors, spaceTypes } from '../../../utils';
import modalConfig from '../../../utils/modalConfig';

const ProposalDetails = () => {
  const modals = useModals();
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('10');
  const [showShare, setShowShare] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ref = useClickOutside(() => setShowDatePicker(false));

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleFilter = () => setShowFilter(!showFilter);

  const { id: proposalId } = useParams();
  const { data: proposalData } = useFetchProposalById(proposalId);

  const page = 1; // TODO: make api changes for pagination in spaces array

  const toggleImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClickCancel={id => modals.closeModal(id)}>
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
            original: { basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggleImagePreviewModal(basicInformation?.spacePhotos)}
                >
                  {basicInformation?.spacePhotos ? (
                    <Image src={basicInformation.spacePhotos} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <p className="flex-1">{basicInformation?.spaceName}</p>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'landlord_name',
        Cell: tableProps => useMemo(() => <div>{tableProps.row.original.landlord_name}</div>, []),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(() => {
            const type = specifications?.spaceType ? spaceTypes[specifications.spaceType] : '-';
            return (
              <Badge color={colors[type]} size="lg" className="capitalize">
                {spaceTypes[type] || <span>-</span>}
              </Badge>
            );
          }),
      },
      {
        Header: 'START DATE',
        accessor: 'startDate',
      },
      {
        Header: 'END DATE',
        accessor: 'endDate',
      },
      {
        Header: 'DIMENSION',
        accessor: 'dimension',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <p>{`${specifications?.resolutions?.height}ft x ${specifications?.resolutions?.width}ft`}</p>
            ),
            [],
          ),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) => useMemo(() => <p>{`${specifications?.impressions?.min}+`}</p>, []),
      },
      {
        Header: 'HEALTH',
        accessor: 'health',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: specifications?.health, color: 'green' },
                    { value: 100 - (specifications?.health || 0), color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'LOCATION',
        accessor: 'city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city}</p>, []),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'media_type',
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
    [proposalData?.spaces],
  );

  return (
    <div>
      <Header showShare={showShare} setShowShare={setShowShare} />
      <Details proposalData={proposalData} />
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
        <Search search={search} setSearch={setSearch} />
      </div>
      <div>
        <Table COLUMNS={COLUMNS} data={proposalData?.spaces || []} />
      </div>
    </div>
  );
};

export default ProposalDetails;
