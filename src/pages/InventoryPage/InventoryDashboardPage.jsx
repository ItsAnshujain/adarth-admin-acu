import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Link, useSearchParams } from 'react-router-dom';
import { ActionIcon, Badge, Box, Button, Image, Loader, Progress, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import classNames from 'classnames';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import Table from '../../components/Table/Table';
import AreaHeader from '../../components/Inventory/AreaHeader';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import GridView from '../../components/Inventory/Grid';
import MapView from '../../components/Inventory/MapView';
import useLayoutView from '../../store/layout.store';
import {
  useDeleteInventory,
  useFetchInventory,
  useUpdateInventories,
} from '../../hooks/inventory.hooks';
import toIndianCurrency from '../../utils/currencyFormat';
import modalConfig from '../../utils/modalConfig';
import { categoryColors, ROLES } from '../../utils';
import { FormProvider, useForm } from '../../context/formContext';
import TrashIcon from '../../assets/delete.png';
import RoleBased from '../../components/RoleBased';
import SpacesMenuPopover from '../../components/Popovers/SpacesMenuPopover';
import ViewByFilter from '../../pageComponents/Inventory/ViewByFilter';

dayjs.extend(isBetween);

const initialValues = {
  spaces: [],
};

const InventoryDashboardPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);
  const modals = useModals();
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
    isActive: true,
  });
  const form = useForm({ initialValues });
  const viewType = useLayoutView(state => state.activeLayout);
  const { data: inventoryData, isLoading: isInventoryDataLoading } = useFetchInventory(
    searchParams.toString(),
  );
  const { mutate: deleteInventoryData, isLoading: isDeletedInventoryDataLoading } =
    useDeleteInventory();
  const [selectedCards, setSelectedCards] = useState([]);

  const { mutate: update, isLoading: isUpdateInventoryLoading } = useUpdateInventories();

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const isActive = searchParams.get('isActive');

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

  const COLUMNS = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row }) =>
          useMemo(() => {
            let currentPage = page;
            let rowCount = 0;
            if (page < 1) {
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
            original: { _id, basicInformation, isUnderMaintenance, bookingRange },
          },
        }) =>
          useMemo(() => {
            const isOccupied = bookingRange?.some(
              item =>
                dayjs().isBetween(item?.startDate, item?.endDate) ||
                dayjs().isSame(dayjs(item?.endDate), 'day'),
            );

            return (
              <div className="flex items-center justify-between gap-2 w-[380px] mr-4">
                <div className="flex justify-start items-center flex-1">
                  <Box
                    className="bg-white border rounded-md cursor-zoom-in"
                    onClick={() => toggleImagePreviewModal(basicInformation?.spacePhoto)}
                  >
                    {basicInformation?.spacePhoto ? (
                      <Image
                        src={basicInformation?.spacePhoto}
                        alt="banner"
                        height={32}
                        width={32}
                      />
                    ) : (
                      <Image src={null} withPlaceholder height={32} width={32} />
                    )}
                  </Box>
                  <Link
                    to={`/inventory/view-details/${_id}`}
                    className="text-purple-450 font-medium px-2"
                  >
                    <Text
                      className="overflow-hidden text-ellipsis underline"
                      lineClamp={1}
                      title={basicInformation?.spaceName}
                    >
                      {basicInformation?.spaceName}
                    </Text>
                  </Link>
                </div>
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
            original: { createdBy, basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p className="w-fit">
                {createdBy && !createdBy?.isPeer ? basicInformation?.mediaOwner?.name : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: ({
          row: {
            original: { createdBy, basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p className="w-fit">
                {createdBy && createdBy?.isPeer ? basicInformation?.mediaOwner?.name : '-'}
              </p>
            ),
            [],
          ),
      },
      {
        Header: 'CATEGORY',
        accessor: 'basicInformation.category.name',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(categoryColors).find(
              key => categoryColors[key] === basicInformation?.category?.name,
            );

            return (
              <div>
                {basicInformation?.category?.name ? (
                  <Badge color={colorType} size="lg" className="capitalize">
                    {basicInformation.category.name}
                  </Badge>
                ) : (
                  '-'
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
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <p>{`${specifications?.size?.width || 0}ft x ${
                specifications?.size?.height || 0
              }ft`}</p>
            ),
            [],
          ),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'specifications.impressions.max',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) => useMemo(() => <p>{`${specifications?.impressions?.max || 0}+`}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'specifications.health',
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
        accessor: 'location.city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city || '-'}</p>, []),
      },
      {
        Header: 'MEDIA TYPE',
        accessor: 'basicInformation.mediaType.name',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) => useMemo(() => <p>{basicInformation?.mediaType?.name || '-'}</p>),
      },
      {
        Header: 'PRICING',
        accessor: 'basicInformation.price',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p className="pl-2">
                {basicInformation?.price
                  ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                  : 0}
              </p>
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
            original: { _id, createdBy },
          },
        }) =>
          useMemo(
            () => (
              <SpacesMenuPopover
                itemId={_id}
                enableDelete={createdBy && !createdBy?.isPeer}
                enableEdit={createdBy && !createdBy?.isPeer}
              />
            ),
            [],
          ),
      },
    ],
    [inventoryData?.docs],
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

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? page : 1);
    if (debouncedSearch !== '') {
      searchParams.delete('sortBy');
      searchParams.delete('sortOrder');
    }
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const handleSelection = selectedRows => form.setFieldValue('spaces', selectedRows);

  const handleDeleteInventories = formData => {
    let data = {};
    data = formData.spaces.map(item => item._id);
    if (!data.length) {
      showNotification({
        title: 'Please select atleast one space to delete',
        color: 'blue',
      });
      return;
    }

    deleteInventoryData(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const handleToggleInventories = (formData, state) => {
    let data = {};
    data = formData.spaces.map(item => item._id);
    if (!data.length) {
      showNotification({
        title: 'Please select atleast one space to disable',
        color: 'blue',
      });
      return;
    }

    update(
      { inventoryId: data, data: { isActive: state } },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  const handleViewBy = type => {
    searchParams.set('isActive', type === 'active');
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (debouncedSearch === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [debouncedSearch]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form className={classNames(viewType.inventory === 'grid' ? 'h-[70%]' : '')}>
          <AreaHeader text="List of spaces" inventoryData={inventoryData} />
          <div className="flex justify-between h-20 items-center pr-7">
            <div className="flex items-center">
              <RowsPerPage
                setCount={currentLimit => handlePagination('limit', currentLimit)}
                count={limit}
              />
              {viewType.inventory !== 'map' && (
                <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGEMENT]}>
                  {isDeletedInventoryDataLoading ? (
                    <p>Inventory deleting...</p>
                  ) : (
                    <ActionIcon size={20} onClick={form.onSubmit(e => handleDeleteInventories(e))}>
                      <Image src={TrashIcon} />
                    </ActionIcon>
                  )}

                  {isActive === 'true' ? (
                    <Button
                      className="secondary-button ml-4"
                      onClick={form.onSubmit(e => handleToggleInventories(e, false))}
                      loading={isUpdateInventoryLoading}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      className="secondary-button ml-4"
                      onClick={form.onSubmit(e => handleToggleInventories(e, true))}
                      loading={isUpdateInventoryLoading}
                    >
                      Enable
                    </Button>
                  )}
                </RoleBased>
              )}
            </div>

            <section className="flex gap-3">
              {viewType.inventory !== 'map' && (
                <Search
                  search={searchInput}
                  setSearch={setSearchInput}
                  form="nosubmit"
                  className="min-w-[400px]"
                />
              )}
              <ViewByFilter handleViewBy={handleViewBy} />
            </section>
          </div>
          {isInventoryDataLoading && viewType.inventory === 'list' ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader />
            </div>
          ) : null}
          {!inventoryData?.docs?.length &&
          !isInventoryDataLoading &&
          viewType.inventory !== 'map' ? (
            <div className="w-full min-h-[400px] flex justify-center items-center">
              <p className="text-xl">No records found</p>
            </div>
          ) : null}
          {viewType.inventory === 'grid' && inventoryData?.docs?.length ? (
            <GridView
              list={inventoryData?.docs || []}
              activePage={inventoryData?.page}
              totalPages={inventoryData?.totalPages}
              setActivePage={currentPage => handlePagination('page', currentPage)}
              isLoadingList={isInventoryDataLoading || isDeletedInventoryDataLoading}
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
            />
          ) : viewType.inventory === 'list' && inventoryData?.docs?.length ? (
            <Table
              data={inventoryData?.docs || []}
              COLUMNS={COLUMNS}
              allowRowsSelect
              setSelectedFlatRows={handleSelection}
              selectedRowData={form.values?.spaces}
              handleSorting={handleSortByColumn}
              activePage={inventoryData?.page || 1}
              totalPages={inventoryData?.totalPages || 1}
              setActivePage={currentPage => handlePagination('page', currentPage)}
            />
          ) : viewType.inventory === 'map' ? (
            <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
              <MapView lists={inventoryData?.docs} />
            </div>
          ) : null}
        </form>
      </FormProvider>
    </div>
  );
};

export default InventoryDashboardPage;
