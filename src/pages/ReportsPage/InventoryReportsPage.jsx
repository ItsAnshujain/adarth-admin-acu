import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Badge, Image, Loader, Tabs, Text } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { useDebouncedValue } from '@mantine/hooks';
import classNames from 'classnames';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import Header from '../../components/modules/reports/Header';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import Search from '../../components/Search';
import BestIcon from '../../assets/best-performing-inventory.svg';
import WorstIcon from '../../assets/worst-performing-inventory.svg';
import toIndianCurrency from '../../utils/currencyFormat';
import SpacesMenuPopover from '../../components/Popovers/SpacesMenuPopover';
import {
  useFetchInventoryReportList,
  useInventoryReport,
  useInventoryStats,
} from '../../apis/queries/inventory.queries';
import ViewByFilter from '../../components/modules/reports/ViewByFilter';
import InventoryStatsContent from '../../components/modules/reports/Inventory/InventoryStatsContent';
import SubHeader from '../../components/modules/reports/Inventory/SubHeader';
import {
  categoryColors,
  daysInAWeek,
  downloadPdf,
  financialEndDate,
  financialStartDate,
  generateSlNo,
  monthsInShort,
  quarters,
  serialize,
} from '../../utils';
import { useShareReport } from '../../apis/queries/report.queries';
import modalConfig from '../../utils/modalConfig';
import ShareContent from '../../components/modules/reports/ShareContent';
import { DATE_FORMAT } from '../../utils/constants';
import SpaceNamePhotoContent from '../../components/modules/inventory/SpaceNamePhotoContent';

dayjs.extend(quarterOfYear);

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: '',
    close: 'mr-4',
  },
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

const config = {
  type: 'line',
  options: { responsive: true },
};

const unwantedQueriesForReveueGraph = [
  'limit',
  'page',
  'sortOrder',
  'sortBy',
  'owner',
  'category',
  'subCategory',
  'mediaType',
  'tier',
  'minPrice',
  'maxPrice',
  'zone',
  'minFootFall',
  'maxFootfall',
  'facing',
  'tags',
  'demographic',
  'audience',
  'search',
  'from',
  'to',
];

const unwantedQuriesForInventories = ['groupBy', 'startDate', 'endDate'];

const InventoryReportsPage = () => {
  const modals = useModals();
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
    page: 1,
    sortOrder: 'desc',
    sortBy: 'basicInformation.spaceName',
    startDate: financialStartDate,
    endDate: financialEndDate,
    groupBy: 'month',
  });
  const chartRef = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchInput, 800);

  const [areaData, setAreaData] = useState({
    id: uuidv4(),
    labels: monthsInShort,
    datasets: [
      {
        label: 'Revenue',
        data: [],
        borderColor: '#914EFB',
        cubicInterpolationMode: 'monotone',
      },
    ],
  });

  const removeUnwantedQueries = removeArr => {
    const params = [...searchParams];
    let updatedParams = params.filter(elem => !removeArr.includes(elem[0]));
    updatedParams = Object.fromEntries(updatedParams);
    return serialize(updatedParams);
  };

  const { data: inventoryStats, isLoading: isInventoryStatsLoading } = useInventoryStats('');
  const {
    data: inventoryReports,
    isLoading: isInventoryReportLoading,
    isSuccess,
  } = useInventoryReport(removeUnwantedQueries(unwantedQueriesForReveueGraph));
  const { data: inventoryReportList, isLoading: inventoryReportListLoading } =
    useFetchInventoryReportList(removeUnwantedQueries(unwantedQuriesForInventories));
  const { mutateAsync, isLoading: isDownloadLoading } = useShareReport();

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const share = searchParams.get('share');
  const groupBy = searchParams.get('groupBy');

  const handleViewBy = viewType => {
    if (viewType === 'reset' || viewType === 'year') {
      const startDate = financialStartDate;
      const endDate = financialEndDate;
      searchParams.set('startDate', startDate);
      searchParams.set('endDate', endDate);
      searchParams.set('groupBy', 'month');
      setSearchParams(searchParams);
    }
    if (viewType === 'week' || viewType === 'month') {
      const startDate = dayjs().startOf(viewType).format(DATE_FORMAT);
      const endDate = dayjs().endOf(viewType).format(DATE_FORMAT);

      searchParams.set('startDate', startDate);
      searchParams.set('endDate', endDate);
      searchParams.set(
        'groupBy',
        viewType === 'month' ? 'dayOfMonth' : viewType === 'week' ? 'dayOfWeek' : 'month',
      );
      setSearchParams(searchParams);
    }
    if (viewType === 'quarter') {
      searchParams.set('startDate', financialStartDate);
      searchParams.set('endDate', financialEndDate);
      searchParams.set('groupBy', 'quarter');
      setSearchParams(searchParams);
    }
  };

  const togglePreviewModal = imgSrc =>
    modals.openModal({
      title: 'Preview',
      children: (
        <Image src={imgSrc || null} height={580} alt="preview" withPlaceholder={!!imgSrc} />
      ),
      ...updatedModalConfig,
    });

  const inventoryHealthStatus = useMemo(
    () => ({
      datasets: [
        {
          data: [inventoryStats?.unHealthy ?? 0, inventoryStats?.healthy ?? 0],
          backgroundColor: ['#FF900E', '#914EFB'],
          borderColor: ['#FF900E', '#914EFB'],
          borderWidth: 1,
        },
      ],
    }),
    [inventoryStats],
  );

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
              togglePreviewModal={togglePreviewModal}
              isTargetBlank
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
          original: { basicInformation },
        },
      }) => useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name || '-'}</p>, []),
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
      Header: 'TOTAL REVENUE',
      accessor: 'revenue',
      Cell: ({
        row: {
          original: { revenue },
        },
      }) => useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(revenue ?? 0)}</p>, []),
    },
    {
      Header: 'TOTAL BOOKING',
      accessor: 'totalBooking',
      Cell: ({
        row: {
          original: { totalBookings },
        },
      }) => useMemo(() => <p className="w-fit">{totalBookings}</p>, []),
    },
    {
      Header: 'TOTAL OPERATIONAL COST',
      accessor: 'operationalCost',
      Cell: ({
        row: {
          original: { operationalCost },
        },
      }) =>
        useMemo(() => <p className="w-fit mr-2">{toIndianCurrency(operationalCost ?? 0)}</p>, []),
    },
    {
      Header: 'DIMENSION (WxH)',
      accessor: 'specifications.size.min',
      disableSortBy: true,
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
      Header: 'UNIT',
      accessor: 'specifications.unit',
      Cell: ({
        row: {
          original: { specifications },
        },
      }) => useMemo(() => <p>{specifications?.unit || '-'}</p>, []),
    },
    {
      Header: 'CITY',
      accessor: 'location.city',
      Cell: ({
        row: {
          original: { location },
        },
      }) => useMemo(() => <p>{location?.city || '-'}</p>, []),
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
            <p>
              {basicInformation?.price
                ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                : 0}
            </p>
          ),
          [],
        ),
    },
    {
      Header: 'FACING',
      accessor: 'location.facing',
      Cell: info => useMemo(() => <p>{info.row.original.location?.facing?.name || '-'}</p>),
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
          () => <SpacesMenuPopover itemId={_id} enableEdit={false} enableDelete={false} />,
          [],
        ),
    },
  ];

  const performingInventoryColumn = [
    {
      Header: '#',
      accessor: 'id',
      disableSortBy: true,
      Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, page, limit)}</p>, []),
    },
    {
      Header: 'SPACE NAME & PHOTO',
      accessor: 'basicInformation.spaceName',
      disableSortBy: true,
      Cell: info =>
        useMemo(
          () => (
            <SpaceNamePhotoContent
              id={info.row.original._id}
              spaceName={info.row.original.basicInformation?.spaceName}
              spacePhoto={info.row.original.basicInformation?.spacePhoto}
              togglePreviewModal={togglePreviewModal}
              isTargetBlank
            />
          ),
          [],
        ),
    },
    {
      Header: 'MEDIA OWNER NAME',
      accessor: 'basicInformation.mediaOwner.name',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) => useMemo(() => <p className="w-fit">{basicInformation?.mediaOwner?.name}</p>, []),
    },
    {
      Header: 'CATEGORY',
      accessor: 'category',
      disableSortBy: true,
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
      Header: 'DIMENSION (WxH)',
      accessor: 'specifications.size.min',
      disableSortBy: true,
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
      Header: 'UNIT',
      accessor: 'specifications.unit',

      Cell: ({
        row: {
          original: { specifications },
        },
      }) => useMemo(() => <p>{specifications?.unit || '-'}</p>, []),
    },
    {
      Header: 'CITY',
      accessor: 'location.city',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { location },
        },
      }) => useMemo(() => <p>{location?.city || '-'}</p>, []),
    },
    {
      Header: 'ROI',
      accessor: 'roiPerDay',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { roiPerDay },
        },
      }) => useMemo(() => <p>{roiPerDay ? Number(roiPerDay).toFixed(2) : 0}</p>, []),
    },
    {
      Header: 'PRICING',
      accessor: 'basicInformation.price',
      disableSortBy: true,
      Cell: ({
        row: {
          original: { basicInformation },
        },
      }) =>
        useMemo(
          () => (
            <p>
              {basicInformation?.price
                ? toIndianCurrency(Number.parseInt(basicInformation?.price, 10))
                : 0}
            </p>
          ),
          [],
        ),
    },
    {
      Header: 'FACING',
      accessor: 'location.facing',
      Cell: info => useMemo(() => <p>{info.row.original.location?.facing?.name || '-'}</p>),
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
          () => <SpacesMenuPopover itemId={_id} enableEdit={false} enableDelete={false} />,
          [],
        ),
    },
  ];

  const calculateLineData = useCallback(() => {
    if (inventoryReports && inventoryReports?.revenue) {
      const tempAreaData = {
        labels: monthsInShort,
        datasets: [
          {
            label: 'Revenue',
            data: [],
            borderColor: '#914EFB',
            backgroundColor: '#914EFB',
            cubicInterpolationMode: 'monotone',
          },
        ],
      };

      tempAreaData.labels =
        groupBy === 'dayOfWeek'
          ? daysInAWeek
          : groupBy === 'dayOfMonth'
          ? Array.from({ length: dayjs().daysInMonth() }, (_, index) => index + 1)
          : groupBy === 'quarter'
          ? quarters
          : monthsInShort;

      tempAreaData.datasets[0].data = Array.from({ length: dayjs().daysInMonth() }, () => 0);

      inventoryReports.revenue?.forEach(item => {
        if (item._id) {
          if (groupBy === 'dayOfMonth' || groupBy === 'dayOfWeek') {
            tempAreaData.datasets[0].data[item._id - 1] = item?.total;
          } else if (groupBy === 'quarter') {
            if (dayjs().quarter() === 1) {
              tempAreaData.datasets[0].data[item._id + 3] = item.total;
            } else if (dayjs().quarter() === 4) {
              tempAreaData.datasets[0].data[item._id - 3] = item.total;
            } else {
              tempAreaData.datasets[0].data[item._id - 1] = item.total;
            }
          } else if (item._id < 4) {
            // For financial year. if the month is less than 4 then it will be in the next year
            tempAreaData.datasets[0].data[item._id + 8] = item.total;
          } else {
            // For financial year. if the month is greater than 4 then it will be in the same year
            tempAreaData.datasets[0].data[item._id - 4] = item.total;
          }
        }
      });

      setAreaData(tempAreaData);
    }
  }, [inventoryReports]);

  const toggleShareOptions = () => {
    modals.openContextModal('basic', {
      title: 'Share via:',
      innerProps: {
        modalBody: <ShareContent />,
      },
      ...modalConfig,
    });
  };

  const handleDownloadPdf = async () => {
    const activeUrl = new URL(window.location.href);
    activeUrl.searchParams.append('share', 'report');

    await mutateAsync(
      { url: activeUrl.toString() },
      {
        onSuccess: data => {
          showNotification({
            title: 'Report has been downloaded successfully',
            color: 'green',
          });
          if (data?.link) {
            downloadPdf(data.link);
          }
        },
      },
    );
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

  const handleSearch = () => {
    searchParams.set('search', debouncedSearch);
    searchParams.set('page', debouncedSearch === '' ? page : 1);
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
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    calculateLineData();
  }, [inventoryReports, isSuccess]);

  return (
    <div
      className={classNames(
        'overflow-y-auto px-5',
        share !== 'report' ? 'col-span-10 ' : 'col-span-12',
      )}
    >
      <Header
        shareType={share}
        text="Inventory Reports"
        onClickDownloadPdf={handleDownloadPdf}
        onClickSharePdf={toggleShareOptions}
        isDownloadLoading={isDownloadLoading}
      />

      <div className="my-5" id="inventory-pdf">
        <InventoryStatsContent
          inventoryReports={inventoryReports}
          inventoryStats={inventoryStats}
        />
        <div className="flex w-full gap-4">
          <div className="w-[70%]">
            <div className="flex justify-between">
              <p className="font-bold">Revenue Graph</p>
              {share !== 'report' ? <ViewByFilter handleViewBy={handleViewBy} /> : null}
            </div>
            {isInventoryReportLoading ? (
              <Loader className="mx-auto mt-10" />
            ) : (
              <div className="max-h-[350px]">
                <Line
                  data={areaData}
                  options={options}
                  ref={chartRef}
                  key={areaData.id}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="w-[30%] flex gap-8 h-[50%] p-4 border items-center rounded-md">
            <div className="w-32">
              {isInventoryStatsLoading ? (
                <Loader className="mx-auto" />
              ) : inventoryStats?.healthy === 0 && inventoryStats?.unHealthy === 0 ? (
                <p className="text-center">NA</p>
              ) : (
                <Doughnut options={config.options} data={inventoryHealthStatus} />
              )}
            </div>
            <div className="flex flex-col">
              <p className="font-medium">Health Status</p>
              <div className="flex flex-col gap-8 mt-4">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
                    <p className="font-bold text-lg">{inventoryStats?.healthy ?? 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
                    <p className="font-bold text-lg">{inventoryStats?.unHealthy ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-4 flex-wrap my-5">
          <div className="border rounded p-8 flex-1">
            <Image src={BestIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Best Performing Inventory</p>
            <p className="font-bold">
              {inventoryStats?.best?.[0]?.basicInformation?.spaceName || '--'}
            </p>
          </div>
          <div className="border rounded p-8 flex-1">
            <Image src={WorstIcon} alt="folder" fit="contain" height={24} width={24} />
            <p className="my-2 text-sm font-light text-slate-400">Worst Performing Inventory</p>
            <p className="font-bold">
              {inventoryStats?.worst?.at(0)?.basicInformation?.spaceName || '--'}
            </p>
          </div>
        </div>
        {share !== 'report' ? (
          <div className="col-span-12 md:col-span-12 lg:col-span-10 border-gray-450">
            <Tabs defaultValue="gallery">
              <Tabs.List>
                <Tabs.Tab value="gallery">
                  <Text size="md" weight="bold">
                    Inventory Report
                  </Text>
                </Tabs.Tab>
                <Tabs.Tab value="messages">
                  <Text size="md" weight="bold">
                    Best Performing Inventory
                  </Text>
                </Tabs.Tab>
                <Tabs.Tab value="settings">
                  <Text size="md" weight="bold">
                    Worst Performing Inventory
                  </Text>
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="gallery">
                <div className="flex justify-between h-20 items-center">
                  <RowsPerPage
                    setCount={currentLimit => handlePagination('limit', currentLimit)}
                    count={limit}
                  />
                  <div className="flex flex-1 justify-end items-center">
                    <Search search={searchInput} setSearch={setSearchInput} />
                    <SubHeader />
                  </div>
                </div>
                {!inventoryReportList?.docs?.length && !inventoryReportListLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryReportList?.docs?.length ? (
                  <Table
                    COLUMNS={inventoryColumn}
                    data={inventoryReportList?.docs || []}
                    handleSorting={handleSortByColumn}
                    activePage={inventoryReportList?.page || 1}
                    totalPages={inventoryReportList?.totalPages || 1}
                    setActivePage={currentPage => handlePagination('page', currentPage)}
                  />
                ) : null}
              </Tabs.Panel>
              <Tabs.Panel value="messages" pt="lg">
                {!inventoryStats?.best?.length && !isInventoryStatsLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryStats?.best?.length ? (
                  <Table
                    COLUMNS={performingInventoryColumn}
                    data={inventoryStats?.best || []}
                    showPagination={false}
                  />
                ) : null}
              </Tabs.Panel>
              <Tabs.Panel value="settings" pt="lg">
                {!inventoryStats?.worst?.length && !isInventoryStatsLoading ? (
                  <div className="w-full min-h-[400px] flex justify-center items-center">
                    <p className="text-xl">No records found</p>
                  </div>
                ) : null}
                {inventoryStats?.worst?.length ? (
                  <Table
                    COLUMNS={performingInventoryColumn}
                    data={inventoryStats?.worst || []}
                    showPagination={false}
                  />
                ) : null}
              </Tabs.Panel>
            </Tabs>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InventoryReportsPage;
