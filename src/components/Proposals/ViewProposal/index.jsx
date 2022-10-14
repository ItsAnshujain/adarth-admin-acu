/* eslint-disable */
import { useEffect, useMemo, useState } from 'react';
import { Button, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Header from './Header';
import Details from './Details';
import Filter from '../../Filter';
import DateRange from '../../DateRange';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import MenuPopover from '../MenuPopover';
import { useParams } from 'react-router-dom';
import { useFetchProposalById } from '../../../hooks/proposal.hooks';
import toIndianCurrency from '../../../utils/currencyFormat';

const ProposalDetails = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('10');
  const [showShare, setShowShare] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatedInventoryList, setUpdatedInventoryList] = useState([]);

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
        Cell: tableProps =>
          useMemo(() => {
            const { photo, spaceName } = tableProps.row.original;

            return (
              <div className="flex items-center gap-2">
                <div className="bg-white border rounded-md">
                  <img className="h-8 w-8 mx-auto" src={photo} alt="banner" />
                </div>
                <p className="flex-1">{spaceName}</p>
              </div>
            );
          }, []),
      },
      {
        Header: 'LANDLORD NAME',
        accessor: 'landlord_name',
        Cell: tableProps =>
          useMemo(() => <div className="w-fit">{tableProps.row.original.landlord_name}</div>, []),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
        Cell: ({ row }) => useMemo(() => <div className="w-fit">{row.original.startDate}</div>, []),
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
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions',
      },
      {
        Header: 'HEALTH',
        accessor: 'health',
        Cell: tableProps =>
          useMemo(() => {
            const { health } = tableProps.row.original;
            return (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: health, color: 'green' },
                    { value: 100 - health, color: 'red' },
                  ]}
                />
              </div>
            );
          }, []),
      },
      {
        Header: 'LOCATION',
        accessor: 'city',
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'media_type',
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({ row }) =>
          useMemo(() => {
            return (
              <div className="pl-2">
                {row.original.price ? toIndianCurrency(row?.original?.price) : 0}
              </div>
            );
          }, []),
      },
      {
        Header: '',
        accessor: 'details',
        Cell: tableProps =>
          useMemo(() => {
            const { _id } = tableProps.row.original;

            return <MenuPopover itemId={_id} proposalData={proposalData} />;
          }, []),
      },
    ],
    [updatedInventoryList],
  );

  const formattedData = () => {
    const updatedList = [];
    const tempList = [...proposalData.spaces];
    tempList?.map(row => {
      const rowObj = {
        ...row?.basicInformation,
        ...row?.location,
        health: row?.specifications?.health,
        impressions: `${row?.specifications?.impressions?.max}+`,
        dimension: ` ${row?.specifications?.resolutions?.height} ${row?.specifications?.resolutions?.width}`,
        _id: row?._id,
      };

      return updatedList.push(rowObj);
    });
    setUpdatedInventoryList(updatedList);
  };

  useEffect(() => {
    if (proposalData?.spaces) {
      formattedData();
    }
  }, [proposalData?.spaces]);

  return (
    <div onClick={() => setShowShare(false)}>
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
        <Table COLUMNS={COLUMNS} dummy={updatedInventoryList || []} />
      </div>
    </div>
  );
};

export default ProposalDetails;
