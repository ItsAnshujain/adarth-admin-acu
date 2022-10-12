/* eslint-disable */
import { useMemo, useState } from 'react';
import { Button, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import Header from './Header';
import Details from './Details';
import Filter from '../../Filter';
import DateRange from '../../DateRange';
import calendar from '../../../assets/data-table.svg';
import Table from '../../Table/Table';
import dummy from '../../../Dummydata/CREATE_PROPOSAL_DATA.json';
import MenuPopover from '../MenuPopover';
import NativeDropdownSelect from '../../shared/NativeDropdownSelect';

const ProposalDetails = () => {
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  const [showShare, setShowShare] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
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
        Cell: tableProps =>
          useMemo(() => {
            const {
              row: {
                original: { price },
              },
            } = tableProps;

            return <NativeDropdownSelect />;
          }, []),
      },
      {
        Header: '',
        accessor: 'details',
        Cell: tableProps =>
          useMemo(() => {
            const { _id } = tableProps.row.original;

            return <MenuPopover itemId={_id} />;
          }, []),
      },
    ],
    [],
  );

  return (
    <div onClick={() => setShowShare(false)}>
      <Header showShare={showShare} setShowShare={setShowShare} />
      <Details />
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
        <Table COLUMNS={COLUMNS} dummy={dummy} />
      </div>
    </div>
  );
};

export default ProposalDetails;
