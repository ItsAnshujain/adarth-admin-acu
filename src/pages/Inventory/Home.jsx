import { useEffect, useMemo, useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Box, Button, Image, Loader, Progress } from '@mantine/core';
import { useModals } from '@mantine/modals';
import Table from '../../components/Table/Table';
import AreaHeader from '../../components/Inventory/AreaHeader';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import GridView from '../../components/GridView';
import MapView from '../../components/Inventory/MapView';
import useLayoutView from '../../store/layout.store';
import { useDeleteInventory, useFetchInventory } from '../../hooks/inventory.hooks';
import MenuPopover from '../../components/Inventory/MenuPopover';
import toIndianCurrency from '../../utils/currencyFormat';
import modalConfig from '../../utils/modalConfig';
import { colors } from '../../utils';

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
    searchParams.toString(),
  );
  const { mutate: deleteInventoryData, isLoading: isLoadingDeletedInventoryData } =
    useDeleteInventory();
  const [selectedCards, setSelectedCards] = useState([]);

  const handleSelectedCards = isCheckedSelected => {
    if (inventoryData?.docs.length > 0 && isCheckedSelected) {
      setSelectedCards(inventoryData?.docs?.map(item => item._id));
    } else {
      setSelectedCards([]);
    }
  };

  const handleDeleteCards = () => {
    deleteInventoryData(selectedCards);
    setSelectedCards([]);
  };

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
            original: { _id, basicInformation, isUnderMaintenance },
          },
        }) =>
          useMemo(
            () => (
              <div className="flex items-center gap-2 ">
                <Box
                  className="bg-white border rounded-md cursor-zoom-in"
                  onClick={() => toggleImagePreviewModal(basicInformation?.spacePhotos)}
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
                  className="text-black font-medium px-2 max-w-[180px]"
                  onClick={() =>
                    navigate(`/inventory/view-details/${_id}`, {
                      replace: true,
                    })
                  }
                >
                  <span className="overflow-hidden text-ellipsis">
                    {basicInformation?.spaceName}
                  </span>
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
        accessor: 'mediaOwner',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || 'NA'}</p>, []),
      },
      {
        Header: 'PEER',
        accessor: 'peer',
        Cell: () => useMemo(() => <p>-</p>),
      },
      {
        Header: 'SPACE TYPE',
        accessor: 'space_type',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) =>
          useMemo(() => {
            const type = basicInformation?.spaceType?.name;
            return (
              <Badge color={colors[type]} size="lg" className="capitalize">
                {type || <span>-</span>}
              </Badge>
            );
          }),
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
              <p>{`${specifications?.size?.height || 0}ft x ${
                specifications?.size?.width || 0
              }ft`}</p>
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
        }) => useMemo(() => <p>{`${specifications?.impressions?.min}+`}</p>, []),
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'health',
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
        Header: 'MEDIA TYPE',
        accessor: 'mediaType',
        Cell: ({
          row: {
            original: { basicInformation },
          },
        }) => useMemo(() => <p>{basicInformation?.mediaType?.name}</p>),
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
        Cell: ({
          row: {
            original: { _id },
          },
        }) => useMemo(() => <MenuPopover itemId={_id} />, []),
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
      <AreaHeader
        text="List of spaces"
        handleSelectedCards={handleSelectedCards}
        noOfCardsSelected={selectedCards?.length}
        totalCards={inventoryData?.docs?.length}
        onDeleteCards={handleDeleteCards}
        isLoading={isLoadingDeletedInventoryData}
      />
      {viewType !== 'map' && (
        <div className="flex justify-between h-20 items-center pr-7">
          <RowsPerPage setCount={handleRowCount} count={limit} />
          <Search search={searchInput} setSearch={setSearchInput} />
        </div>
      )}
      {isLoadingInventoryData && viewType === 'list' ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : null}
      {inventoryData?.docs?.length === 0 && !isLoadingInventoryData ? (
        <div className="w-full min-h-[400px] flex justify-center items-center">
          <p className="text-xl">No records found</p>
        </div>
      ) : null}
      {viewType === 'grid' && inventoryData?.docs?.length ? (
        <GridView
          count={limit}
          list={inventoryData?.docs || []}
          activePage={inventoryData?.page}
          totalPages={inventoryData?.totalPages}
          setActivePage={handlePagination}
          isLoadingList={isLoadingInventoryData || isLoadingDeletedInventoryData}
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
        />
      ) : viewType === 'list' && inventoryData?.docs?.length ? (
        <Table
          COLUMNS={COLUMNS}
          data={inventoryData?.docs || []}
          activePage={inventoryData?.page || 1}
          totalPages={inventoryData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={limit}
          allowRowsSelect
          selectedRowData={selectedCards}
          setSelectedFlatRows={ele => setSelectedCards(ele?.map(itm => itm.original._id))}
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
