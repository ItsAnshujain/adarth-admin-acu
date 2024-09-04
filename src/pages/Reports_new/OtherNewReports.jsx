import { useMemo, useEffect, useState } from 'react';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';
import { useUserSalesByUserId, useBookings } from '../../apis/queries/booking.queries';
import {
  financialEndDate,
  financialStartDate,
  serialize,
  monthsInShort,
  categoryColors,
  generateSlNo,
} from '../../utils';
import { useInfiniteCompanies } from '../../apis/queries/companies.queries';
import useUserStore from '../../store/user.store';
import { Loader } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useFetchMasters } from '../../apis/queries/masters.queries';
import { useFetchOperationalCostData } from '../../apis/queries/operationalCost.queries';
import 'react-datepicker/dist/react-datepicker.css';
import { Menu, Button, Badge } from '@mantine/core';
import classNames from 'classnames';
import DateRangeSelector from '../../components/DateRangeSelector';

import { useModals } from '@mantine/modals';
import Table from '../../components/Table/Table';
import RowsPerPage from '../../components/RowsPerPage';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFetchInventoryReportList } from '../../apis/queries/inventory.queries';
import modalConfig from '../../utils/modalConfig';
import SpaceNamePhotoContent from '../../components/modules/inventory/SpaceNamePhotoContent';
import InventoryPreviewImage from '../../components/shared/InventoryPreviewImage';
import PerformanceCard from '../../components/modules/newReports/performanceCard';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  LogarithmicScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  LogarithmicScale,
);

const viewBy = {
  reset: '',
  past10Years: 'Past 10 Years',
  past5Years: 'Past 5 Years',
  previousYear: 'Previous Year',
  currentYear: 'Current Year',
  quarter: 'Quarterly',
  currentMonth: 'Current Month',
  past7: 'Past 7 Days',
  customDate: 'Custom Date Range',
};

const list = [
  { label: 'Past 10 Years', value: 'past10Years' },
  { label: 'Past 5 Years', value: 'past5Years' },
  { label: 'Previous Year', value: 'previousYear' },
  { label: 'Current Year', value: 'currentYear' },
  { label: 'Quarterly', value: 'quarter' },
  { label: 'Current Month', value: 'currentMonth' },
  { label: 'Past 7 Days', value: 'past7' },
  { label: 'Custom Date Range', value: 'customDate' },
];

const barDataConfigByClient = {
  styles: {
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const normalizeString = str => {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
};
const config = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4 font-bold',
    header: 'p-4',
    body: '',
    close: 'mr-4 text-black',
  },
};
const OtherNewReports = () => {
  const userId = useUserStore(state => state.id);
  const userSales = useUserSalesByUserId({
    startDate: financialStartDate,
    endDate: financialEndDate,
    userId,
  });

  const dummyStats = {
    tradedsite: userSales.data?.totalTradedAmount || 0,
    ownsite: userSales.data?.ownSiteSales || 0,
  };

  const printStatusData = useMemo(
    () => ({
      datasets: [
        {
          data: [dummyStats.tradedsite, dummyStats.ownsite],
          backgroundColor: ['#914EFB', '#FF900E'],
          borderColor: ['#914EFB', '#FF900E'],
          borderWidth: 1,
        },
      ],
    }),
    [dummyStats.tradedsite, dummyStats.ownsite],
  );

  const [searchParams] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const {
    data: bookingData,
    isLoading: isLoadingBookingData,
    error,
  } = useBookings(searchParams.toString());
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (bookingData && bookingData.docs) {
      const aggregatedData = aggregateSalesData(bookingData.docs);
      setSalesData(aggregatedData);
      console.log('Booking Data:', bookingData);
    }
  }, [bookingData, error]);

  const getCurrentYear = () => new Date().getFullYear();

  const aggregateSalesData = data => {
    const currentYear = getCurrentYear();
    const pastYears = [currentYear - 3, currentYear - 2, currentYear - 1];
    const aggregated = {};

    for (let month = 0; month < 12; month++) {
      aggregated[month] = {};
      pastYears.forEach(year => {
        aggregated[month][year] = 0;
      });
    }

    data.forEach(item => {
      try {
        const date = new Date(item.createdAt);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        const month = date.getMonth();
        const year = date.getFullYear();
        const amount = item.totalAmount || 0;

        if (amount <= 0 || isNaN(amount)) {
          return;
        }

        if (pastYears.includes(year)) {
          if (aggregated[month]) {
            aggregated[month][year] += amount / 100000; // Convert to lacs
          }
        }
      } catch (error) {
        console.error('Error processing date:', item.createdAt, error);
      }
    });

    const result = monthsInShort.map((month, index) => ({
      month,
      ...pastYears.reduce(
        (acc, year) => ({
          ...acc,
          [`year${year}`]: aggregated[index][year],
        }),
        {},
      ),
    }));

    return result;
  };

  const currentYear = getCurrentYear();
  const pastYears = [currentYear - 3, currentYear - 2, currentYear - 1];

  const chartData = useMemo(() => {
    return {
      labels: monthsInShort,
      datasets: pastYears.map((year, idx) => ({
        label: year,
        data: salesData.map(data => data[`year${year}`]),
        backgroundColor: `hsl(${(idx * 120) % 360}, 70%, 70%)`, // Dynamic color
        borderColor: `hsl(${(idx * 120) % 360}, 70%, 50%)`,
        borderWidth: 1,
      })),
    };
  }, [salesData, pastYears]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Sales Amount (INR in Lacs)',
          },
          ticks: {
            callback: value => `${value} L`, // Format y-axis labels in lacs
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += `${context.parsed.y} L`; // Show values in lacs in tooltip
              }
              return label;
            },
          },
        },
      },
    }),
    [salesData],
  );

  const parentCompaniesQuery = useInfiniteCompanies({
    page: 1,
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    type: 'lead-company',
    isParent: false,
  });

  const parentCompanies = useMemo(
    () =>
      parentCompaniesQuery.data?.pages
        .reduce((acc, { docs }) => [...acc, ...docs], [])
        .map(doc => ({
          ...doc,
          label: doc.company,
          value: doc._id,
        })) || [],
    [parentCompaniesQuery?.data],
  );

  const aggregatedData = useMemo(() => {
    if (!bookingData || !parentCompanies.length) return {};

    const validCompanyTypes = ['government', 'nationalAgency', 'localAgency', 'directClient'];

    const companyTypeMap = parentCompanies.reduce((acc, company) => {
      const normalizedCompanyName = normalizeString(company.company);
      acc[normalizedCompanyName] = company.companyType;
      return acc;
    }, {});

    const aggregatedAmount = validCompanyTypes.reduce((acc, type) => {
      acc[type] = 0;
      return acc;
    }, {});

    bookingData.docs.forEach(booking => {
      const normalizedBookingCompany = normalizeString(booking.company);
      const companyType = companyTypeMap[normalizedBookingCompany];

      console.log(`Booking Company: ${normalizedBookingCompany}, Mapped Type: ${companyType}`);

      if (companyType && validCompanyTypes.includes(companyType)) {
        aggregatedAmount[companyType] += booking.totalAmount || 0;
      }
    });

    return aggregatedAmount;
  }, [bookingData, parentCompanies]);

  const pieChartData = useMemo(() => {
    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue by Client Type',
          data,
          ...barDataConfigByClient.styles,
        },
      ],
    };
  }, [aggregatedData]);

  const [updatedClient, setUpdatedClient] = useState(pieChartData);

  useEffect(() => {
    if (bookingData && parentCompanies) {
      setUpdatedClient(pieChartData);
    }
  }, [pieChartData, bookingData, parentCompanies]);

  const { data: operationalCostTypes } = useFetchMasters(
    serialize({
      type: 'operational_cost_type',
      limit: 100,
      page: 1,
      sortBy: 'name',
      sortOrder: 'asc',
    }),
  );

  const { data: operationalCostData } = useFetchOperationalCostData();

  const totalAmountsByType = useMemo(() => {
    if (!operationalCostData || !operationalCostTypes) return {};

    return operationalCostTypes.docs.reduce((acc, type) => {
      const total = operationalCostData
        .filter(item => item.type.name === type.name)
        .reduce((sum, item) => sum + parseFloat(item.amount) || 0, 0);

      return {
        ...acc,
        [type.name]: total,
      };
    }, {});
  }, [operationalCostData, operationalCostTypes]);

  const chartLabels = Object.keys(totalAmountsByType);
  const chartData2 = Object.values(totalAmountsByType);

  const doughnutChartData = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: 'Operational Costs',
          data: chartData2,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#BB9AB1',
            '#6482AD',
            '#BC9F8B',
            '#FFAD60',
            '#4E31AA',
            '#7FA1C3',
            '#8C3061',
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#BB9AB1',
            '#6482AD',
            '#BC9F8B',
            '#FFAD60',
            '#4E31AA',
            '#7FA1C3',
            '#8C3061',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [chartLabels, chartData]);

  const [filter, setFilter] = useState('');
  const [activeView, setActiveView] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const generateYearRange = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const sortMonths = (a, b) => {
    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
  };

  const transformedData = useMemo(() => {
    if (!bookingData || !bookingData.docs) return {};

    const currentYear = new Date().getFullYear();
    const past10YearsRange = generateYearRange(currentYear - 10, currentYear - 1);
    const past5YearsRange = generateYearRange(currentYear - 5, currentYear - 1);

    const groupedData = bookingData.docs.reduce((acc, booking) => {
      const date = new Date(booking.createdAt);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      const revenue = booking.totalAmount;

      if (!acc.past10Years) acc.past10Years = {};
      if (!acc.past5Years) acc.past5Years = {};
      if (!acc.previousYear) acc.previousYear = {};
      if (!acc.currentYear) acc.currentYear = {};
      if (!acc.quarter) acc.quarter = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
      if (!acc.currentMonth) acc.currentMonth = {};
      if (!acc.past7) acc.past7 = {};
      if (!acc.customDate) acc.customDate = {};

      if (year >= currentYear - 10 && year < currentYear) {
        if (!acc.past10Years[year]) acc.past10Years[year] = 0;
        acc.past10Years[year] += revenue;
      }

      if (year >= currentYear - 5 && year < currentYear) {
        if (!acc.past5Years[year]) acc.past5Years[year] = 0;
        acc.past5Years[year] += revenue;
      }

      if (year === currentYear - 1) {
        if (!acc.previousYear[month]) acc.previousYear[month] = 0;
        acc.previousYear[month] += revenue;
      }

      if (year === currentYear) {
        if (!acc.currentYear[month]) acc.currentYear[month] = 0;
        acc.currentYear[month] += revenue;
      }

      if (year === currentYear && date.getMonth() === new Date().getMonth()) {
        if (!acc.currentMonth[day]) acc.currentMonth[day] = 0;
        acc.currentMonth[day] += revenue;
      }

      const last7DaysDate = new Date();
      last7DaysDate.setDate(last7DaysDate.getDate() - 7);
      if (date >= last7DaysDate) {
        if (!acc.past7[day]) acc.past7[day] = 0;
        acc.past7[day] += revenue;
      }

      if (['Jan', 'Feb', 'Mar'].includes(month)) acc.quarter.Q1 += revenue;
      if (['Apr', 'May', 'Jun'].includes(month)) acc.quarter.Q2 += revenue;
      if (['Jul', 'Aug', 'Sep'].includes(month)) acc.quarter.Q3 += revenue;
      if (['Oct', 'Nov', 'Dec'].includes(month)) acc.quarter.Q4 += revenue;

      if (startDate && endDate && date >= startDate && date <= endDate) {
        const key = `${month} ${day}`;
        if (!acc.customDate[key]) acc.customDate[key] = 0;
        acc.customDate[key] += revenue;
      }

      return acc;
    }, {});

    groupedData.past10Years = past10YearsRange.map(year => ({
      year,
      revenue: groupedData.past10Years[year] || 0,
    }));

    groupedData.past5Years = past5YearsRange.map(year => ({
      year,
      revenue: groupedData.past5Years[year] || 0,
    }));

    groupedData.previousYear = Object.keys(groupedData.previousYear)
      .sort(sortMonths)
      .map(month => ({
        month,
        revenue: groupedData.previousYear[month],
      }));

    groupedData.currentYear = Object.keys(groupedData.currentYear)
      .sort(sortMonths)
      .map(month => ({
        month,
        revenue: groupedData.currentYear[month],
      }));

    groupedData.currentMonth = Object.keys(groupedData.currentMonth).map(day => ({
      day,
      revenue: groupedData.currentMonth[day],
    }));

    groupedData.past7 = Object.keys(groupedData.past7)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(day => ({
        day,
        revenue: groupedData.past7[day],
      }));

    groupedData.customDate = Object.keys(groupedData.customDate).map(key => ({
      day: key,
      revenue: groupedData.customDate[key],
    }));

    groupedData.quarter = Object.keys(groupedData.quarter).map(quarter => ({
      quarter,
      revenue: groupedData.quarter[quarter],
    }));

    return groupedData;
  }, [bookingData, startDate, endDate]);

  const chartData1 = useMemo(() => {
    let selectedData = transformedData[filter] || [];
    const filteredData = selectedData.map(d => ({
      ...d,
      revenue: d.revenue > 0 ? d.revenue / 100000 : 0, // Convert to lacs
    }));

    if (filter === 'customDate') {
      filteredData.sort((a, b) => new Date(a.day) - new Date(b.day));
    }

    return {
      labels: filteredData.map(d => d.year || d.month || d.quarter || d.day),
      datasets: [
        {
          label: 'Revenue (in Lacs)',
          data: filteredData.map(d => d.revenue),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };
  }, [transformedData, filter]);

  const chartOptions1 = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: filter.includes('Year')
              ? 'Year'
              : filter === 'past7' || filter === 'customDate'
              ? 'Date'
              : 'Month',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Revenue (INR in Lacs)',
          },
          ticks: {
            callback: value => `${value} L`, // Format tick values in lacs
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += `${context.parsed.y} L`;
              }
              return label;
            },
          },
        },
      },
    }),
    [filter, transformedData],
  );

  const onDateChange = val => {
    setStartDate(val[0]);
    setEndDate(val[1]);
  };

  const handleMenuItemClick = value => {
    setFilter(value);
    setActiveView(value);
  };

  const handleReset = () => {
    setFilter('');
    setActiveView('');
    setStartDate(null);
    setEndDate(null);
  };

  const modals = useModals();
  const [searchParams1, setSearchParams1] = useSearchParams({
    limit: 20,
    page: 1,
    sortOrder: 'desc',
    sortBy: 'revenue',
  });

  const { data: inventoryReportList, isLoading: inventoryReportListLoading } =
    useFetchInventoryReportList(searchParams1.toString());

  const page = searchParams1.get('page');
  const limit = searchParams1.get('limit');

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
    if (searchParams1.get('sortBy') === colId && searchParams1.get('sortOrder') === 'desc') {
      searchParams1.set('sortOrder', 'asc');
      setSearchParams1(searchParams1);
      return;
    }
    if (searchParams1.get('sortBy') === colId && searchParams1.get('sortOrder') === 'asc') {
      searchParams1.set('sortOrder', 'desc');
      setSearchParams1(searchParams1);
      return;
    }

    searchParams1.set('sortBy', colId);
    setSearchParams1(searchParams1);
  };

  const handlePagination = (key, val) => {
    if (val !== '') searchParams1.set(key, val);
    else searchParams1.delete(key);
    setSearchParams1(searchParams1);
  };

  // useEffect(() => {
  //   setSearchParams1(searchParams1);
  // }, [searchParams1]);

  return (
    <div className='overflow-y-auto px-3 col-span-10'>
      <div className="flex flex-col ">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col p-6 w-[40rem]">
            <p className="font-bold text-center">Sales Trends Report</p>
            <p className="text-sm text-gray-600 italic pt-3">
              This chart displays a sales trends report, featuring data for "Own Sites" and "Traded
              Sites".
            </p>
            <div className="flex gap-8 mt-6 justify-center">
              <div className="flex gap-2 items-center">
                <div className="h-4 w-4 rounded-full bg-orange-350" />
                <div>
                  <p className="my-2 text-xs font-light">Own Sites</p>
                  <p className="text-sm">₹{dummyStats.ownsite}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="h-4 w-4 rounded-full bg-purple-350" />
                <div>
                  <p className="my-2 text-xs font-light">Traded sites</p>
                  <p className="text-sm">₹ {dummyStats.tradedsite}</p>
                </div>
              </div>
            </div>
            <div className="w-80 mt-4">
              {printStatusData.datasets[0].data.length === 0 ? (
                <p className="text-center">NA</p>
              ) : (
                <Doughnut options={config.options} data={printStatusData} />
              )}
            </div>
           
          </div>

          <div className="flex flex-col items-center p-6 w-[40rem]">
            <div className="flex justify-between items-center">
              <p className="font-bold">Sales Contribution graph</p>
            </div>
              <p className="text-sm text-gray-600 italic pt-3">
              This chart analyzes the sales contributions of different channels over the past three
              years.
            </p>
            {isLoadingBookingData ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : (
              <div className="relative">
                <div className="relative w-[35rem] overflow-hidden">
                  <div className="p-4 ">
                    {salesData.length > 0 ? (
                      <Bar data={chartData} options={chartOptions} />
                    ) : (
                      <p className="text-center text-gray-600">No data available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-10  w-[60rem]">
            <div className="flex mt-2">
              <div className="flex flex-col gap-4 text-center">
                <div className="flex flex-col gap-4 p-4 items-center min-h-[200px]">
                  <p className="font-bold">Client Company Type Revenue Bifurcation</p>
                  <p className="text-sm text-gray-600 italic">
                    This chart visualizes the revenue distribution by different client company
                    types.{' '}
                  </p>
                  <div className="w-72">
                    {isLoadingBookingData ? (
                      <p className="text-center">Loading...</p>
                    ) : updatedClient.datasets[0].data.length === 0 ? (
                      <p className="text-center">NA</p>
                    ) : (
                      <Pie
                        data={updatedClient}
                        options={barDataConfigByClient.options}
                        height={200}
                        width={200}
                      />
                    )}
                  </div>
                 
                </div>
              </div>
            </div>
            <div className="p-6 flex text-center">
              <div className="mb-4 items-center flex flex-col">
                <p className="font-bold px-4 text-center">Operational cost bifurcation</p>
                <p className="text-sm text-gray-600 italic py-4">
                  This chart displays the breakdown of operational costs by different cost types.
                </p>
                <div className="w-72 ">
                  <Doughnut
                    data={doughnutChartData}
                    options={barDataConfigByClient.options}
                    height={200}
                    width={200}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[40rem] p-10 ">
            <p className="font-bold">Filtered Revenue Graph</p>
            <p className="text-sm text-gray-600 italic py-4">
              This chart shows the filtered revenue data over different time periods.
            </p>
            <Menu shadow="md" width={130}>
              <Menu.Target>
                <Button className="secondary-button">
                  View By: {viewBy[activeView] || 'Select'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {list.map(({ label, value }) => (
                  <Menu.Item
                    key={value}
                    onClick={() => handleMenuItemClick(value)}
                    className={classNames(
                      activeView === value && label !== 'Reset' && 'text-purple-450 font-medium',
                    )}
                  >
                    {label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            {filter && (
              <Button onClick={handleReset} className="mx-2 secondary-button">
                Reset
              </Button>
            )}

            {filter === 'customDate' && (
              <div className="flex flex-col items-start space-y-4 py-2">
                <DateRangeSelector dateValue={[startDate, endDate]} onChange={onDateChange} />
              </div>
            )}

            <div className="my-4">
              <Line data={chartData1} options={chartOptions1} />
            </div>

           
          </div>
        </div>
        <div className="overflow-y-auto px-5 col-span-10 w-[65rem]">
          <p className="font-bold pt-10">Performance Ranking Report</p>
          <p className="text-sm text-gray-600 italic py-4">
             This report shows Performance Cards with pagination controls and a sortable, paginated table.
            </p>
          <PerformanceCard />

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
      </div>
      </div>
  );
};

export default OtherNewReports;
