import { useEffect, useMemo } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Box, Button, Image, Progress } from '@mantine/core';
import { useModals } from '@mantine/modals';
import Table from '../../components/Table/Table';
import AreaHeader from '../../components/Inventory/AreaHeader';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import GridView from '../../components/GridView';
import MapView from '../../components/Inventory/MapView';
import useLayoutView from '../../store/layout.store';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import MenuPopover from '../../components/Inventory/MenuPopover';
import toIndianCurrency from '../../utils/currencyFormat';
import modalConfig from '../../utils/modalConfig';

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useDebouncedState('', 1000);
  const modals = useModals();
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
    page: 1,
  });
  const viewType = useLayoutView(state => state.activeLayout);
  const { data: inventoryData, isLoading: isLoadingInventoryData } = useFetchInventory(
    `${searchParams.toString()}`,
  );

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const toggletImagePreviewModal = imgSrc =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box className=" flex justify-center" onClickCancel={id => modals.closeModal(id)}>
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
        accessor: 'spaceName',
        Cell: ({
          row: {
            original: { _id, basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggletImagePreviewModal(basicInformation?.spacePhotos)}
                >
                  {basicInformation?.spacePhotos ? (
                    <Image
                      src={basicInformation?.spacePhotos}
                      alt="banner"
                      height={32}
                      width={32}
                    />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </Box>
                <Button
                  className="text-black font-medium px-2"
                  onClick={() =>
                    navigate(`/inventory/view-details/${_id}`, {
                      replace: true,
                    })
                  }
                >
                  {basicInformation?.spaceName}
                </Button>
                <Badge className="capitalize" variant="filled" color="green">
                  Available
                </Badge>
              </div>
            ),
            [],
          ),
      },
      {
        Header: 'MEDIA OWNER NAME',
        accessor: 'landlord_name',
        Cell: tableProps =>
          useMemo(() => <div className="w-fit">{tableProps.row.original.landlord_name}</div>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
      },
      {
        Header: 'DIMENSION',
        accessor: 'dimension',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) =>
          useMemo(
            () => (
              <p>{`${specifications?.resolutions?.height}ft x ${specifications?.resolutions?.width}ft`}</p>
            ),
            [],
          ),
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions',
        Cell: ({
          row: {
            original: { specifications },
          },
        }) => useMemo(() => <p>{`${specifications?.impressions?.max}+`}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'health_status',
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
        accessor: 'city',
        Cell: ({
          row: {
            original: { location },
          },
        }) => useMemo(() => <p>{location?.city}</p>, []),
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(
            () => (
              <p className="pl-2">
                {basicInformation?.price ? toIndianCurrency(basicInformation?.price) : 0}
              </p>
            ),
            [],
          ),
      },
      {
        Header: '',
        accessor: 'details',
        Cell: tableProps =>
          useMemo(() => {
            const { _id } = tableProps.row.original;

            return <MenuPopover itemId={_id} />;
          }, []),
      },
    ],
    [inventoryData?.docs],
  );

  const handleSearch = () => {
    searchParams.set('spaceName', searchInput);
    setSearchParams(searchParams);
  };

  const handleRowCount = currentLimit => {
    searchParams.set('limit', currentLimit);
    setSearchParams(searchParams);
  };

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    handleSearch();
    if (searchInput === '') {
      searchParams.delete('spaceName');
      setSearchParams(searchParams);
    }
  }, [searchInput]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="List of spaces" />
      {viewType !== 'map' && (
        <div className="flex justify-between h-20 items-center pr-7">
          <RowsPerPage setCount={handleRowCount} count={limit} />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      )}
      {viewType === 'grid' ? (
        <GridView
          count={limit}
          list={inventoryData?.docs || []}
          activePage={inventoryData?.page}
          totalPages={inventoryData?.totalPages}
          setActivePage={handlePagination}
          isLoadingList={isLoadingInventoryData}
        />
      ) : viewType === 'list' ? (
        <Table
          COLUMNS={COLUMNS}
          dummy={inventoryData?.docs || []}
          activePage={inventoryData?.page || 1}
          totalPages={inventoryData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
        />
      ) : viewType === 'map' ? (
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto mt-5">
          <MapView lists={inventoryData?.docs} />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
