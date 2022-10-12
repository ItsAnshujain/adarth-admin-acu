import { useMemo, useState, useEffect } from 'react';
import { Text, Button, Progress, Image } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import Filter from '../Filter';
import DateRange from '../DateRange';
import Search from '../Search';
import calendar from '../../assets/data-table.svg';
import toIndianCurrency from '../../utils/currencyFormat';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import NativeDropdownSelect from '../shared/NativeDropdownSelect';
import { serialize } from '../../utils';

const Spaces = ({ setSelectedRow = () => {} }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useDebouncedState('', 1000);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [updatedInventoryList, setUpdatedInventoryList] = useState([]);
  const [query] = useState({
    limit: 10,
    page: 1,
  });

  const openDatePicker = () => setShowDatePicker(!showDatePicker);
  const { data: inventoryData } = useFetchInventory(serialize(query));
  const page = searchParams.get('page');

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
            rowCount = (currentPage - 1) * 10;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'spaceName',
        Cell: tableProps =>
          useMemo(() => {
            const { photo, spaceName, _id } = tableProps.row.original;

            return (
              <div className="flex items-center gap-2">
                <div className="bg-white border rounded-md">
                  <Image className="h-8 w-8 mx-auto" src={photo} alt="banner" />
                </div>
                <Button
                  className="text-black font-medium"
                  onClick={() =>
                    navigate(`/inventory/view-details/${_id}`, {
                      replace: true,
                    })
                  }
                >
                  {spaceName}
                </Button>
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
        Header: 'HEALTH STATUS',
        accessor: 'health_status',
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
        Cell: () => useMemo(() => <NativeDropdownSelect />, []),
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
    [updatedInventoryList],
  );

  const formattedData = () => {
    const updatedList = [];
    const tempList = [...inventoryData.docs];
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
    if (inventoryData?.docs) {
      formattedData();
    }
  }, [inventoryData]);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <Text size="lg" weight="bold">
            Select Place for Campaign
          </Text>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button onClick={openDatePicker} variant="default" type="button">
                <img src={calendar} className="h-5" alt="calendar" />
              </Button>
              {showDatePicker && (
                <div className="absolute z-20 -translate-x-3/4 bg-white -top-0.3">
                  <DateRange handleClose={openDatePicker} />
                </div>
              )}
            </div>
            <Button onClick={() => setShowFilter(!showFilter)} variant="default" type="button">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Text color="gray">Selected Places</Text>
            <Text weight="bold">0</Text>
          </div>
          <div>
            <Text color="gray">Total Price</Text>
            <Text weight="bold">{toIndianCurrency(20000)}</Text>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Text size="sm" className="text-purple-450">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {updatedInventoryList?.length}
            </span>
          </Text>

          <Search search={search} setSearch={setSearch} />
        </div>
      </div>
      <Table
        dummy={updatedInventoryList || []}
        COLUMNS={COLUMNS}
        allowRowsSelect
        selectedRows={setSelectedRow}
      />
    </>
  );
};

export default Spaces;
