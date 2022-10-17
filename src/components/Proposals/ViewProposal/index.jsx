import { useMemo, useState } from 'react';
import { Button, Image, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useParams } from 'react-router-dom';
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

const ProposalDetails = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('10');
  const [showShare, setShowShare] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const { id: proposalId } = useParams();
  const { data: proposalData } = useFetchProposalById(proposalId);

  const page = 1; // TODO: make api changes for pagination in spaces array

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
                <div className="bg-white border rounded-md">
                  {basicInformation?.spacePhotos ? (
                    <Image src={basicInformation.spacePhotos} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </div>
                <p className="flex-1">{basicInformation?.spaceName}</p>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'LANDLORD NAME',
        accessor: 'landlord_name',
        Cell: tableProps => useMemo(() => <div>{tableProps.row.original.landlord_name}</div>, []),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
        Cell: ({ row }) => useMemo(() => <p>{row.original.startDate}</p>, []),
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
        }) => useMemo(() => <p>{`${specifications?.impressions?.max}+`}</p>, []),
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
          <div className="mr-2 relative">
            <Button onClick={openDatePicker} variant="default" type="button">
              <img src={calendar} className="h-5" alt="calendar" />
            </Button>
            {showDatePicker && (
              <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3">
                <DateRange handleClose={openDatePicker} />
              </div>
            )}
          </div>
          <div>
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
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
        <Table COLUMNS={COLUMNS} dummy={proposalData?.spaces || []} />
      </div>
    </div>
  );
};

export default ProposalDetails;
