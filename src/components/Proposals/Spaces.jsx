import { useMemo, useState, useEffect } from 'react';
import { Text, Button, Progress, Image, NumberInput, Badge, Box, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedState } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import Search from '../Search';
import toIndianCurrency from '../../utils/currencyFormat';
import Table from '../Table/Table';
import MenuPopover from './MenuPopover';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import { colors } from '../../utils';
import modalConfig from '../../utils/modalConfig';
import Filter from '../Inventory/Filter';
import { useFormContext } from '../../context/formContext';

const getDate = (selectionItem, item, key, addDefault = true) => {
  if (selectionItem && selectionItem[key]) return new Date(selectionItem[key]);

  if (item && item[key]) return new Date(item.startDate);

  return addDefault ? new Date() : undefined;
};

const Spaces = () => {
  const modals = useModals();
  const { values, setFieldValue } = useFormContext();
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
  });
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());

  const toggleFilter = () => setShowFilter(!showFilter);

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

  const handleInventoryDetails = itemId =>
    window.open(`/inventory/view-details/${itemId}`, '_blank');

  const updateData = (key, val, id) => {
    setUpdatedInventoryData(prev =>
      prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );

    setFieldValue(
      'spaces',
      values.spaces.map(item => (item._id === id ? { ...item, [key]: val } : item)),
    );
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
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { _id, spaceName, spacePhoto, isUnderMaintenance },
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
                <Button
                  className="text-black px-2 font-medium max-w-[180px]"
                  onClick={() => handleInventoryDetails(_id)}
                >
                  <span className="overflow-hidden text-ellipsis">{spaceName}</span>
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
        accessor: 'landlord',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <p className="w-fit">{mediaOwner || 'NA'}</p>, []),
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
        accessor: 'specifications.size.min',
        Cell: ({
          row: {
            original: { height, width },
          },
        }) => useMemo(() => <p>{`${height || 0}ft x ${width || 0}ft`}</p>, []),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.min',
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
        }) => useMemo(() => <p>{mediaType}</p>),
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
        Header: 'START DATE',
        accessor: 'startDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { startDate, _id },
          },
        }) =>
          useMemo(
            () => (
              <DatePicker
                defaultValue={startDate}
                placeholder="DD/MM/YYYY"
                minDate={new Date()}
                onChange={val => updateData('startDate', val, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: 'END DATE',
        accessor: 'endDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { endDate, _id },
          },
        }) =>
          useMemo(
            () => (
              <DatePicker
                defaultValue={endDate}
                placeholder="DD/MM/YYYY"
                minDate={new Date()}
                onChange={val => updateData('endDate', val, _id)}
              />
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
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
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
        obj.peer = item?.basicInformation?.companyName;
        obj.spaceType = item?.basicInformation?.spaceType?.name;
        obj.height = item?.specifications?.size?.height;
        obj.width = item?.specifications?.size?.width;
        obj.impressions = item?.specifications?.impressions?.min;
        obj.health = item?.specifications?.health;
        obj.location = item?.location?.city;
        obj.mediaType = item?.basicInformation?.mediaType?.name;
        obj.price = selectionItem?.price ?? (item?.basicInformation?.price || 0);
        obj.startDate = getDate(selectionItem, item, 'startDate');
        obj.endDate =
          getDate(selectionItem, item, 'endDate', false) || dayjs().add(1, 'day').toDate();
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

  useEffect(() => {
    if (values.startDate && values.endDate) {
      searchParams.set('from', dayjs(values.startDate).format('YYYY-MM-DD'));
      searchParams.set('to', dayjs(values.endDate).format('YYYY-MM-DD'));
      setSearchParams(searchParams);
    }
  }, []);

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
            <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
              {inventoryData?.totalDocs}
            </span>
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
