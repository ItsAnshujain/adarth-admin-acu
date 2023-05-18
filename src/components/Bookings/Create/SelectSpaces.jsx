import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Image,
  NumberInput,
  Progress,
  Badge,
  Loader,
  Chip,
  HoverCard,
  Text,
  Group,
} from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { Link, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { Dropzone } from '@mantine/dropzone';
import { useDebouncedValue } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import { useFetchInventory } from '../../../hooks/inventory.hooks';
import upload from '../../../assets/upload.svg';
import { useFormContext } from '../../../context/formContext';
import { categoryColors, getDate, supportedTypes } from '../../../utils';
import { useUploadFile } from '../../../hooks/upload.hooks';
import Filter from '../../Inventory/Filter';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';
import DateRangeSelector from '../../DateRangeSelector';

dayjs.extend(isBetween);

const updatedSupportedTypes = [...supportedTypes, 'MP4'];

const styles = {
  padding: 0,
  border: 'none',
};

const UploadButton = ({ updateData, isActive, id, hasMedia = false }) => {
  const openRef = useRef(null);
  const { mutateAsync: uploadMedia, isLoading } = useUploadFile();
  const handleUpload = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await uploadMedia(formData);

    if (res?.[0].Location) {
      updateData('media', res[0].Location, id);
    }
  };

  return (
    <>
      <Dropzone
        style={styles}
        onDrop={handleUpload}
        multiple={false}
        disabled={!isActive || isLoading}
        openRef={openRef}
        maxSize={5000000}
      >
        {/* children */}
      </Dropzone>
      <HoverCard openDelay={1000}>
        <HoverCard.Target>
          <Button
            disabled={isLoading}
            onClick={() => openRef.current()}
            loading={isLoading}
            className={classNames(
              isActive ? 'bg-purple-350 cursor-pointer' : 'bg-purple-200 cursor-not-allowed',
              'py-1 px-2 h-[70%] flex items-center gap-2 text-white rounded-md',
            )}
          >
            {hasMedia ? (
              <>
                <Chip
                  classNames={{ checkIcon: 'text-white', label: 'bg-transparent' }}
                  checked
                  variant="filled"
                  color="green"
                  radius="lg"
                  size="xs"
                />
                {isLoading ? 'Uploading' : 'Uploaded'}
              </>
            ) : isLoading ? (
              'Uploading'
            ) : (
              'Upload'
            )}
            <img src={upload} alt="Upload" className="ml-2" />
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <div className="text-sm flex flex-col">
            <span className="font-bold text-gray-500">Supported types</span>
            <div className="mt-1">
              {updatedSupportedTypes.map(item => (
                <Badge key={uuidv4()} className="mr-2">
                  {item}
                </Badge>
              ))}
            </div>
            <p className="mt-1 font-bold text-gray-500">Video size cannot be more than 5MB</p>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

const SelectSpace = () => {
  const { setFieldValue, values } = useFormContext();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
    'isUnderMaintenance': false,
    isActive: true,
  });
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');
  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());

  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const getTotalPrice = (places = []) => {
    const totalPrice = places.reduce((acc, item) => acc + +(item.price || 0), 0);
    return totalPrice;
  };

  const updateData = (key, val, id) => {
    if (key === 'dateRange') {
      setUpdatedInventoryData(prev =>
        prev.map(item =>
          item._id === id ? { ...item, startDate: val[0], endDate: val[1] } : item,
        ),
      );

      setFieldValue(
        'place',
        values.place.map(item =>
          item._id === id ? { ...item, startDate: val[0], endDate: val[1] } : item,
        ),
      );
    } else {
      setUpdatedInventoryData(prev =>
        prev.map(item => (item._id === id ? { ...item, [key]: val } : item)),
      );

      setFieldValue(
        'place',
        values.place.map(item => (item._id === id ? { ...item, [key]: val } : item)),
      );
    }
  };

  const handleSelection = selectedRows => setFieldValue('place', selectedRows);

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
            original: { photo, spaceName, isUnderMaintenance, bookingRange, _id },
          },
        }) =>
          useMemo(() => {
            const isOccupied = bookingRange?.some(
              item =>
                dayjs().isBetween(item?.startDate, item?.endDate) ||
                dayjs().isSame(dayjs(item?.endDate), 'day'),
            );

            return (
              <div className="grid grid-cols-2 gap-2 items-center">
                <div className="flex flex-1 gap-2 items-center w-44">
                  <Image
                    withPlaceholder
                    height={30}
                    width={30}
                    fit="cover"
                    className="rounded overflow-hidden"
                    src={photo}
                    alt={spaceName}
                  />
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
                </div>
                <div className="w-fit">
                  <Badge
                    className="capitalize"
                    variant="filled"
                    color={isUnderMaintenance ? 'yellow' : isOccupied ? 'blue' : 'green'}
                  >
                    {isUnderMaintenance
                      ? 'Under Maintenance'
                      : isOccupied
                      ? 'Occupied'
                      : 'Available'}
                  </Badge>
                </div>
              </div>
            );
          }, [isUnderMaintenance]),
      },
      {
        Header: 'INVENTORY ID',
        accessor: 'inventoryId',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{info.row.original.inventoryId || '-'}</p>, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'basicInformation.mediaOwner.name',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <p className="w-fit">{mediaOwner}</p>, []),
      },
      {
        Header: 'UPLOAD MEDIA',
        accessor: '',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { _id },
          },
        }) =>
          useMemo(
            () => (
              <UploadButton
                updateData={updateData}
                isActive={values?.place?.find(item => item._id === _id)}
                hasMedia={values?.place?.find(item => (item._id === _id ? !!item?.media : false))}
                id={_id}
              />
            ),
            [],
          ),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
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
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { impressionMax },
          },
        }) => useMemo(() => <p>{`${impressionMax || 0}+`}</p>, []),
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
        }) => useMemo(() => <p>{location || '-'}</p>, []),
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
            original: { price, _id },
          },
        }) =>
          useMemo(
            () => (
              <NumberInput
                hideControls
                defaultValue={+(price || 0)}
                onBlur={e => updateData('price', e.target.value, _id)}
              />
            ),
            [],
          ),
      },
      {
        Header: 'OCCUPANCY DATE',
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
                    !!values?.place?.find(item => item._id === _id) && (!startDate || !endDate)
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
    [updatedInventoryData, values?.place],
  );

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? pages : 1);
    setSearchParams(searchParams);
  };

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

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (inventoryData) {
      const { docs, ...page } = inventoryData;
      const finalData = [];

      for (const item of docs) {
        const selectionItem = values?.place?.find(pl => pl._id === item._id);

        const obj = {};
        obj.photo = item.basicInformation.spacePhoto;
        obj._id = item._id;
        obj.spaceName = item.basicInformation?.spaceName;
        obj.inventoryId = item?.inventoryId;
        obj.isUnderMaintenance = item?.isUnderMaintenance;
        obj.category = item.basicInformation?.category?.name;
        obj.mediaOwner =
          item?.createdBy && !item.createdBy?.isPeer
            ? item?.basicInformation?.mediaOwner?.name
            : '-';
        obj.peer =
          item?.createdBy && item.createdBy?.isPeer
            ? item?.basicInformation?.mediaOwner?.name
            : '-';
        obj.dimension = `${item.specifications?.size?.width || 0}ft x ${
          item.specifications?.size?.height || 0
        }ft`;
        obj.impressionMax = item.specifications?.impressions?.max || 0;
        obj.impressionMin = item.specifications?.impressions?.min || 0;
        obj.health = item?.specifications?.health ?? 0;
        obj.location = item?.location?.city;
        obj.mediaType = item.basicInformation?.mediaType?.name;
        obj.price = item.basicInformation?.price || 0;
        obj.campaigns = item?.campaigns;
        obj.startDate = getDate(selectionItem, item, 'startDate');
        obj.endDate = getDate(selectionItem, item, 'endDate');
        obj.bookingRange = item?.bookingRange ? item.bookingRange : [];
        finalData.push(obj);
      }

      setUpdatedInventoryData(finalData);
      setPagination(page);
    }
  }, [inventoryData]);

  useEffect(() => {
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  return (
    <>
      <div className="flex gap-2 pt-4 flex-col pl-5 pr-7">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">Select Place for Order</p>
          </div>
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
            <Group>
              <p className="font-bold">{toIndianCurrency(getTotalPrice(values?.place))}</p>
              <p className="text-xs">**additional gst to be included</p>
            </Group>
          </div>
        </div>
        <div className="flex justify-between mb-4 items-center">
          <p className="text-purple-450 text-sm">
            Total Places{' '}
            {inventoryData?.totalDocs ? (
              <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
                {inventoryData.totalDocs}
              </span>
            ) : null}
          </p>
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
          selectedRowData={values?.place}
          handleSorting={handleSortByColumn}
          activePage={pagination.page}
          totalPages={pagination.totalPages}
          setActivePage={handlePagination}
        />
      ) : null}
    </>
  );
};

export default SelectSpace;
