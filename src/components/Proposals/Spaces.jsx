import { useMemo, useState } from 'react';
import { Text, Button, Progress, Image, NumberInput } from '@mantine/core';
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
import { serialize } from '../../utils';

const Spaces = ({
  setSelectedRow = () => {},
  selectedRowData = [],
  noOfSelectedPlaces,
  setProposedPrice = () => {},
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useDebouncedState('', 1000);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
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
        Cell: ({
          row: {
            original: { _id, basicInformation },
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
                <Button
                  className="text-black font-medium"
                  onClick={() =>
                    navigate(`/inventory/view-details/${_id}`, {
                      replace: true,
                    })
                  }
                >
                  {basicInformation?.spaceName}
                </Button>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA OWNER NAME',
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
        Header: 'HEALTH STATUS',
        accessor: 'health_status',
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
            original: { _id, basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                defaultValue={basicInformation?.price}
                className="w-40"
                hideControls
                onChange={val => setProposedPrice(val, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: '',
        accessor: 'details',
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
      },
    ],
    [inventoryData?.docs],
  );

  const calcutateTotalPrice = useMemo(() => {
    const initialCost = 0;
    if (selectedRowData.length > 0) {
      return selectedRowData
        .map(item => item?.price)
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialCost);
    }
    return initialCost;
  }, [selectedRowData]);

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
            <Text weight="bold">{noOfSelectedPlaces}</Text>
          </div>
          <div>
            <Text color="gray">Total Price</Text>
            <Text weight="bold">
              {calcutateTotalPrice ? toIndianCurrency(calcutateTotalPrice) : 0}
            </Text>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Text size="sm" className="text-purple-450">
            Total Places{' '}
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {inventoryData?.docs?.length}
            </span>
          </Text>

          <Search search={search} setSearch={setSearch} />
        </div>
      </div>
      <Table
        dummy={inventoryData?.docs || []}
        COLUMNS={COLUMNS}
        allowRowsSelect
        setSelectedFlatRows={setSelectedRow}
        selectedRowData={selectedRowData}
      />
    </>
  );
};

export default Spaces;
