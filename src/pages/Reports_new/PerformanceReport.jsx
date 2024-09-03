import { useEffect, useMemo } from 'react';
import { Badge } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useModals } from '@mantine/modals';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFetchInventoryReportList } from '../../apis/queries/inventory.queries';
import { categoryColors, generateSlNo } from '../../utils';
import modalConfig from '../../utils/modalConfig';
import SpaceNamePhotoContent from '../../components/modules/inventory/SpaceNamePhotoContent';
import InventoryPreviewImage from '../../components/shared/InventoryPreviewImage';
import PerformanceCard from '../../components/modules/newReports/performanceCard';


const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4 font-bold',
    header: 'p-4',
    body: '',
    close: 'mr-4 text-black',
  },
};

const PerformanceReport = () => {
  const modals = useModals();
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 20,
    page: 1,
    sortOrder: 'desc',
    sortBy: 'revenue',
  });

  const { data: inventoryReportList, isLoading: inventoryReportListLoading } =
    useFetchInventoryReportList(searchParams.toString());

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const togglePreviewModal = (imgSrc, inventoryName, dimensions, location) =>
    modals.openModal({
      title: 'Preview',
      children: (
        <InventoryPreviewImage
          imgSrc={imgSrc}
          inventoryName={inventoryName}
          dimensions={dimensions}
          location={location}
        />
      ),
      ...updatedModalConfig,
    });

  const inventoryColumn = [
    {
      Header: '#',
      accessor: 'id',
      disableSortBy: true,
      Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
    },
    {
      Header: 'SPACE NAME & PHOTO',
      accessor: 'basicInformation.spaceName',
      Cell: info =>
        useMemo(
          () => (
            <SpaceNamePhotoContent
              id={info.row.original._id}
              spaceName={info.row.original.basicInformation?.spaceName}
              spacePhoto={info.row.original.basicInformation?.spacePhoto}
              dimensions={info.row.original.specifications?.size}
              location={info.row.original.location?.city}
              togglePreviewModal={togglePreviewModal}
              isTargetBlank
            />
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
                <Badge color={colorType || 'gray'} size="lg" className="capitalize">
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
      Header: 'TOTAL REVENUE (In lac)',
      accessor: 'revenue',
      Cell: ({
        row: {
          original: { revenue },
        },
      }) =>
        useMemo(() => {
          const revenueInLacs = (revenue ?? 0) / 100000; // Convert revenue to lacs
          return <p className="w-fit mr-2">{toIndianCurrency(revenueInLacs)}</p>;
        }, []),
    },
    {
      Header: 'TOTAL BOOKING',
      accessor: 'totalBookings',
      Cell: ({
        row: {
          original: { totalBookings },
        },
      }) => useMemo(() => <p className="w-fit">{totalBookings}</p>, [totalBookings]),
    },
  ];

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
    setSearchParams(searchParams);
  }, [searchParams]);

 
  return (
    <div className="overflow-y-auto px-5 col-span-10">
      <PerformanceCard/>

      <div className="col-span-12 md:col-span-12 lg:col-span-10 border-gray-450">
        <div className="flex justify-between h-20 items-center">
          <RowsPerPage
            setCount={currentLimit => handlePagination('limit', currentLimit)}
            count={limit}
          />
        </div>

        <Table
          COLUMNS={inventoryColumn}
          data={inventoryReportList?.docs || []}
          handleSorting={handleSortByColumn}
          activePage={inventoryReportList?.page || 1}
          totalPages={inventoryReportList?.totalPages || 1}
          setActivePage={currentPage => handlePagination('page', currentPage)}
          loading={inventoryReportListLoading}
        />
      </div>
    </div>
  );
};

export default PerformanceReport;
