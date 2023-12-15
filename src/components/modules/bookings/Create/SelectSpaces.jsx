import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Image, NumberInput, Loader, Group, Tooltip } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import { useModals } from '@mantine/modals';
import shallow from 'zustand/shallow';
import { useFormContext } from 'react-hook-form';
import Search from '../../../Search';
import toIndianCurrency from '../../../../utils/currencyFormat';
import Table from '../../../Table/Table';
import { useFetchInventory } from '../../../../apis/queries/inventory.queries';
import {
  calculateTotalPrice,
  currentDate,
  debounce,
  generateSlNo,
  getAvailableUnits,
  getDate,
  getEveryDayUnits,
  getOccupiedState,
} from '../../../../utils';
import Filter from '../../inventory/Filter';
import SpacesMenuPopover from '../../../Popovers/SpacesMenuPopover';
import DateRangeSelector from '../../../DateRangeSelector';
import modalConfig from '../../../../utils/modalConfig';
import RowsPerPage from '../../../RowsPerPage';
import useLayoutView from '../../../../store/layout.store';
import SpaceNamePhotoContent from '../../inventory/SpaceNamePhotoContent';
import AdditionalTagsContent from '../../inventory/AdditionalTagsContent';
import CategoryContent from '../../inventory/CategoryContent';
import SubCategoryContent from '../../inventory/SubCategoryContent';
import ImpressionContent from '../../inventory/ImpressionContent';
import UploadMediaContent from '../../inventory/UploadMediaContent';
import DimensionContent from '../../inventory/DimensionContent';

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

const SelectSpace = () => {
  const modals = useModals();
  const { id: bookingId } = useParams();
  const form = useFormContext();
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
    sortBy: 'createdAt',
    isUnderMaintenance: false,
    isActive: true,
  });
  const pages = searchParams.get('page');
  const limit = searchParams.get('limit');
  const inventoryQuery = useFetchInventory(searchParams.toString());

  const [updatedInventoryData, setUpdatedInventoryData] = useState([]);

  const watchPlace = form.watch('place') || [];

  const updateData = debounce((key, val, id, inputId) => {
    if (key === 'dateRange') {
      let availableUnit = 0;
      const hasChangedUnit = watchPlace.find(item => item._id === id)?.hasChangedUnit;
      setUpdatedInventoryData(prev => {
        const newList = [...prev];
        const index = newList.findIndex(item => item._id === id);
        newList[index] = { ...newList[index], startDate: val[0], endDate: val[1] };
        availableUnit = getAvailableUnits(
          newList[index].bookingRange,
          newList[index].startDate,
          newList[index].endDate,
          newList[index].originalUnit,
        );
        newList[index] = { ...newList[index], availableUnit };

        return newList;
      });

      form.setValue(
        'place',
        watchPlace.map(item =>
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

      form.setValue(
        'place',
        watchPlace.map(item =>
          item._id === id
            ? { ...item, [key]: val, ...(key === 'unit' ? { hasChangedUnit: true } : {}) }
            : item,
        ),
      );

      if (inputId) {
        setTimeout(() => document.querySelector(`#${inputId}`)?.focus());
      }
    }
  }, 500);

  const memoizedCalculateTotalPrice = useMemo(
    () => calculateTotalPrice(watchPlace),
    [watchPlace.length, updateData],
  );

  const handleSortRowsOnTop = (ids, rows) => {
    setUpdatedInventoryData(() => {
      const arr1 = [];
      const arr2 = [];
      rows.forEach(item => {
        if (ids.includes(item._id)) {
          arr1.push(item);
        } else {
          arr2.push(item);
        }
      });

      return [...arr1, ...arr2];
    });
  };

  const handleSelection = selectedRows => {
    handleSortRowsOnTop(
      selectedRows?.map(item => item._id),
      updatedInventoryData,
    );

    form.setValue('place', selectedRows);
  };

  const togglePreviewModal = imgSrc =>
    modals.openModal({
      title: 'Preview',
      children: (
        <Image src={imgSrc || null} height={580} alt="preview" withPlaceholder={!!imgSrc} />
      ),
      ...updatedModalConfig,
    });

  // Table Cell
  const RenderSerialNumberCell = useCallback(
    ({ row }) => generateSlNo(row.index, pages, limit),
    [pages, limit],
  );

  const RenderNameCell = useCallback(({ row }) => {
    const { photo, spaceName, isUnderMaintenance, bookingRange, originalUnit, _id } = row.original;
    const unitLeft = getAvailableUnits(bookingRange, currentDate, currentDate, originalUnit);
    const occupiedState = getOccupiedState(unitLeft, originalUnit);

    return (
      <SpaceNamePhotoContent
        id={_id}
        spaceName={spaceName}
        spacePhoto={photo}
        occupiedStateLabel={occupiedState}
        isUnderMaintenance={isUnderMaintenance}
        togglePreviewModal={togglePreviewModal}
        isTargetBlank
      />
    );
  }, []);

  const RenderFaciaTowardsCell = useCallback(({ row }) => row.original.faciaTowards || '-', []);

  const RenderCityCell = useCallback(({ row }) => row.original.location || '-', []);

  const RenderAdditionalTagsCell = useCallback(
    ({ row }) => <AdditionalTagsContent list={row.original.additionalTags || []} />,
    [],
  );

  const RenderCategoryCell = useCallback(
    ({ row }) => <CategoryContent category={row.original.category} />,
    [],
  );

  const RenderSubCategoryCell = useCallback(
    ({ row }) => <SubCategoryContent subCategory={row.original.subCategory} />,
    [],
  );

  const RenderDimensionCell = useCallback(
    ({ row }) => <DimensionContent list={row.original.dimension} />,
    [],
  );

  const RenderMediaOwnerCell = useCallback(({ row }) => row.original.mediaOwner || '-', []);

  const RenderPeerCell = useCallback(({ row }) => row.original.peer || '-', []);

  const RenderInventoryIdCell = useCallback(({ row }) => row.original.inventoryId || '-', []);

  const RenderMediaTypeCell = useCallback(({ row }) => row.original.mediaType || '-', []);

  const RenderImpressionCell = useCallback(
    ({ row }) => <ImpressionContent impressionMax={row.original.impressionMax || 0} />,
    [],
  );

  const RenderUploadMediaCell = useCallback(
    ({ row }) => <UploadMediaContent id={row.original._id} updateData={updateData} />,
    [updateData],
  );

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: RenderSerialNumberCell,
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'basicInformation.spaceName',
        Cell: RenderNameCell,
      },
      {
        Header: 'FACIA TOWARDS',
        accessor: 'location.faciaTowards',
        disableSortBy: true,
        Cell: RenderFaciaTowardsCell,
      },
      {
        Header: 'CITY',
        accessor: 'location.city',
        Cell: RenderCityCell,
      },
      {
        Header: 'ADDITIONAL TAGS',
        accessor: 'specifications.additionalTags',
        disableSortBy: true,
        Cell: RenderAdditionalTagsCell,
      },
      {
        Header: 'CATEGORY',
        accessor: 'basicInformation.category.name',
        Cell: RenderCategoryCell,
      },
      {
        Header: 'SUB CATEGORY',
        accessor: 'basicInformation.subCategory.name',
        Cell: RenderSubCategoryCell,
      },
      {
        Header: 'DIMENSION (WxH)',
        accessor: 'specifications.size.min',
        disableSortBy: true,
        Cell: RenderDimensionCell,
      },
      {
        Header: 'OCCUPANCY DATE',
        accessor: 'scheduledDate',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { bookingRange, startDate, endDate, unit, _id },
          },
        }) =>
          useMemo(() => {
            const isDisabled =
              watchPlace?.some(item => item._id === _id) && (!startDate || !endDate);
            const everyDayUnitsData = getEveryDayUnits(bookingRange, unit);

            return (
              <div className="min-w-[300px]">
                <DateRangeSelector
                  error={isDisabled}
                  dateValue={[startDate || null, endDate || null]}
                  onChange={val => updateData('dateRange', val, _id)}
                  everyDayUnitsData={everyDayUnitsData}
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
            original: { bookingRange, unit, startDate, endDate, _id, availableUnit, originalUnit },
          },
        }) =>
          useMemo(() => {
            const isDisabled = !watchPlace?.some(
              item => item._id === _id && item.startDate !== null && item.endDate !== null,
            );
            const unitLeft = getAvailableUnits(bookingRange, startDate, endDate, originalUnit);
            const data = watchPlace ? watchPlace.find(item => item._id === _id) : {};
            const isExceeded =
              data?.unit > (bookingId ? unitLeft + (data?.initialUnit || 0) : data?.availableUnit);

            return (
              <Tooltip
                label={
                  data?.hasChangedUnit && isExceeded
                    ? 'Exceeded maximum units available for selected date range'
                    : !unit
                    ? 'Field cannot be empty'
                    : null
                }
                opened={(data?.hasChangedUnit && isExceeded) || !unit}
                transition="slide-left"
                position="right"
                color="red"
                radius="sm"
                withArrow
              >
                <NumberInput
                  id={`unit-${_id}`}
                  hideControls
                  defaultValue={!data?.hasChangedUnit ? Number(data?.unit || 0) : unit}
                  min={1}
                  onChange={e => updateData('unit', e, _id, `unit-${_id}`)}
                  className="w-[100px]"
                  disabled={isDisabled}
                  error={(data?.hasChangedUnit && isExceeded) || !unit}
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
                id={`tradedAmount-${info.row.original._id}`}
                hideControls
                defaultValue={+(info.row.original.tradedAmount || 0)}
                onChange={e =>
                  updateData(
                    'tradedAmount',
                    e,
                    info.row.original._id,
                    `tradedAmount-${info.row.original._id}`,
                  )
                }
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
          useMemo(() => {
            const isPriceZero =
              watchPlace?.some(item => item._id === _id) && (price === 0 || !price);

            return (
              <NumberInput
                id={`price-${_id}`}
                hideControls
                defaultValue={+(price || 0)}
                onChange={e => updateData('price', e, _id, `price-${_id}`)}
                error={isPriceZero}
              />
            );
          }, []),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'basicInformation.mediaOwner.name',
        Cell: RenderMediaOwnerCell,
      },
      {
        Header: 'PEER',
        accessor: 'basicInformation.peerMediaOwner',
        Cell: RenderPeerCell,
      },
      {
        Header: 'INVENTORY ID',
        accessor: 'inventoryId',
        Cell: RenderInventoryIdCell,
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'basicInformation.mediaType.name',
        Cell: RenderMediaTypeCell,
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: RenderImpressionCell,
      },
      {
        Header: 'UPLOAD MEDIA',
        accessor: '',
        disableSortBy: true,
        Cell: RenderUploadMediaCell,
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        disableSortBy: true,
        Cell: info =>
          useMemo(
            () => (
              <SpacesMenuPopover
                itemId={info.row.original._id}
                enableDelete={false}
                openInNewWindow
              />
            ),
            [],
          ),
      },
    ],
    [updatedInventoryData, watchPlace.length],
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
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (inventoryQuery.data?.docs) {
      const { docs, ...page } = inventoryQuery.data;
      const finalData = [];

      for (const item of docs) {
        const selectionItem = watchPlace?.find(pl => pl._id === item._id);

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
        obj.dimension = item.specifications?.size;
        obj.originalUnit = item?.specifications?.unit || 1;
        obj.unit = item?.specifications?.unit || 1;
        obj.impressionMax = item.specifications?.impressions?.max || 0;
        obj.impressionMin = item.specifications?.impressions?.min || 0;
        obj.faciaTowards = item?.location?.faciaTowards;
        obj.location = item?.location?.city;
        obj.mediaType = item.basicInformation?.mediaType?.name;
        obj.price = selectionItem?.price ?? (item?.basicInformation?.price || 0);
        obj.tradedAmount = selectionItem?.tradedAmount ?? 0;
        obj.campaigns = item?.campaigns;
        obj.startDate = getDate(selectionItem, item, 'startDate');
        obj.endDate = getDate(selectionItem, item, 'endDate');
        obj.bookingRange = item?.bookingRange ? item.bookingRange : [];
        finalData.push(obj);
      }

      handleSortRowsOnTop(
        watchPlace?.map(item => item._id),
        finalData,
      );
      setPagination(page);
    }
  }, [inventoryQuery.data?.docs]);

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
            <p className="font-bold">{watchPlace?.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Total Price</p>
            <Group>
              <p className="font-bold">{toIndianCurrency(memoizedCalculateTotalPrice)}</p>
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
              {inventoryQuery.data?.totalDocs ? (
                <span className="bg-purple-450 text-white py-1 px-2 rounded-full ml-2">
                  {inventoryQuery.data?.totalDocs}
                </span>
              ) : null}
            </p>
          </Group>
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      </div>
      {inventoryQuery.isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {!inventoryQuery.data?.docs?.length && !inventoryQuery.isLoading ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {inventoryQuery.data?.docs?.length ? (
        <Table
          data={updatedInventoryData}
          COLUMNS={COLUMNS}
          allowRowsSelect
          setSelectedFlatRows={handleSelection}
          selectedRowData={watchPlace}
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
