import { useMemo, useState, useEffect } from 'react';
import {
  Text,
  Button,
  Progress,
  Image,
  NumberInput,
  Badge,
  Loader,
  Group,
  Box,
  Tooltip,
} from '@mantine/core';
import { ChevronDown } from 'react-feather';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { Link, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import classNames from 'classnames';
import { getWord } from 'num-count';
import { v4 as uuidv4 } from 'uuid';
import shallow from 'zustand/shallow';
import Search from '../../Search';
import toIndianCurrency from '../../../utils/currencyFormat';
import Table from '../../Table/Table';
import { useFetchInventory } from '../../../apis/queries/inventory.queries';
import {
  categoryColors,
  currentDate,
  debounce,
  generateSlNo,
  getAvailableUnits,
  getDate,
  getOccupiedState,
  stringToColour,
  validateFilterRange,
} from '../../../utils';
import Filter from '../inventory/Filter';
import { useFormContext } from '../../../context/formContext';
import SpacesMenuPopover from '../../Popovers/SpacesMenuPopover';
import DateRangeSelector from '../../DateRangeSelector';
import RowsPerPage from '../../RowsPerPage';
import modalConfig from '../../../utils/modalConfig';
import useLayoutView from '../../../store/layout.store';

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

const Spaces = () => {
  const modals = useModals();
  const { values, setFieldValue } = useFormContext();
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
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [showFilter, setShowFilter] = useState(false);
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');
  const { data: inventoryData, isLoading } = useFetchInventory(searchParams.toString());

  const toggleFilter = () => setShowFilter(!showFilter);

  const updateData = debounce((key, val, id) => {
    if (key === 'dateRange') {
      let availableUnit = 0;
      const hasChangedUnit = values.spaces.find(item => item._id === id)?.hasChangedUnit;
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
        'spaces',
        values.spaces.map(item =>
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
        'spaces',
        values.spaces.map(item =>
          item._id === id
            ? { ...item, [key]: val, ...(key === 'unit' ? { hasChangedUnit: true } : {}) }
            : item,
        ),
      );
    }
  }, 500);

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
        Cell: ({
          row: {
            original: { _id, spaceName, spacePhoto, isUnderMaintenance, bookingRange, unit },
          },
        }) =>
          useMemo(() => {
            const filterRange = validateFilterRange(bookingRange, currentDate, currentDate);

            const leftUnit = getAvailableUnits(filterRange, unit, _id);

            const occupiedState = getOccupiedState(leftUnit, unit);

            return (
              <div className="flex items-center justify-between gap-2 w-96 mr-4">
                <div className="flex justify-start items-center flex-1">
                  <Box
                    className={classNames(
                      'bg-white border rounded-md',
                      spacePhoto ? 'cursor-zoom-in' : '',
                    )}
                    onClick={() => (spacePhoto ? togglePreviewModal(spacePhoto) : null)}
                  >
                    {spacePhoto ? (
                      <Image src={spacePhoto} alt="banner" height={32} width={32} />
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
                  color={
                    isUnderMaintenance
                      ? 'yellow'
                      : occupiedState === 'Occupied'
                      ? 'blue'
                      : occupiedState === 'Partially Booked'
                      ? 'grape'
                      : occupiedState === 'Available'
                      ? 'green'
                      : 'dark'
                  }
                >
                  {isUnderMaintenance ? 'Under Maintenance' : occupiedState}
                </Badge>
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
          useMemo(() => {
            const isDisabled =
              values?.spaces?.some(item => item._id === _id) && (!startDate || !endDate);

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
            const isDisabled = !values?.spaces?.some(
              item => item._id === _id && item.startDate !== null && item.endDate !== null,
            );
            const available = values?.spaces?.find(item => item._id === _id)?.availableUnit;
            const bookable = values?.spaces?.find(item => item._id === _id)?.unit;
            const hasChangedUnit = values?.spaces?.find(item => item._id === _id)?.hasChangedUnit;
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
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
        Cell: ({
          row: {
            original: { mediaType },
          },
        }) => useMemo(() => <p>{mediaType || '-'}</p>),
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
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { impressions },
          },
        }) =>
          useMemo(
            () => <p className="capitalize w-32">{impressions ? getWord(impressions) : 'NA'}</p>,
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
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? pages : 1);
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
        const selectionItem = values?.spaces?.find(pl => pl._id === item._id);

        const obj = {};
        obj._id = item._id;
        obj.spaceName = item?.basicInformation?.spaceName;
        obj.spacePhoto = item?.basicInformation?.spacePhoto;
        obj.inventoryId = item?.inventoryId;
        obj.isUnderMaintenance = item?.isUnderMaintenance;
        obj.mediaOwner = item?.basicInformation?.mediaOwner?.name || '-';
        obj.peer = item?.basicInformation?.peerMediaOwner || '-';
        obj.originalUnit = item?.specifications?.unit || '-';
        obj.unit = item?.specifications?.unit || '-';
        obj.additionalTags = item?.specifications?.additionalTags;
        obj.category = item?.basicInformation?.category?.name;
        obj.subCategory = item?.basicInformation?.subCategory?.name;
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
        obj.impressions = item?.specifications?.impressions?.max;
        obj.health = item?.specifications?.health;
        obj.location = item?.location?.city;
        obj.faciaTowards = item?.location?.faciaTowards;
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
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  return (
    <>
      <div className="flex gap-2 py-5 flex-col">
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
        <div className="flex justify-between items-center">
          <Group>
            <RowsPerPage
              setCount={currentLimit => {
                handlePagination('limit', currentLimit);
                setActiveLayout({ ...activeLayout, inventoryLimit: currentLimit });
              }}
              count={limit}
            />
            <Text size="sm" className="text-purple-450">
              Total Places{' '}
              {inventoryData?.totalDocs ? (
                <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
                  {inventoryData.totalDocs}
                </span>
              ) : null}
            </Text>
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
          selectedRowData={values.spaces}
          handleSorting={handleSortByColumn}
          activePage={pagination.page}
          totalPages={pagination.totalPages}
          setActivePage={currentPage => handlePagination('page', currentPage)}
        />
      ) : null}
    </>
  );
};

export default Spaces;
