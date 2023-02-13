import { useEffect, useMemo, useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { Link, useSearchParams } from 'react-router-dom';
import { ActionIcon, Badge, Box, Image, Loader, Progress } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import classNames from 'classnames';
import Table from '../../components/Table/Table';
import AreaHeader from '../../components/Inventory/AreaHeader';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import GridView from '../../components/Inventory/Grid';
import MapView from '../../components/Inventory/MapView';
import useLayoutView from '../../store/layout.store';
import { useDeleteInventory, useFetchInventory } from '../../hooks/inventory.hooks';
import toIndianCurrency from '../../utils/currencyFormat';
import modalConfig from '../../utils/modalConfig';
import { colors, ROLES } from '../../utils';
import { FormProvider, useForm } from '../../context/formContext';
import TrashIcon from '../../assets/delete.png';
import RoleBased from '../../components/RoleBased';
import SpacesMenuPopover from '../../components/Popovers/SpacesMenuPopover';

const initialValues = {
  spaces: [],
};

const Home = () => {
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const modals = useModals();
  const [searchParams, setSearchParams] = useSearchParams({
    'limit': 10,
    'page': 1,
    'sortOrder': 'desc',
    'sortBy': 'basicInformation.spaceName',
    // 'isUnderMaintenance': false,
  });
  const form = useForm({ initialValues });
  const viewType = useLayoutView(state => state.activeLayout);
  const { data: inventoryData, isLoading: isInventoryDataLoading } = useFetchInventory(
    searchParams.toString(),
  );
  const { mutate: deleteInventoryData, isLoading: isDeletedInventoryDataLoading } =
    useDeleteInventory();
  const [selectedCards, setSelectedCards] = useState([]);

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

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
            original: { _id, basicInformation, isUnderMaintenance },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2 ">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggleImagePreviewModal(basicInformation?.spacePhoto)}
                >
                  {basicInformation?.spacePhoto ? (
                    <Image src={basicInformation?.spacePhoto} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <Link
                  to={`/inventory/view-details/${_id}`}
                  className="text-black font-medium px-2 max-w-[180px]"
                >
                  <span className="overflow-hidden text-ellipsis">
                    {basicInformation?.spaceName}
                  </span>
                </Link>
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
        accessor: 'basicInformation.mediaOwner.name',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || '-'}</p>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: () => useMemo(() => <p>-</p>),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'basicInformation.spaceType.name',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => {
            const colorType = Object.keys(colors).find(
              key => colors[key] === basicInformation?.spaceType?.name,
            );

            return (
              <div>
                {basicInformation?.spaceType?.name ? (
                  <Badge color={colorType} size="lg" className="capitalize">
                    {basicInformation.spaceType.name}
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
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <p>{`${specifications?.size?.height || 0}ft x ${
                specifications?.size?.width || 0
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
            original: { _id },
          },
        }) => useMemo(() => <SpacesMenuPopover itemId={_id} />, []),
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
    searchParams.set('search', searchInput);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams.set(key, val);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const handleSelection = selectedRows => form.setFieldValue('spaces', selectedRows);

  const handleSubmit = formData => {
    let data = {};
    data = formData.spaces.map(item => item._id);
    if (data.length === 0) {
      showNotification({
        title: 'Please select atleast one place to delete',
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

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className={classNames(viewType.inventory === 'grid' ? 'h-[70%]' : '')}
        >
          <AreaHeader
            text="List of spaces"
            isLoading={isDeletedInventoryDataLoading}
            inventoryData={inventoryData}
          />
          {viewType.inventory !== 'map' && (
            <div className="flex justify-between h-20 items-center pr-7">
              <div className="flex items-center">
                <RowsPerPage
                  setCount={currentLimit => handlePagination('limit', currentLimit)}
                  count={limit}
                />
                <RoleBased
                  acceptedRoles={[ROLES.ADMIN, ROLES.MEDIA_OWNER, ROLES.SUPERVISOR, ROLES.MANAGER]}
                >
                  {isDeletedInventoryDataLoading ? (
                    <p>Inventory deleting...</p>
                  ) : (
                    <ActionIcon size={20} type="submit">
                      <Image src={TrashIcon} />
                    </ActionIcon>
                  )}
                </RoleBased>
              </div>
              <Search search={searchInput} setSearch={setSearchInput} form="nosubmit" />
            </div>
          )}
          {isInventoryDataLoading && viewType.inventory === 'list' ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader />
            </div>
          ) : null}
          {inventoryData?.docs?.length === 0 && !isInventoryDataLoading ? (
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
            <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto mt-5">
              <MapView lists={inventoryData?.docs} />
            </div>
          ) : null}
        </form>
      </FormProvider>
    </div>
  );
};

export default Home;
