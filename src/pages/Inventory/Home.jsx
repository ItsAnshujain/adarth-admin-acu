import { useState, useEffect, useMemo } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Button, Image, Progress } from '@mantine/core';
import Table from '../../components/Table/Table';
import AreaHeader from '../../components/Inventory/AreaHeader';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import GridView from '../../components/GridView';
import MapView from '../../components/Inventory/MapView';
import useLayoutView from '../../store/layout.store';
import { useFetchInventory } from '../../hooks/inventory.hooks';
import MenuPopover from '../../components/Inventory/MenuPopover';
import { serialize } from '../../utils';
import toIndianCurrency from '../../utils/currencyFormat';

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useDebouncedState('', 1000);
  const [count, setCount] = useState('10');
  const [searchParams] = useSearchParams();
  const viewType = useLayoutView(state => state.activeLayout);
  const [updatedInventoryList, setUpdatedInventoryList] = useState([]);
  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
  });
  const { data: inventoryData, isLoading: isLoadingInventoryData } = useFetchInventory(
    serialize(query),
  );

  const page = searchParams.get('page');

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
            rowCount = (currentPage - 1) * count;
            return <div className="pl-2">{rowCount + row.index + 1}</div>;
          }, []),
      },
      {
        Header: 'SPACE NAME & PHOTO',
        accessor: 'spaceName',
        Cell: tableProps =>
          useMemo(() => {
            const { spacePhotos, spaceName, _id } = tableProps.row.original;

            return (
              <div className="flex items-center gap-2">
                <div className="bg-white border rounded-md">
                  {spacePhotos ? (
                    <Image src={spacePhotos} alt="banner" height={32} width={32} />
                  ) : (
                    <Image src={null} withPlaceholder height={32} width={32} />
                  )}
                </div>
                <Button
                  className="text-black font-medium px-2"
                  onClick={() =>
                    navigate(`/inventory/view-details/${_id}`, {
                      replace: true,
                    })
                  }
                >
                  {spaceName}
                </Button>
                <Badge className="capitalize" variant="filled" color="green">
                  Available
                </Badge>
              </div>
            );
          }, []),
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
      },
      {
        Header: 'IMPRESSION',
        accessor: 'impressions',
      },
      {
        Header: 'HEALTH STATUS',
        accessor: 'health_status',
        Cell: tableProps =>
          useMemo(() => {
            const { health } = tableProps.row.original;
            return (
              <div className="w-24">
                <Progress
                  sections={[
                    { value: health, color: 'green' },
                    { value: 100 - health, color: 'red' },
                  ]}
                />
              </div>
            );
          }, []),
      },
      {
        Header: 'LOCATION',
        accessor: 'city',
      },
      {
        Header: 'PRICING',
        accessor: 'price',
        Cell: ({ row }) =>
          useMemo(
            () => (
              <div className="pl-2">
                {row.original.price ? toIndianCurrency(row.original.price) : 0}
              </div>
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
    [updatedInventoryList],
  );

  const handlePagination = currentPage => {
    const queries = serialize({
      ...query,
      limit: count,
      page: currentPage,
    });
    navigate(`/inventory?${queries}`);
  };

  const formattedData = () => {
    const updatedList = [];
    const tempList = [...inventoryData.docs];
    tempList?.map(row => {
      const rowObj = {
        ...row?.basicInformation,
        ...row?.location,
        health: row?.specifications?.health,
        impressions: `${row?.specifications?.impressions?.max}+`,
        dimension: `${row?.specifications?.resolutions?.height}ft x ${row?.specifications?.resolutions?.width}ft`,
        _id: row?._id,
      };

      return updatedList.push(rowObj);
    });
    setUpdatedInventoryList(updatedList);
  };

  useEffect(() => {
    if (inventoryData?.docs) {
      formattedData();
    }
  }, [inventoryData]);

  useEffect(() => {
    setQuery({ ...query, spaceName: search });
  }, [search]);

  useEffect(() => {
    const limit = parseInt(count, 10);
    setQuery({ ...query, limit });
  }, [count]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <AreaHeader text="List of spaces" />
      {viewType !== 'map' && (
        <div className="flex justify-between h-20 items-center pr-7">
          <RowsPerPage setCount={setCount} count={count} />
          <Search search={search} setSearch={setSearch} />
        </div>
      )}
      {viewType === 'grid' ? (
        <GridView
          count={count}
          list={inventoryData?.docs || []}
          activePage={inventoryData?.page}
          totalPages={inventoryData?.totalPages}
          setActivePage={handlePagination}
          isLoadingList={isLoadingInventoryData}
        />
      ) : viewType === 'list' ? (
        <Table
          COLUMNS={COLUMNS}
          dummy={updatedInventoryList || []}
          activePage={inventoryData?.page || 1}
          totalPages={inventoryData?.totalPages || 1}
          setActivePage={handlePagination}
          rowCountLimit={count}
        />
      ) : viewType === 'map' ? (
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto mt-5">
          <MapView lists={updatedInventoryList} />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
