import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Group, Image, Loader, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { Link, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import { getWord } from 'num-count';
import Filter from '../../inventory/Filter';
import Search from '../../../Search';
import toIndianCurrency from '../../../../utils/currencyFormat';
import Table from '../../../Table/Table';
import { useFetchInventory } from '../../../../apis/queries/inventory.queries';
import { useFormContext } from '../../../../context/formContext';
import {
  categoryColors,
  currentDate,
  generateSlNo,
  getAvailableUnits,
  getOccupiedState,
  getOccupiedStateColor,
  stringToColour,
  validateFilterRange,
} from '../../../../utils';
import SpacesMenuPopover from '../../../Popovers/SpacesMenuPopover';
import RowsPerPage from '../../../RowsPerPage';

const getHealthTag = score =>
  score >= 80
    ? 'Best'
    : score < 80 && score >= 50
    ? 'Good'
    : score < 50 && score >= 30
    ? 'Average'
    : score < 30
    ? 'Bad'
    : 'Not yet selected';

const SpaceList = () => {
  const { setFieldValue, values } = useFormContext();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [showFilter, setShowFilter] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    limit: 20,
    sortBy: 'basicInformation.spaceName',
    sortOrder: 'desc',
    isUnderMaintenance: false,
    isActive: true,
  });
  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');

  const getTotalPrice = useCallback(
    (places = []) => {
      const totalPrice = places.reduce((acc, item) => acc + +(item.price || 0), 0);
      return totalPrice;
    },
    [values?.place],
  );

  const toggleFilter = () => setShowFilter(!showFilter);

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, pages, limit)}</p>, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'basicInformation.spaceName',
        Cell: info =>
          useMemo(() => {
            const { photo, spaceName, isUnderMaintenance, bookingRange, unit, _id } =
              info.row.original;
            const filterRange = validateFilterRange(bookingRange, currentDate, currentDate);

            const leftUnit = getAvailableUnits(filterRange, unit, _id);

            const occupiedState = getOccupiedState(leftUnit, unit);

            return (
              <div className="grid grid-cols-2 gap-2 items-center">
                <div className="flex flex-1 gap-2 items-center w-44">
                  <Image
                    height={30}
                    width={30}
                    withPlaceholder
                    className="rounded-md"
                    src={photo}
                  />
                  <Link
                    to={`/inventory/view-details/${_id}`}
                    className="font-medium underline"
                    target="_blank"
                  >
                    <Text
                      className="overflow-hidden text-ellipsis max-w-[180px] text-purple-450"
                      lineClamp={1}
                    >
                      {spaceName}
                    </Text>
                  </Link>
                </div>
                <div className="w-fit">
                  <Badge
                    className="capitalize"
                    variant="filled"
                    color={getOccupiedStateColor(isUnderMaintenance, occupiedState)}
                  >
                    {isUnderMaintenance ? 'Under Maintenance' : occupiedState}
                  </Badge>
                </div>
              </div>
            );
          }, []),
      },
      {
        Header: 'FACIA TOWARDS',
        accessor: 'location.faciaTowards',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{info.row.original.faciaTowards || '-'}</p>, []),
      },
      {
        Header: 'CITY',
        accessor: 'location.city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city || '-'}</p>),
      },
      {
        Header: 'ADDITIONAL TAGS',
        accessor: 'specifications.additionalTags',
        disableSortBy: true,
        Cell: info =>
          useMemo(
            () => (
              <div className="flex gap-x-2">
                {info.row.original.additionalTags?.length
                  ? info.row.original.additionalTags.map(
                      (item, index) =>
                        index < 2 && (
                          <Badge
                            key={uuidv4()}
                            size="lg"
                            className="capitalize w-fit"
                            title={item}
                            variant="outline"
                            color="cyan"
                            radius="xs"
                          >
                            {item}
                          </Badge>
                        ),
                    )
                  : '-'}
              </div>
            ),
            [],
          ),
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
                  <Badge color={colorType || 'gray'} size="lg" className="capitalize">
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
        Header: 'SUB CATEGORY',
        accessor: 'basicInformation.subCategory.name',
        Cell: info =>
          useMemo(
            () =>
              info.row.original.subCategory ? (
                <p
                  className="h-6 px-3 flex items-center rounded-xl text-white font-medium text-[13px] capitalize"
                  style={{
                    background: stringToColour(info.row.original.subCategory),
                  }}
                >
                  {info.row.original.subCategory}
                </p>
              ) : (
                '-'
              ),
            [],
          ),
      },
      {
        Header: 'DIMENSION (WxH)',
        accessor: 'specifications.size.min',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { dimension },
          },
        }) => useMemo(() => <div className="flex gap-x-2">{dimension}</div>, []),
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { price },
          },
        }) => toIndianCurrency(Number.parseInt(price, 10) || 0),
      },
      {
        Header: 'UNIT',
        accessor: 'specifications.unit',
        Cell: ({
          row: {
            original: { unit },
          },
        }) => useMemo(() => <p>{unit}</p>, []),
      },
      {
        Header: 'INVENTORY ID',
        accessor: 'inventoryId',
        Cell: info => useMemo(() => <p>{info.row.original.inventoryId || '-'}</p>, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'basicInformation.mediaOwner.name',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <div className="w-fit">{mediaOwner}</div>, []),
      },
      {
        Header: 'PEER',
        accessor: 'basicInformation.peerMediaOwner',
        Cell: ({
          row: {
            original: { peer },
          },
        }) => useMemo(() => <p className="w-fit">{peer}</p>, []),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'basicInformation.mediaType.name',
        Cell: ({
          row: {
            original: { mediaType },
          },
        }) => useMemo(() => <p>{mediaType || '-'}</p>),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'specifications.health',
        Cell: ({ row: { original } }) =>
          useMemo(
            () => (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: original.health, color: 'green' },
                    { value: 100 - original.health, color: 'red' },
                  ]}
                />
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { impression },
          },
        }) =>
          useMemo(
            () => <p className="capitalize w-32">{impression ? getWord(impression) : 'NA'}</p>,
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
            () => <SpacesMenuPopover itemId={_id} openInNewWindow enableDelete={false} />,
            [],
          ),
      },
    ],
    [updatedInventoryData, values.place],
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
  const handleSelection = selectedRows => {
    const avgHealth = selectedRows.reduce(
      (acc, item) => acc + (item?.health ? +item.health : 0),
      0,
    );
    const healthPercent = Math.floor((avgHealth / (selectedRows.length * 100)) * 100);

    const formData = selectedRows.map(
      ({
        _id,
        spaceName,
        photo,
        otherPhotos,
        price,
        location,
        mediaType,
        dimension,
        illuminations,
        impression,
        health,
        unit,
        resolutions,
      }) => ({
        _id,
        spaceName,
        photo,
        otherPhotos,
        price: +price || 0,
        location,
        mediaType,
        dimension,
        illuminations,
        impression,
        health,
        unit,
        resolutions,
      }),
    );

    setFieldValue('healthStatus', healthPercent);
    setFieldValue('healthTag', getHealthTag(healthPercent));
    setFieldValue('place', formData);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (debouncedSearch) {
      searchParams.set('search', debouncedSearch);
    } else {
      searchParams.delete('search');
    }

    setSearchParams(searchParams);
  }, [debouncedSearch]);

  useEffect(() => {
    if (inventoryData) {
      const { docs, ...page } = inventoryData;
      const finalData = [];

      for (const item of docs) {
        const obj = {};
        obj.photo = item?.basicInformation?.spacePhoto;
        obj.otherPhotos = item?.basicInformation?.otherPhotos;
        obj._id = item?._id;
        obj.spaceName = item?.basicInformation?.spaceName;
        obj.inventoryId = item?.inventoryId;
        obj.isUnderMaintenance = item?.isUnderMaintenance;
        obj.additionalTags = item?.specifications?.additionalTags;
        obj.category = item?.basicInformation?.category?.name;
        obj.subCategory = item?.basicInformation?.subCategory?.name;
        obj.mediaOwner = item?.basicInformation?.mediaOwner?.name || '-';
        obj.peer = item?.basicInformation?.peerMediaOwner || '-';
        obj.dimension = item.specifications?.size?.length ? (
          <p>
            {item.specifications.size
              .map((ele, index) =>
                index < 2 ? `${ele?.width || 0}ft x ${ele?.height || 0}ft` : null,
              )
              .filter(ele => ele !== null)
              .join(', ')}
          </p>
        ) : (
          '-'
        );
        obj.unit = item?.specifications?.unit || '-';
        obj.impression = item?.specifications?.impressions?.max || 0;
        obj.health = item?.specifications?.health;
        obj.faciaTowards = item?.location?.faciaTowards;
        obj.location = item?.location;
        obj.mediaType = item?.basicInformation?.mediaType?.name;
        obj.price = item?.basicInformation?.price;
        obj.landlord_name = item?.basicInformation?.mediaOwner?.name;
        obj.illuminations = item?.specifications?.illuminations?.name;
        obj.resolutions = item?.specifications?.resolutions;
        obj.bookingRange = item?.bookingRange ? item.bookingRange : [];

        finalData.push(obj);
      }
      setUpdatedInventoryData(finalData);
      setPagination(page);
    }
  }, [inventoryData]);

  useEffect(() => {
    searchParams.set('page', pagination.page);
    setSearchParams(searchParams);
  }, [pagination]);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Select Place for Order</p>
          <div>
            <Button onClick={toggleFilter} variant="default">
              <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
            </Button>
            {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <p className="text-slate-400">Selected Places</p>
            <p className="font-bold">{values?.place?.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Price</p>
            <p className="font-bold">{toIndianCurrency(getTotalPrice(values?.place))}</p>
          </div>
          <div>
            <p className="text-slate-400">Health Status</p>
            <p className="font-bold">{values?.healthTag || 'NA'}</p>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <Group>
            <RowsPerPage
              setCount={currentLimit => handlePagination('limit', currentLimit)}
              count={limit}
            />
            <p className="text-purple-450 text-sm">
              Total Places{' '}
              {inventoryData?.totalDocs ? (
                <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
                  {inventoryData.totalDocs}
                </span>
              ) : null}
            </p>
          </Group>
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {!inventoryData?.docs?.length && !isLoading ? (
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
          selectedRowData={values.place}
          handleSorting={handleSortByColumn}
          activePage={pagination.page}
          totalPages={pagination.totalPages}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : null}
    </>
  );
};

export default SpaceList;
