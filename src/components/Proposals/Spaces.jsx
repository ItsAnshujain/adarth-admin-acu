import { useMemo, useState, useEffect } from 'react';
import { Text, Button, Progress, Image, NumberInput, Badge, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { Link, useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import Search from '../Search';
import toIndianCurrency from '../../utils/currencyFormat';
import Table from '../Table/Table';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import { categoryColors } from '../../utils';
import Filter from '../Inventory/Filter';
import { useFormContext } from '../../context/formContext';
import SpacesMenuPopover from '../Popovers/SpacesMenuPopover';
import DateRangeSelector from '../DateRangeSelector';

dayjs.extend(isBetween);

const getDate = (selectionItem, item, key) => {
  if (selectionItem && selectionItem[key]) return new Date(selectionItem[key]);

  if (item && item[key]) return new Date(item[key]);

  return null;
};

const Spaces = () => {
  const { values, setFieldValue } = useFormContext();
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
    'isUnderMaintenance': false,
  });
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');
  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());

  const toggleFilter = () => setShowFilter(!showFilter);

  const updateData = (key, val, id) => {
    if (key === 'dateRange') {
      setUpdatedInventoryData(prev =>
        prev.map(item =>
          item._id === id ? { ...item, startDate: val[0], endDate: val[1] } : item,
        ),
      );

      setFieldValue(
        'spaces',
        values.spaces.map(item =>
          item._id === id ? { ...item, startDate: val[0], endDate: val[1] } : item,
        ),
      );
    } else {
      setUpdatedInventoryData(prev =>
        prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
      );

      setFieldValue(
        'spaces',
        values.spaces.map(item => (item._id === id ? { ...item, [key]: val } : item)),
      );
    }
  };

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = pages;
            let rowCount = 0;
            if (pages < 1) {
              currentPage = 1;
            }
            rowCount = (currentPage - 1) * limit;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'basicInformation.spaceName',
        Cell: ({
          row: {
            original: { _id, spaceName, spacePhoto, isUnderMaintenance, bookingRange },
          },
        }) =>
          useMemo(() => {
            const isOccupied = bookingRange?.some(
              item =>
                dayjs().isBetween(item?.startDate, item?.endDate) ||
                dayjs(item?.startDate).isSame(dayjs(item?.endDate), 'day'),
            );

            return (
              <div className="flex items-center gap-2">
                <div className="bg-white border rounded-md">
                  {spacePhoto ? (
                    <Image src={spacePhoto} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </div>
                <Link
                  to={`/inventory/view-details/${_id}`}
                  className="font-medium px-2 underline"
                  target="_blank"
                >
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
                  color={isUnderMaintenance ? 'yellow' : isOccupied ? 'blue' : 'green'}
                >
                  {isUnderMaintenance ? 'Under Maintenance' : isOccupied ? 'Occupied' : 'Available'}
                </Badge>
              </div>
            );
          }, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'basicInformation.mediaOwner.name',
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
            original: { peer },
          },
        }) => useMemo(() => <p className="w-fit">{peer || '-'}</p>, []),
      },
      {
        Header: 'CATEGORY',
        accessor: 'basicInformation.category.name',
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
        Header: 'DIMENSION',
        accessor: 'specifications.size.min',
        Cell: ({
          row: {
            original: { height, width },
          },
        }) => useMemo(() => <p>{`${height || 0}ft x ${width || 0}ft`}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { impressions },
          },
        }) => useMemo(() => <p>{`${impressions || 0}+`}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'specifications.health',
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
        accessor: 'location.city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location || '-'}</p>, []),
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
            original: { _id, price },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                defaultValue={+(price || 0)}
                className="w-40"
                hideControls
                onBlur={e => updateData('price', e.target.value, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: 'PROPOSAL DATE',
        accessor: 'scheduledDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { bookingRange, startDate, endDate, _id },
          },
        }) =>
          useMemo(
            () => (
              <div className="min-w-[300px]">
                <DateRangeSelector
                  error={
                    !!values?.spaces?.find(item => item._id === _id) && (!startDate || !endDate)
                  }
                  dateValue={[startDate || null, endDate || null]}
                  onChange={val => updateData('dateRange', val, _id)}
                  dateRange={bookingRange}
                />
              </div>
            ),
            [],
          ),
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
            () => <SpacesMenuPopover itemId={_id} enableDelete={false} openInNewWindow />,
            [],
          ),
      },
    ],
    [updatedInventoryData, values.spaces],
  );

  const getTotalPrice = (places = []) => {
    const totalPrice = places.reduce(
      (acc, item) => acc + +(item.price || item?.basicInformation?.price || 0),
      0,
    );
    return totalPrice;
  };

  const handleSelection = selectedRows => setFieldValue('spaces', selectedRows);

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

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (inventoryData) {
      const { docs, ...page } = inventoryData;
      const finalData = [];

      for (const item of docs) {
        const selectionItem = values?.spaces?.find(pl => pl._id === item._id);

        const obj = {};
        obj._id = item._id;
        obj.spaceName = item?.basicInformation?.spaceName;
        obj.spacePhoto = item?.basicInformation?.spacePhoto;
        obj.isUnderMaintenance = item?.isUnderMaintenance;
        obj.mediaOwner = item?.basicInformation?.mediaOwner?.name;
        obj.peer = item?.createdBy?.isPeer && item.createdBy?.name;
        obj.category = item?.basicInformation?.category?.name;
        obj.height = item?.specifications?.size?.height;
        obj.width = item?.specifications?.size?.width;
        obj.impressions = item?.specifications?.impressions?.max;
        obj.health = item?.specifications?.health;
        obj.location = item?.location?.city;
        obj.mediaType = item?.basicInformation?.mediaType?.name;
        obj.price = selectionItem?.price ?? (item?.basicInformation?.price || 0);
        obj.bookingRange = item?.bookingRange ? item.bookingRange : [];
        obj.startDate = getDate(selectionItem, item, 'startDate');
        obj.endDate = getDate(selectionItem, item, 'endDate');
        finalData.push(obj);
      }
      setUpdatedInventoryData(finalData);
      setPagination(page);
    }
  }, [inventoryData]);

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <Text size="lg" weight="bold">
            Select Place for Proposal
          </Text>
          <div className="flex items-center gap-2">
            <div className="mr-2">
              <Button onClick={toggleFilter} variant="default">
                <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
              </Button>
              {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Text color="gray">Selected Places</Text>
            <Text weight="bold">{values?.spaces?.length}</Text>
          </div>
          <div>
            <Text color="gray">Total Price</Text>
            <Text weight="bold">{toIndianCurrency(getTotalPrice(values?.spaces))}</Text>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Text size="sm" className="text-purple-450">
            Total Places{' '}
            {inventoryData?.totalDocs ? (
              <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
                {inventoryData.totalDocs}
              </span>
            ) : null}
          </Text>

          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {inventoryData?.docs?.length === 0 && !isLoading ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {inventoryData?.docs?.length ? (
        <Table
          data={updatedInventoryData}
          COLUMNS={COLUMNS}
          allowRowsSelect
          setSelectedFlatRows={handleSelection}
          selectedRowData={values.spaces}
          handleSorting={handleSortByColumn}
          activePage={pagination.page}
          totalPages={pagination.totalPages}
          setActivePage={handlePagination}
        />
      ) : null}
    </>
  );
};

export default Spaces;
