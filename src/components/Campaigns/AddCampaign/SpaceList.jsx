import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Group, Image, Loader, Progress, Text } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { Link, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { getWord } from 'num-count';
import Filter from '../../modules/inventory/Filter';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import { useFetchInventory } from '../../../apis/queries/inventory.queries';
import { useFormContext } from '../../../context/formContext';
import { categoryColors } from '../../../utils';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';
import RowsPerPage from '../../RowsPerPage';

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
            original: { isUnderMaintenance, photo, spaceName, _id },
          },
        }) =>
          useMemo(
            () => (
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
                    color={isUnderMaintenance ? 'yellow' : 'green'}
                  >
                    {isUnderMaintenance ? 'Under Maintenance' : 'Available'}
                  </Badge>
                </div>
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
        Header: 'DIMENSION (WxH)',
        accessor: 'specifications.size.min',
        Cell: ({
          row: {
            original: { dimension },
          },
        }) => useMemo(() => <p>{dimension}</p>, []),
      },
      {
        Header: 'UNIT',
        accessor: 'specifications.unit',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { unit },
          },
        }) => useMemo(() => <p>{unit}</p>, []),
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
            () => (
              <p className="capitalize font-medium w-32">
                {impression ? `${getWord(impression)}+` : 'NA'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'HEALTH',
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
        Header: 'LOCATION',
        accessor: 'location.city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city || '-'}</p>),
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
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { price },
          },
        }) => toIndianCurrency(Number.parseInt(price, 10) || 0),
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
        supportedMedia,
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
        supportedMedia,
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
        obj.category = item?.basicInformation?.category?.name;
        obj.mediaOwner = item?.basicInformation?.mediaOwner?.name || '-';
        obj.peer = item?.basicInformation?.peerMediaOwner || '-';
        obj.dimension = `${item.specifications?.size?.width || 0}ft x ${
          item.specifications?.size?.height || 0
        }ft`;
        obj.unit = item?.specifications?.unit || '-';
        obj.impression = item?.specifications?.impressions?.max || 0;
        obj.health = item?.specifications?.health;
        obj.location = item?.location;
        obj.mediaType = item?.basicInformation?.mediaType?.name;
        obj.supportedMedia = item?.basicInformation?.supportedMedia;
        obj.price = item?.basicInformation?.price;
        obj.landlord_name = item?.basicInformation?.mediaOwner?.name;
        obj.illuminations = item?.specifications?.illuminations?.name;
        obj.resolutions = item?.specifications?.resolutions;
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
