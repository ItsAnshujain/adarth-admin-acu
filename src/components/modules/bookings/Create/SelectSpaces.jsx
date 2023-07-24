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
  Box,
  Tooltip,
} from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { Link, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { Dropzone } from '@mantine/dropzone';
import { useDebouncedValue } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { useModals } from '@mantine/modals';
import { getWord } from 'num-count';
import shallow from 'zustand/shallow';
import Search from '../../../Search';
import toIndianCurrency from '../../../../utils/currencyFormat';
import Table from '../../../Table/Table';
import { useFetchInventory } from '../../../../apis/queries/inventory.queries';
import upload from '../../../../assets/upload.svg';
import { useFormContext } from '../../../../context/formContext';
import {
  categoryColors,
  currentDate,
  debounce,
  generateSlNo,
  getAvailableUnits,
  getDate,
  getOccupiedState,
  getOccupiedStateColor,
  stringToColour,
  supportedTypes,
  validateFilterRange,
} from '../../../../utils';
import { useUploadFile } from '../../../../apis/queries/upload.queries';
import Filter from '../../inventory/Filter';
import SpacesMenuPopover from '../../../Popovers/SpacesMenuPopover';
import DateRangeSelector from '../../../DateRangeSelector';
import modalConfig from '../../../../utils/modalConfig';
import RowsPerPage from '../../../RowsPerPage';
import useLayoutView from '../../../../store/layout.store';

dayjs.extend(isBetween);

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: '',
    close: 'mr-4',
  },
};

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
            <p className="mt-1 font-bold text-gray-500">Media size cannot be more than 5MB</p>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

const SelectSpace = () => {
  const modals = useModals();
  const { setFieldValue, values } = useFormContext();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const { activeLayout, setActiveLayout } = useLayoutView(
    state => ({
      activeLayout: state.activeLayout,
      setActiveLayout: state.setActiveLayout,
    }),
    shallow,
  );
  const [searchParams, setSearchParams] = useSearchParams({
    limit: activeLayout.inventoryLimit || 20,
    page: 1,
    sortOrder: 'desc',
    sortBy: 'basicInformation.spaceName',
    isUnderMaintenance: false,
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

  const updateData = debounce((key, val, id) => {
    if (key === 'dateRange') {
      let availableUnit = 0;
      const hasChangedUnit = values.place.find(item => item._id === id)?.hasChangedUnit;
      setUpdatedInventoryData(prev => {
        const newList = [...prev];
        const index = newList.findIndex(item => item._id === id);
        newList[index] = { ...newList[index], startDate: val[0], endDate: val[1] };
        const filterRange = validateFilterRange(newList[index].bookingRange, val[0], val[1]);
        availableUnit = getAvailableUnits(filterRange, newList[index].originalUnit, id);
        newList[index] = { ...newList[index], availableUnit };

        return newList;
      });

      setFieldValue(
        'place',
        values.place.map(item =>
          item._id === id
            ? {
                ...item,
                startDate: val[0],
                endDate: val[1],
                ...(!hasChangedUnit ? { unit: availableUnit } : {}),
                availableUnit,
              }
            : item,
        ),
      );
    } else {
      setUpdatedInventoryData(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, [key]: val, ...(key === 'unit' ? { hasChangedUnit: true } : {}) }
            : item,
        ),
      );

      setFieldValue(
        'place',
        values.place.map(item =>
          item._id === id
            ? { ...item, [key]: val, ...(key === 'unit' ? { hasChangedUnit: true } : {}) }
            : item,
        ),
      );
    }
  }, 500);

  const handleSelection = selectedRows => setFieldValue('place', selectedRows);

  const togglePreviewModal = imgSrc =>
    modals.openModal({
      title: 'Preview',
      children: (
        <Image src={imgSrc || null} height={580} alt="preview" withPlaceholder={!!imgSrc} />
      ),
      ...updatedModalConfig,
    });

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
            const { photo, spaceName, isUnderMaintenance, bookingRange, originalUnit, _id } =
              info.row.original;
            const filterRange = validateFilterRange(bookingRange, currentDate, currentDate);

            const leftUnit = getAvailableUnits(filterRange, originalUnit, _id);

            const occupiedState = getOccupiedState(leftUnit, originalUnit);

            return (
              <div className="flex items-center justify-between gap-2 w-96 mr-4">
                <div className="flex justify-start items-center flex-1">
                  <Box
                    className={classNames(
                      'bg-white border rounded-md',
                      photo ? 'cursor-zoom-in' : '',
                    )}
                    onClick={() => (photo ? togglePreviewModal(photo) : null)}
                  >
                    {photo ? (
                      <Image src={photo} alt="banner" height={32} width={32} />
                    ) : (
                      <Image src={null} withPlaceholder height={32} width={32} />
                    )}
                  </Box>
                  <Link
                    to={`/inventory/view-details/${_id}`}
                    className="text-purple-450 font-medium px-2"
                    target="_blank"
                  >
                    <Text
                      className="overflow-hidden text-ellipsis underline"
                      lineClamp={1}
                      title={spaceName}
                    >
                      {spaceName}
                    </Text>
                  </Link>
                </div>
                <Badge
                  className="capitalize"
                  variant="filled"
                  color={getOccupiedStateColor(isUnderMaintenance, occupiedState)}
                >
                  {isUnderMaintenance ? 'Under Maintenance' : occupiedState}
                </Badge>
              </div>
            );
          }, [info.row.original.isUnderMaintenance]),
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
        }) => useMemo(() => <p>{location || '-'}</p>, []),
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
        Header: 'OCCUPANCY DATE',
        accessor: 'scheduledDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { bookingRange, startDate, endDate, _id },
          },
        }) =>
          useMemo(() => {
            const isDisabled =
              values?.place?.some(item => item._id === _id) && (!startDate || !endDate);

            return (
              <div className="min-w-[300px]">
                <DateRangeSelector
                  error={isDisabled}
                  dateValue={[startDate || null, endDate || null]}
                  onChange={val => updateData('dateRange', val, _id)}
                  dateRange={bookingRange}
                />
              </div>
            );
          }, []),
      },
      {
        Header: 'UNIT',
        accessor: 'specifications.unit',
        Cell: ({
          row: {
            original: { unit, startDate, endDate, _id, availableUnit },
          },
        }) =>
          useMemo(() => {
            const isDisabled = !values?.place?.some(
              item => item._id === _id && item.startDate !== null && item.endDate !== null,
            );
            const available = values?.place?.find(item => item._id === _id)?.availableUnit;
            const bookable = values?.place?.find(item => item._id === _id)?.unit;
            const hasChangedUnit = values?.place?.find(item => item._id === _id)?.hasChangedUnit;
            const isExceeded = bookable > available;

            return (
              <Tooltip
                label="Exceeded maximum units available for selected date range"
                opened={isExceeded}
                transition="slide-left"
                position="right"
                color="red"
                radius="sm"
                withArrow
              >
                <NumberInput
                  hideControls
                  defaultValue={!hasChangedUnit ? Number(bookable || 0) : unit}
                  min={1}
                  onChange={e => updateData('unit', e, _id)}
                  className="w-[100px]"
                  disabled={isDisabled}
                  error={isExceeded}
                />
              </Tooltip>
            );
          }, [startDate, endDate, unit, availableUnit]),
      },
      {
        Header: 'TRADED AMOUNT',
        accessor: 'tradedAmount',
        Cell: info =>
          useMemo(
            () => (
              <NumberInput
                hideControls
                defaultValue={+(info.row.original.tradedAmount || 0)}
                onBlur={e => updateData('tradedAmount', e.target.value, info.row.original._id)}
                disabled={info.row.original.peer === '-'}
              />
            ),
            [],
          ),
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
        Header: 'MEDIA OWNER NAME',
        accessor: 'basicInformation.mediaOwner.name',
        Cell: ({
          row: {
            original: { mediaOwner },
          },
        }) => useMemo(() => <p className="w-fit">{mediaOwner}</p>, []),
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
        Header: 'INVENTORY ID',
        accessor: 'inventoryId',
        Cell: info => useMemo(() => <p>{info.row.original.inventoryId || '-'}</p>, []),
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
            original: { impressionMax },
          },
        }) =>
          useMemo(
            () => (
              <p className="capitalize w-32">{impressionMax ? getWord(impressionMax) : 'NA'}</p>
            ),
            [],
          ),
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

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
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
        obj.originalUnit = item?.specifications?.unit || '-';
        obj.unit = item?.specifications?.unit || '-';
        obj.impressionMax = item.specifications?.impressions?.max || 0;
        obj.impressionMin = item.specifications?.impressions?.min || 0;
        obj.health = item?.specifications?.health ?? 0;
        obj.faciaTowards = item?.location?.faciaTowards;
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
      <div className="flex gap-2 py-5 flex-col">
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
        <div className="flex justify-between items-center">
          <Group>
            <RowsPerPage
              setCount={currentLimit => {
                handlePagination('limit', currentLimit);
                setActiveLayout({ ...activeLayout, inventoryLimit: currentLimit });
              }}
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
          selectedRowData={values?.place}
          handleSorting={handleSortByColumn}
          activePage={pagination.page}
          totalPages={pagination.totalPages}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : null}
    </>
  );
};

export default SelectSpace;
