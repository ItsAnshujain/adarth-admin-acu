import { useMemo, useEffect, useState, useCallback } from 'react';
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';
import {
  useUserSalesByUserId,
  useBookings,
  useBookingsNew,
} from '../../apis/queries/booking.queries';
import {
  generateSlNo,
  daysInAWeek,
  financialEndDate,
  financialStartDate,
  monthsInShort,
  quarters,
  serialize,
  timeLegend,
} from '../../utils';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { useInfiniteCompanies } from '../../apis/queries/companies.queries';
import useUserStore from '../../store/user.store';
import { Loader } from 'react-feather';
import { useSearchParams } from 'react-router-dom';
import { useFetchMasters } from '../../apis/queries/masters.queries';
import { useFetchOperationalCostData } from '../../apis/queries/operationalCost.queries';
import 'react-datepicker/dist/react-datepicker.css';
import { Menu, Button, MultiSelect } from '@mantine/core';
import DateRangeSelector from '../../components/DateRangeSelector';
import Table from '../../components/Table/Table';
import toIndianCurrency from '../../utils/currencyFormat';
import { useDistinctAdditionalTags, useFetchInventory } from '../../apis/queries/inventory.queries';
import GaugeChart from '../../components/modules/newReports/GaugeChart';
import InvoiceReportChart from '../../components/modules/newReports/InvoiceReportChart';
import PerformanceCard from '../../components/modules/newReports/performanceCard';
import RevenueCards from '../../components/modules/newReports/RevenueCards';
import classNames from 'classnames';
import {
  useBookingReportByRevenueGraph,
  useBookingRevenueByIndustry,
} from '../../apis/queries/booking.queries';

import { Download } from 'react-feather';
import { downloadExcel } from '../../apis/requests/report.requests';
import { useDownloadExcel } from '../../apis/queries/report.queries';
import { showNotification } from '@mantine/notifications';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import ViewByFilter from '../../components/modules/reports/ViewByFilter';
import { DATE_FORMAT } from '../../utils/constants';

dayjs.extend(quarterOfYear);
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

const barDataConfigByIndustry = {
  options: {
    responsive: true,
  },
  styles: {
    backgroundColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ],
    borderWidth: 1,
  },
};

export const pieData = {
  labels: [],
  datasets: [
    {
      label: '',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
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

const viewBy1 = {
  reset: '',
  past10Years: 'Past 10 Years',
  past5Years: 'Past 5 Years',
  previousYear: 'Previous Year',
  currentYear: 'Current Year',
};

const list1 = [
  { label: 'Past 10 Years', value: 'past10Years' },
  { label: 'Past 5 Years', value: 'past5Years' },
  { label: 'Previous Year', value: 'previousYear' },
  { label: 'Current Year', value: 'currentYear' },
];
const viewBy2 = {
  reset: '',
  mediaType: 'Media Type',
  category: 'Category',
};

const list2 = [
  { label: 'Media Type', value: 'mediaType' },
  { label: 'Category', value: 'category' },
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

const OtherNewReports = () => {
  const userId = useUserStore(state => state.id);
  const userSales = useUserSalesByUserId({
    startDate: financialStartDate,
    endDate: financialEndDate,
    userId,
  });

  const [searchParams3, setSearchParams3] = useSearchParams({
    page: 1,
    limit: 500,
    sortBy: 'basicInformation.spaceName',
    sortOrder: 'desc',
    isActive: true,
  });

  const { data: inventoryData, isLoading: isLoadingInventoryData } = useFetchInventory(
    searchParams3.toString(),
  );

  const sitesData = useMemo(() => {
    if (!inventoryData?.docs?.length) return { totalTradedAmount: 0 };

    let totalTradedAmount = 0;

    inventoryData.docs.forEach(inventory => {
      inventory.campaigns?.forEach(campaign => {
        campaign.place?.forEach(place => {
          const placeStartDate = new Date(place.startDate);
          const placeEndDate = new Date(place.endDate);

          if (
            placeEndDate >= new Date(financialStartDate) &&
            placeStartDate <= new Date(financialEndDate)
          ) {
            totalTradedAmount += place.tradedAmount || 0;
          }
        });
      });
    });

    return { totalTradedAmount };
  }, [inventoryData, financialStartDate, financialEndDate]);

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

  const getCurrentYear = () => new Date().getFullYear();
  const pastYears = [getCurrentYear() - 3, getCurrentYear() - 2, getCurrentYear() - 1];

  const monthMapping = {
    0: 9,
    1: 10,
    2: 11,
    3: 0,
    4: 1,
    5: 2,
    6: 3,
    7: 4,
    8: 5,
    9: 6,
    10: 7,
    11: 8,
  };

  useEffect(() => {
    if (bookingData && bookingData.docs) {
      const aggregatedData = aggregateSalesData(bookingData.docs);
      setSalesData(aggregatedData);
    }
  }, [bookingData]);

  const aggregateSalesData = data => {
    const aggregated = {};

    monthsInShort.forEach((_, index) => {
      aggregated[index] = {};
      pastYears.forEach(year => {
        aggregated[index][year] = 0;
      });
    });

    data.forEach(item => {
      try {
        const date = new Date(item.createdAt);
        if (isNaN(date.getTime())) throw new Error('Invalid date');
        const dbMonth = date.getMonth();
        const month = monthMapping[dbMonth];
        const year = date.getFullYear();
        const amount = item.totalAmount || 0;

        if (amount <= 0 || isNaN(amount)) return;

        if (pastYears.includes(year)) {
          aggregated[month][year] += amount / 100000;
        }
      } catch (error) {}
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

  const calculateTrendLineData = () => {
    return salesData.map(data => {
      const total = Object.values(data)
        .slice(1)
        .reduce((acc, val) => acc + val, 0);
      return total / pastYears.length;
    });
  };

  const trendLineData = useMemo(() => calculateTrendLineData(), [salesData]);

  const combinedChartData = useMemo(() => {
    const colors = ['#FF6384', '#914EFB', '#36A2EB'];

    return {
      labels: monthsInShort,
      datasets: [
        ...pastYears.map((year, idx) => ({
          label: year,
          data: salesData.map(data => data[`year${year}`]),
          backgroundColor: colors[idx % colors.length],
          borderColor: colors[idx % colors.length],
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
          order: 1,
        })),
        {
          label: 'Trend',
          data: trendLineData,
          borderColor: '#EF4444',
          fill: false,
          tension: 0.1,
          pointBackgroundColor: '#EF4444',
          type: 'line',
          order: 2,
        },
      ],
    };
  }, [salesData, trendLineData]);

  const combinedChartOptions = useMemo(
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
            text: 'Sales Amount (lac)',
          },
          ticks: {
            callback: value => `${value} L`,
          },
          position: 'left',
        },
      },
    }),
    [],
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
  }, [chartLabels, chartData2]);

  const [filter, setFilter] = useState('');
  const [activeView, setActiveView] = useState('');
  const [startDate, setStartDate] = useState(financialStartDate);
  const [endDate, setEndDate] = useState(financialEndDate);

  const [startDate2, setStartDate2] = useState(null);
  const [endDate2, setEndDate2] = useState(null);

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
// Sorting logic for fiscal months (April to March)
const sortFiscalMonths = (a, b) => {
  const fiscalOrder = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  return fiscalOrder.indexOf(a) - fiscalOrder.indexOf(b);
};
  const transformedData = useMemo(() => {
    if (!bookingData || !bookingData.docs) return {};
  
    const currentYear = new Date().getFullYear();
    const fiscalStartMonth = 3; // April is month 3 (0-indexed)
  
    const past10YearsRange = generateYearRange(currentYear - 10, currentYear - 1);
    const past5YearsRange = generateYearRange(currentYear - 5, currentYear - 1);
  
    const groupedData = bookingData.docs.reduce((acc, booking) => {
      const date = new Date(booking.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth(); // Month is 0-indexed
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
  
      const fiscalYearStart = new Date(year, fiscalStartMonth, 1);
      const fiscalYearEnd = new Date(year + 1, fiscalStartMonth - 1, 31);
  
      // Past 10 years
      if (year >= currentYear - 10 && year < currentYear) {
        if (!acc.past10Years[year]) acc.past10Years[year] = 0;
        acc.past10Years[year] += revenue;
      }
  
      // Past 5 years
      if (year >= currentYear - 5 && year < currentYear) {
        if (!acc.past5Years[year]) acc.past5Years[year] = 0;
        acc.past5Years[year] += revenue;
      }
  
      // Previous fiscal year (April to March)
      if (year === currentYear - 1 || (year === currentYear && month < fiscalStartMonth)) {
        const fiscalMonth = (month + 12 - fiscalStartMonth) % 12; // Adjust month to fiscal year
        const fiscalMonthName = new Date(0, fiscalMonth).toLocaleString('default', { month: 'short' });
  
        if (!acc.previousYear[fiscalMonthName]) acc.previousYear[fiscalMonthName] = 0;
        acc.previousYear[fiscalMonthName] += revenue;
      }
  
      // Current fiscal year (April to March)
      if (year === currentYear && month >= fiscalStartMonth) {
        const fiscalMonthName = new Date(0, month).toLocaleString('default', { month: 'short' });
  
        if (!acc.currentYear[fiscalMonthName]) acc.currentYear[fiscalMonthName] = 0;
        acc.currentYear[fiscalMonthName] += revenue;
      }
  
      // Current month
      if (year === currentYear && month === new Date().getMonth()) {
        if (!acc.currentMonth[day]) acc.currentMonth[day] = 0;
        acc.currentMonth[day] += revenue;
      }
  
      // Past 7 days
      const last7DaysDate = new Date();
      last7DaysDate.setDate(last7DaysDate.getDate() - 7);
      if (date >= last7DaysDate) {
        if (!acc.past7[day]) acc.past7[day] = 0;
        acc.past7[day] += revenue;
      }
  
      // Quarter based on fiscal year
      if (month >= 3 && month <= 5) acc.quarter.Q1 += revenue;
      if (month >= 6 && month <= 8) acc.quarter.Q2 += revenue;
      if (month >= 9 && month <= 11) acc.quarter.Q3 += revenue;
      if ((month >= 0 && month <= 2) || month === 12) acc.quarter.Q4 += revenue;
  
      // Custom Date Range
      if (startDate2 && endDate2 && date >= startDate2 && date <= endDate2) {
        const key = `${month + 1}/${day}`;
        if (!acc.customDate[key]) acc.customDate[key] = 0;
        acc.customDate[key] += revenue;
      }
  
      return acc;
    }, {});
  
    // Post-process grouped data
    groupedData.past10Years = past10YearsRange.map(year => ({
      year,
      revenue: groupedData.past10Years[year] || 0,
    }));
  
    groupedData.past5Years = past5YearsRange.map(year => ({
      year,
      revenue: groupedData.past5Years[year] || 0,
    }));
  
    groupedData.previousYear = Object.keys(groupedData.previousYear)
      .sort(sortFiscalMonths)
      .map(month => ({
        month,
        revenue: groupedData.previousYear[month],
      }));
  
    groupedData.currentYear = Object.keys(groupedData.currentYear)
      .sort(sortFiscalMonths)
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
  
    groupedData.quarter = [
      { quarter: 'First Quarter', revenue: groupedData.quarter.Q1 },
      { quarter: 'Second Quarter', revenue: groupedData.quarter.Q2 },
      { quarter: 'Third Quarter', revenue: groupedData.quarter.Q3 },
      { quarter: 'Fourth Quarter', revenue: groupedData.quarter.Q4 },
    ];
  
    
    return groupedData;
  }, [bookingData, startDate2, endDate2]);
  
  

  const chartData1 = useMemo(() => {
    let selectedData = transformedData[filter] || [];
    const filteredData = selectedData.map(d => ({
      ...d,
      revenue: d.revenue > 0 ? d.revenue / 100000 : 0,
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
            text:
              filter === 'year'
                ? 'Years'
                : filter === 'quarter'
                ? 'Quarters'
                : filter === 'currentYear' || filter === 'previousYear'
                ? 'Months'
                : ['past7', 'customDate', 'currentMonth'].includes(filter)
                ? 'Days'
                : '',
          },
          ticks: {
            callback: function (value, index, values) {
              if (filter === 'quarter') {
                return ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'][index];
              }
              return this.getLabelForValue(value);
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Revenue (lac)',
          },
          ticks: {
            callback: value => `${value} L`,
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
    [filter, transformedData]
  );
  
  const onDateChange = val => {
    setStartDate2(val[0]);
    setEndDate2(val[1]);
  };

  const handleMenuItemClick = value => {
    setFilter(value);
    setActiveView(value);
  };

  const handleReset = () => {
    setFilter('');
    setActiveView('');
    setStartDate2(null);
    setEndDate2(null);
  };

  // traded margin report

  const processedData = useMemo(() => {
    if (!inventoryData?.docs?.length) return [];

    const cityData = {};

    inventoryData.docs.forEach(inventory => {
      const city = inventory.location?.city;
      if (!city) return;

      let totalCityPrice = 0;
      let totalCityTradedAmount = 0;

      inventory.campaigns?.forEach(campaign => {
        campaign.place?.forEach(place => {
          totalCityPrice += place.price || 0;
          totalCityTradedAmount += place.tradedAmount || 0;
        });
      });

      const tradedMargin = totalCityPrice - totalCityTradedAmount;
      const percentageMargin = totalCityPrice
        ? ((tradedMargin / totalCityPrice) * 100).toFixed(2)
        : 0;

      if (!cityData[city]) {
        cityData[city] = {
          city,
          totalPrice: totalCityPrice,
          totalTradedAmount: totalCityTradedAmount,
          tradedMargin,
          percentageMargin,
        };
      } else {
        cityData[city].totalPrice += totalCityPrice;
        cityData[city].totalTradedAmount += totalCityTradedAmount;
        cityData[city].tradedMargin += tradedMargin;
        cityData[city].percentageMargin = (
          (cityData[city].tradedMargin / cityData[city].totalPrice) *
          100
        ).toFixed(2);
      }
    });

    const sortedData = Object.values(cityData).sort((a, b) => b.tradedMargin - a.tradedMargin);

    return sortedData;
  }, [inventoryData]);

  const columns3 = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, 1, 1000)}</p>, []),
      },
      {
        Header: 'City',
        accessor: 'city',
        disableSortBy: true,
        Cell: info => <p>{info.value}</p>,
      },
      {
        Header: 'Price (lac)',
        accessor: 'totalPrice',
        disableSortBy: true,
        Cell: info => <p>{(info.value / 100000).toFixed(2)}</p>,
      },
      {
        Header: 'Traded Price (lac)',
        accessor: 'totalTradedAmount',
        disableSortBy: true,
        Cell: info => <p>{(info.value / 100000).toFixed(2)}</p>,
      },
      {
        Header: 'Traded Margin (lac)',
        accessor: 'tradedMargin',
        disableSortBy: true,
        Cell: info => <p>{(info.value / 100000).toFixed(2)}</p>,
      },
      {
        Header: 'Percentage Margin (%)',
        accessor: 'percentageMargin',
        disableSortBy: true,
        Cell: info => {
          const percentageMargin =
            isNaN(info.value) || info.value === null ? '-' : `${info.value}%`;
          return <p>{percentageMargin}</p>;
        },
      },
    ],
    [],
  );

  // traded margin report

  // invoice report
  const [activeView1, setActiveView1] = useState('');

  const formatMonthYear1 = date => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString('default', { month: 'short' });
    const year = newDate.getFullYear();
    return `${month} ${year}`;
  };

  const getFilteredData1 = (data, view) => {
    if (!data) return [];

    const now = new Date();
    let startDate, endDate;

    switch (view) {
      case 'past10Years':
        startDate = new Date(now.getFullYear() - 10, 0, 1);
        break;
      case 'past5Years':
        startDate = new Date(now.getFullYear() - 5, 0, 1);
        break;
      case 'previousYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'currentYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = null;
        endDate = null;
    }

    const grouped1 = {};

    data.docs.forEach(doc => {
      const date = new Date(doc.createdAt);
      const monthYearKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!grouped1[monthYearKey]) {
        grouped1[monthYearKey] = [];
      }
      grouped1[monthYearKey].push(doc);
    });

    const aggregatedData1 = Object.keys(grouped1)
      .map(monthYearKey => {
        const group = grouped1[monthYearKey];
        const totalInvoiceRaised =
          group.reduce((sum, doc) => sum + (doc.outStandingInvoice || 0), 0) / 100000;
        const totalAmountCollected =
          group.reduce((sum, doc) => sum + (doc.totalPayment || 0), 0) / 100000;
        const totalOutstanding = (totalInvoiceRaised - totalAmountCollected).toFixed(2);

        const date = new Date(`${monthYearKey}-01`);
        if ((startDate && date < startDate) || (endDate && date > endDate)) {
          return null;
        }

        if (totalInvoiceRaised >= 0 && totalAmountCollected >= 0 && totalOutstanding >= 0) {
          return {
            monthYearKey,
            month: formatMonthYear1(group[0].createdAt),
            outStandingInvoice: totalInvoiceRaised,
            totalPayment: totalAmountCollected,
            outstandingAmount: totalOutstanding,
          };
        }
        return null;
      })
      .filter(item => item !== null);

    return aggregatedData1.sort((a, b) => {
      const [yearA, monthA] = a.monthYearKey.split('-').map(Number);
      const [yearB, monthB] = b.monthYearKey.split('-').map(Number);

      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });
  };

  const groupedData1 = useMemo(() => {
    return getFilteredData1(bookingData, activeView1).sort((a, b) => {
      const [yearA, monthA] = a.monthYearKey.split('-').map(Number);
      const [yearB, monthB] = b.monthYearKey.split('-').map(Number);

      return yearA !== yearB ? yearB - yearA : monthB - monthA;
    });
  }, [bookingData?.docs, activeView1]);

  const column1 = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        disableSortBy: true,
        Cell: info => useMemo(() => <p>{generateSlNo(info.row.index, 1, 1000)}</p>, []),
      },
      {
        Header: 'Month',
        accessor: 'month',
        disableSortBy: true,
        Cell: info => <p>{info.row.original.month}</p>,
      },
      {
        Header: 'Invoice Raised (lac)',
        accessor: 'outStandingInvoice',
        disableSortBy: true,
        Cell: info => <p>{toIndianCurrency(info.row.original.outStandingInvoice)}</p>,
      },
      {
        Header: 'Amount Collected (lac)',
        accessor: 'totalPayment',
        disableSortBy: true,
        Cell: info => <p>{toIndianCurrency(info.row.original.totalPayment)}</p>,
      },
      {
        Header: 'Outstanding',
        accessor: 'outstandingAmount (lac)',
        disableSortBy: true,
        Cell: info => <p>{toIndianCurrency(info.row.original.outstandingAmount)}</p>,
      },
    ],
    [groupedData1],
  );

  const handleMenuItemClick1 = value => {
    setActiveView1(value);
  };

  const handleReset1 = () => {
    setActiveView1('');
  };

  const invoiceRaised = groupedData1?.reduce((acc, item) => acc + item.outStandingInvoice, 0);

  const amountCollected = groupedData1?.reduce((acc, item) => acc + item.totalPayment, 0);

  const isFilterApplied = activeView1 !== '';

  // invoice report

  // other components

  const [groupBy, setGroupBy] = useState('month');

  const [updatedReveueGraph, setUpdatedRevenueGraph] = useState({
    id: uuidv4(),
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
  });

  const [updatedIndustry, setUpdatedIndustry] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        ...barDataConfigByIndustry.styles,
      },
    ],
  });

  const { data: revenueGraphData, isLoading: isRevenueGraphLoading } =
    useBookingReportByRevenueGraph(
      serialize({
        startDate,
        endDate,
        groupBy,
      }),
    );

  const { data: revenueDataByIndustry, isLoading: isByIndustryLoading } =
    useBookingRevenueByIndustry(
      serialize({
        startDate,
        endDate,
      }),
    );

  const handleRevenueGraphViewBy = viewType => {
    if (viewType === 'reset' || viewType === 'year') {
      setStartDate(financialStartDate);
      setEndDate(financialEndDate);
      setGroupBy('month');
    }

    if (viewType === 'week' || viewType === 'month') {
      setStartDate(dayjs().startOf(viewType).format(DATE_FORMAT));
      setEndDate(dayjs().endOf(viewType).format(DATE_FORMAT));
      setGroupBy(viewType === 'month' ? 'dayOfMonth' : 'dayOfWeek');
    }
    if (viewType === 'quarter') {
      setStartDate(financialStartDate);
      setEndDate(financialEndDate);
      setGroupBy('quarter');
    }
  };
  const handleUpdateRevenueGraph = useCallback(() => {
    if (revenueGraphData) {
      const tempData = {
        labels: [],
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

      switch (groupBy) {
        case 'dayOfWeek':
          tempData.labels = daysInAWeek;
          tempData.datasets[0].data = Array(7).fill(0);
          break;
        case 'dayOfMonth':
          tempData.labels = Array.from({ length: dayjs().daysInMonth() }, (_, i) => i + 1);
          tempData.datasets[0].data = Array(dayjs().daysInMonth()).fill(0);
          break;
        case 'quarter':
          tempData.labels = quarters;
          tempData.datasets[0].data = Array(4).fill(0);
          break;
        default:
          tempData.labels = monthsInShort;
          tempData.datasets[0].data = Array(12).fill(0);
          break;
      }

      revenueGraphData?.forEach(item => {
        const id = Number(item._id);
        const total = Number(item.total).toFixed(2) || 0;

        if (groupBy === 'dayOfMonth' && id <= dayjs().daysInMonth()) {
          tempData.datasets[0].data[id - 1] = total;
        } else if (groupBy === 'dayOfWeek' && id <= 7) {
          tempData.datasets[0].data[id - 1] = total;
        } else if (groupBy === 'quarter' && id <= 4) {
          tempData.datasets[0].data[id - 1] = total;
        } else if (groupBy === 'month' || groupBy === 'year') {
          if (id < 4) {
            tempData.datasets[0].data[id + 8] = total;
          } else {
            tempData.datasets[0].data[id - 4] = total;
          }
        }
      });

      setUpdatedRevenueGraph(tempData);
    }
  }, [revenueGraphData, groupBy]);

  const handleUpdatedReveueByIndustry = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: 'Revenue by Industry',
          data: [],
          ...barDataConfigByIndustry.styles,
        },
      ],
    };

    if (revenueDataByIndustry) {
      revenueDataByIndustry.forEach((item, index) => {
        tempBarData.labels.push(item._id);
        tempBarData.datasets[0].data.push(Number(item.total) || 0);
      });
      setUpdatedIndustry(tempBarData);
    }
  }, [revenueDataByIndustry]);

  useEffect(() => {
    handleUpdateRevenueGraph();
  }, [revenueGraphData, groupBy]);

  useEffect(() => {
    handleUpdatedReveueByIndustry();
  }, [revenueDataByIndustry]);

  // other components

  // tagwise report

  const { data: bookingData2 } = useBookingsNew(searchParams.toString());

  const additionalTagsQuery = useDistinctAdditionalTags();
  const [selectedTags, setSelectedTags] = useState([]);
  const [startDate1, setStartDate1] = useState(null);
  const [endDate1, setEndDate1] = useState(null);
  const [filter3, setFilter3] = useState('');
  const [activeView3, setActiveView3] = useState('');
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const currentYear = new Date().getFullYear();
  const generatePast7Days = () => {
    const past7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      past7Days.push(`${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`);
    }
    return past7Days;
  };
  const transformedData3 = useMemo(() => {
    if (!bookingData2 || !selectedTags.length) return {};

    const past7DaysRange = generatePast7Days();

    const groupedData = bookingData2.reduce((acc, booking) => {
      const detailsWithTags = booking.details.filter(detail => {
        const campaign = detail.campaign;
        if (!campaign || !campaign.spaces || !Array.isArray(campaign.spaces)) return false;

        return campaign.spaces.some(space => {
          const spaceTags = space.specifications?.additionalTags || [];
          return Array.isArray(spaceTags) && selectedTags.some(tag => spaceTags.includes(tag));
        });
      });

      if (detailsWithTags.length === 0) return acc;

      detailsWithTags.forEach(detail => {
        const date = new Date(detail.createdAt);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const formattedDay = `${month} ${day}`;
        const revenue = booking.totalAmount;

        selectedTags.forEach(tag => {
          const tagMatches = detail.campaign.spaces.some(space =>
            space.specifications?.additionalTags?.includes(tag),
          );
          if (!tagMatches) return;

          let timeUnit;

          if (filter3 === 'past10Years' && year >= currentYear - 10) {
            timeUnit = year;
          } else if (filter3 === 'past5Years' && year >= currentYear - 5) {
            timeUnit = year;
          } else if (filter3 === 'previousYear' && year === currentYear - 1) {
            timeUnit = month;
          } else if (filter3 === 'currentYear' && year === currentYear) {
            timeUnit = month;
          } else if (
            filter3 === 'currentMonth' &&
            date.getMonth() === new Date().getMonth() &&
            year === currentYear
          ) {
            timeUnit = day;
          } else if (filter3 === 'past7' && past7DaysRange.includes(formattedDay)) {
            timeUnit = formattedDay;
          } else if (
            filter3 === 'customDate' &&
            date.getTime() >= new Date(startDate1).getTime() &&
            date.getTime() <= new Date(endDate1).getTime()
          ) {
            timeUnit = formattedDay;
          } else if (filter3 === 'quarter') {
            const quarterly = Math.ceil((date.getMonth() + 1) / 3);
            const quarterNames = [
              'First Quarter',
              'Second Quarter',
              'Third Quarter',
              'Fourth Quarter',
            ];
            timeUnit = quarterNames[quarterly - 1];
          }

          if (!timeUnit) return;

          if (!acc[timeUnit]) acc[timeUnit] = {};
          if (!acc[timeUnit][tag]) acc[timeUnit][tag] = 0;

          acc[timeUnit][tag] += revenue;
        });
      });

      return acc;
    }, {});

    return groupedData;
  }, [bookingData2, selectedTags, filter3, startDate1, endDate1]);

  const chartData3 = useMemo(() => {
    const selectedData = transformedData3 || {};

    if (!selectedData || Object.keys(selectedData).length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    let labels = Object.keys(selectedData);

    if (filter3 === 'quarter') {
      labels = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
    }

    const datasets = selectedTags.map((tag, index) => {
      const data = labels.map(label => {
        const tagRevenue = selectedData[label]?.[tag] || 0;
        return tagRevenue > 0 ? tagRevenue / 100000 : 0;
      });

      const hue = ((index * 360) / selectedTags.length) % 360;
      const color = `hsl(${hue}, 70%, 50%)`;
      const colorRGBA = `hsla(${hue}, 70%, 50%, 0.2)`;

      return {
        label: ` ${tag} `,
        data,
        borderColor: color,
        backgroundColor: colorRGBA,
        tension: 0.1,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [transformedData3, selectedTags, filter3]);

  const chartOptions3 = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text:
              filter3 === 'year'
                ? 'Years'
                : filter3 === 'quarter'
                ? 'Quarters'
                : filter3 === 'currentYear' || filter3 === 'previousYear'
                ? 'Months'
                : ['past7', 'customDate', 'currentMonth'].includes(filter3)
                ? 'Days'
                : '',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Revenue (lac)',
          },
          ticks: {
            callback: value => `${value} L`,
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
    [filter3, transformedData3],
  );

  const onDateChange3 = val => {
    setStartDate1(val[0]);
    setEndDate1(val[1]);
  };

  const handleReset3 = () => {
    setFilter3('');
    setActiveView3('');
    setStartDate1(null);
    setEndDate1(null);
    setSelectedTags([]);
  };

  const handleMenuItemClick3 = value => {
    setFilter3(value);
    setActiveView3(value);
  };
  const tags = additionalTagsQuery.data || [];
  const options = tags.map(tag => ({ value: tag, label: tag }));

  const tableData3 = useMemo(() => {
    if (!transformedData3 || Object.keys(transformedData3).length === 0) {
      return [];
    }

    let timeUnits = [];

    if (filter3 === 'past10Years' || filter3 === 'past5Years') {
      timeUnits =
        filter3 === 'past10Years'
          ? generateYearRange(currentYear - 10, currentYear - 1)
          : generateYearRange(currentYear - 5, currentYear - 1);
    } else if (filter3 === 'previousYear' || filter3 === 'currentYear') {
      timeUnits = [
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
    } else if (filter3 === 'currentMonth') {
      const daysInMonth = new Date(currentYear, new Date().getMonth() + 1, 0).getDate();
      timeUnits = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    } else if (filter3 === 'past7') {
      const past7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleString('default', { month: 'short', day: 'numeric' });
      }).reverse();
      timeUnits = past7Days;
    } else if (filter3 === 'customDate' && startDate1 && endDate1) {
      const customRangeDates = [];
      let currentDate = new Date(startDate1);
      while (currentDate <= new Date(endDate1)) {
        customRangeDates.push(
          currentDate.toLocaleString('default', { month: 'short', day: 'numeric' }),
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      timeUnits = customRangeDates;
    } else if (filter3 === 'quarter') {
      timeUnits = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
    }

    const tableRows3 = selectedTags.map(tag => {
      const row = { tag };
      let totalForTag = 0;
      timeUnits.forEach(timeUnit => {
        const revenue = transformedData3[timeUnit]?.[tag] || 0;
        row[timeUnit] = revenue > 0 ? (revenue / 100000).toFixed(2) : '-';
        totalForTag += revenue;
      });

      row['Grand Total'] = totalForTag > 0 ? (totalForTag / 100000).toFixed(2) : '-';
      return row;
    });

    const grandTotalRow = { tag: 'Grand Total' };
    let overallTotal = 0;

    timeUnits.forEach(timeUnit => {
      const total = selectedTags.reduce((sum, tag) => {
        return sum + (transformedData3[timeUnit]?.[tag] || 0);
      }, 0);
      grandTotalRow[timeUnit] = total > 0 ? (total / 100000).toFixed(2) : '-';
      overallTotal += total;
    });

    grandTotalRow['Grand Total'] = overallTotal > 0 ? (overallTotal / 100000).toFixed(2) : 0;

    return [...tableRows3, grandTotalRow];
  }, [transformedData3, selectedTags, filter3, startDate1, endDate1]);

  const tableColumns3 = useMemo(() => {
    const dynamicColumns = [];

    if (filter3 === 'past10Years' || filter3 === 'past5Years') {
      const yearRange =
        filter3 === 'past10Years'
          ? generateYearRange(currentYear - 10, currentYear - 1)
          : generateYearRange(currentYear - 5, currentYear - 1);
      yearRange.forEach(year => {
        dynamicColumns.push({
          Header: year.toString(),
          accessor: year.toString(),
          disableSortBy: true,
        });
      });
    } else if (filter3 === 'previousYear' || filter3 === 'currentYear') {
      const months = [
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
      months.forEach(month => {
        dynamicColumns.push({
          Header: month,
          accessor: month,
          disableSortBy: true,
        });
      });
    } else if (filter3 === 'currentMonth') {
      const daysInMonth = new Date(currentYear, new Date().getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dynamicColumns.push({
          Header: i.toString(),
          accessor: i.toString(),
          disableSortBy: true,
        });
      }
    } else if (filter3 === 'past7') {
      const past7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleString('default', { month: 'short', day: 'numeric' });
      }).reverse();

      past7Days.forEach(day => {
        dynamicColumns.push({
          Header: day,
          accessor: day,
          disableSortBy: true,
        });
      });
    } else if (filter3 === 'customDate') {
      const customRangeDates = [];
      let currentDate = new Date(startDate1);
      while (currentDate <= new Date(endDate1)) {
        customRangeDates.push(
          currentDate.toLocaleString('default', { month: 'short', day: 'numeric' }),
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      customRangeDates.forEach(date => {
        dynamicColumns.push({
          Header: date,
          accessor: date,
          disableSortBy: true,
        });
      });
    } else if (filter3 === 'quarter') {
      const quarters = ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
      quarters.forEach(quarter => {
        dynamicColumns.push({
          Header: quarter,
          accessor: quarter,
          disableSortBy: true,
        });
      });
    }

    return [
      {
        Header: 'Tag',
        accessor: 'tag',
        disableSortBy: true,
      },
      ...dynamicColumns,
      {
        Header: 'Grand Total',
        accessor: 'Grand Total',
        disableSortBy: true,
      },
    ];
  }, [filter3, currentYear, startDate1, endDate1]);
  // tagwise report

  // media type wise
  const [filter4, setFilter4] = useState('');
  const [activeView4, setActiveView4] = useState('');
  const [secondFilter, setSecondFilter] = useState('');

  const transformedData4 = useMemo(() => {
    if (!bookingData2 || !secondFilter) return {};

    const past7DaysRange = generatePast7Days();
    const currentYear = new Date().getFullYear();

    const groupedData = bookingData2.reduce((acc, booking) => {
      booking.details.forEach(detail => {
        const campaign = detail.campaign;
        if (!campaign || !campaign.spaces || !Array.isArray(campaign.spaces)) return;

        campaign.spaces.forEach(space => {
          const mediaType = space.basicInformation?.mediaType?.name;
          const category = space.basicInformation?.category?.[0]?.name;
          const date = new Date(detail.createdAt);
          const year = date.getFullYear();
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const formattedDay = `${month} ${day}`;
          const revenue = booking.totalAmount;

          let timeUnit;
          if (filter4 === 'past10Years' && year >= currentYear - 10 && year < currentYear) {
            timeUnit = year;
          } else if (filter4 === 'past5Years' && year >= currentYear - 5 && year < currentYear) {
            timeUnit = year;
          } else if (filter4 === 'previousYear' && year === currentYear - 1) {
            timeUnit = month;
          } else if (filter4 === 'currentYear' && year === currentYear) {
            timeUnit = month;
          } else if (
            filter4 === 'currentMonth' &&
            date.getMonth() === new Date().getMonth() &&
            year === currentYear
          ) {
            timeUnit = day;
          } else if (filter4 === 'past7' && past7DaysRange.includes(formattedDay)) {
            timeUnit = formattedDay;
          } else if (
            filter4 === 'customDate' &&
            date.getTime() >= new Date(startDate).getTime() &&
            date.getTime() <= new Date(endDate).getTime()
          ) {
            timeUnit = formattedDay;
          } else if (filter4 === 'quarter') {
            const quarterly = Math.ceil((date.getMonth() + 1) / 3);
            timeUnit = `Q${quarterly}`;
          }

          if (!timeUnit) return;

          const groupKey = secondFilter === 'mediaType' ? mediaType : category;
          if (!groupKey) return;

          if (!acc[groupKey]) acc[groupKey] = {};
          if (!acc[groupKey][timeUnit]) acc[groupKey][timeUnit] = 0;

          acc[groupKey][timeUnit] += revenue;
        });
      });
      return acc;
    }, {});

    return groupedData;
  }, [bookingData2, filter4, secondFilter, startDate1, endDate1]);
  const chartData4 = useMemo(() => {
    if (!transformedData4 || Object.keys(transformedData4).length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = Object.keys(transformedData4);
    const data = labels.map(key => {
      const revenueData = transformedData4[key];
      let totalRevenue = 0;

      Object.keys(revenueData).forEach(timeUnit => {
        totalRevenue += revenueData[timeUnit] || 0;
      });

      return totalRevenue / 100000;
    });

    if (data.every(value => value === 0)) {
      return { labels: [], datasets: [] };
    }

    const colors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];

    const datasetColors = labels.map((_, index) => colors[index % colors.length]);

    return {
      labels,
      datasets: [
        {
          label: `Revenue by ${secondFilter === 'category' ? 'Category' : 'Media Type'}`,
          data,
          backgroundColor: datasetColors,
          borderColor: datasetColors.map(color => color.replace('1)', '0.8)')),
          borderWidth: 1,
        },
      ],
    };
  }, [transformedData4, secondFilter, filter4]);

  const chartOptions4 = useMemo(
    () => ({
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + ' L';
            },
          },
          title: {
            display: true,
            text: 'Revenue (lac)',
          },
        },
      },
    }),
    [filter4, transformedData4, secondFilter],
  );

  const onDateChange4 = val => {
    setStartDate1(val[0]);
    setEndDate1(val[1]);
  };
  const handleReset4 = () => {
    setFilter4('');
    setActiveView4('');
    setSecondFilter('');
    setStartDate1(null);
    setEndDate1(null);
  };

  const handleMenuItemClick4 = value => {
    setFilter4(value);
    setActiveView4(value);
  };
  // media type wise

  // excel
  const { mutateAsync, isLoading: isDownloadLoading } = useDownloadExcel();

  const handleDownloadExcel = async () => {
    const activeUrl = new URL(window.location.href);

    await mutateAsync(
      { s3url: activeUrl.toString() },
      {
        onSuccess: data => {
          showNotification({
            title: 'Report has been downloaded successfully',
            color: 'green',
          });
          if (data?.link) {
            downloadExcel(data.link);
          }
        },
        onError: err => {
          showNotification({
            title: err?.message,
            color: 'red',
          });
        },
      },
    );
  };
  // excel

  return (
    <div className="overflow-y-auto px-3 col-span-10 overflow-hidden">
      <div className="flex justify-between ">
        <p className="font-bold py-5 text-lg">Total Revenue Box</p>
        <div className="py-5 flex items-start">
          <Button
            leftIcon={<Download size="20" color="white" />}
            className="primary-button "
            onClick={handleDownloadExcel}
            loading={isDownloadLoading}
            disabled={isDownloadLoading}
          >
            Download Income Statement
          </Button>
        </div>
      </div>
      <div className="border-2 p-5 border-black">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col p-6 w-[30rem]">
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
            <div className="w-80 mt-4 ">
              {printStatusData.datasets[0].data.length === 0 ? (
                <p className="text-center">NA</p>
              ) : (
                <Doughnut options={config.options} data={printStatusData} />
              )}
            </div>
          </div>
          <div className="flex mt-2">
            <div className="flex flex-col gap-4 text-center">
              <div className="flex flex-col gap-4 p-4 items-center min-h-[200px]">
                <p className="font-bold">Client Company Type Revenue Bifurcation</p>
                <p className="text-sm text-gray-600 italic">
                  This chart visualizes the revenue distribution by different client company types.{' '}
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
        </div>

        <div className="flex flex-col px-2 overflow-hidden">
          <div className="flex flex-col md:flex-row  w-[60rem]">
            <div className="pt-6 w-[40rem]">
              <p className="font-bold ">Media Type / Category Wise Filtered Revenue Report</p>
              <p className="text-sm text-gray-600 italic py-4">
                This chart shows the filtered revenue data over different time periods.
              </p>
              <div className="flex">
                <div>
                  <Menu shadow="md" width={130}>
                    <Menu.Target>
                      <Button className="secondary-button">
                        View By: {viewBy[activeView4] || 'Select'}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {list.map(({ label, value }) => (
                        <Menu.Item
                          key={value}
                          onClick={() => handleMenuItemClick4(value)}
                          className={classNames(
                            activeView4 === value && 'text-purple-450 font-medium',
                          )}
                        >
                          {label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </div>
                <div className="mx-2">
                  <Menu shadow="md" width={130}>
                    <Menu.Target>
                      <Button className="secondary-button">
                        View By: {viewBy2[secondFilter] || 'Select'}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {list2.map(({ label, value }) => (
                        <Menu.Item
                          key={value}
                          onClick={() => setSecondFilter(value)}
                          className={classNames(
                            secondFilter === value && 'text-purple-450 font-medium',
                          )}
                        >
                          {label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </div>
                <div>
                  {filter4 && (
                    <Button onClick={handleReset4} className="mx-2 secondary-button">
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              {filter4 === 'customDate' && (
                <div className="flex flex-col items-start space-y-4 py-2 ">
                  <DateRangeSelector
                    dateValue={[startDate1, endDate1]}
                    onChange={onDateChange4}
                    minDate={threeMonthsAgo}
                    maxDate={today}
                  />
                </div>
              )}

              <div className=" my-4">
                <Bar data={chartData4} options={chartOptions4} />
              </div>
            </div>
            <div className=" flex text-center">
              <div className="mb-4 items-center flex flex-col">
                <p className="font-bold px-4 text-center">Operational cost bifurcation</p>
                <p className="text-sm text-gray-600 italic py-4">
                  This chart displays the breakdown of operational costs by different cost types.
                </p>
                <div className=" w-96 ">
                  <Doughnut
                    data={doughnutChartData}
                    options={{
                      ...barDataConfigByClient.options,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'right', // Move the legend to the right of the chart
                          align: 'center', // Align the legends centrally
                          labels: {
                            boxWidth: 10, // Adjust the size of the color box
                            padding: 15, // Add padding between labels and boxes
                          },
                        },
                      },
                      layout: {
                        padding: {
                          right: 0, // Add some padding on the right side
                        },
                      },
                    }}
                    height={400}
                    width={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={classNames('overflow-y-auto px-5 col-span-10 overflow-x-hidden')}>
          <div className="my-6 w-[60rem]" id="revenue-pdf">
            <div className="h-[60px] border-b my-5 border-gray-450 flex justify-end items-center">
              <ViewByFilter handleViewBy={handleRevenueGraphViewBy} />
            </div>
            <div className="flex gap-8">
              <div className="w-[70%] flex flex-col justify-between min-h-[300px]">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Revenue Graph</p>
                </div>
                {isRevenueGraphLoading ? (
                  <Loader className="m-auto" />
                ) : (
                  <div className="flex flex-col pl-7 relative">
                    <p className="transform rotate-[-90deg] absolute left-[-38px] top-[40%] text-sm">
                      Amount in INR &gt;
                    </p>
                    <div className="max-h-[350px]">
                      <Line
                        data={updatedReveueGraph}
                        options={options}
                        key={updatedReveueGraph.id}
                        className="w-full"
                      />
                    </div>
                    <p className="text-center text-sm">{timeLegend[groupBy]} &gt;</p>
                  </div>
                )}
              </div>
              <div className="w-[30%] flex flex-col">
                <div className="flex justify-between items-start">
                  <p className="font-bold">Industry wise revenue graph</p>
                </div>
                <div className="w-80 m-auto">
                  {isByIndustryLoading ? (
                    <Loader className="mx-auto" />
                  ) : !updatedIndustry.datasets[0].data.length ? (
                    <p className="text-center">NA</p>
                  ) : (
                    <Pie
                      data={updatedIndustry}
                      options={barDataConfigByIndustry.options}
                      key={updatedIndustry.id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden px-5 ">
          <RevenueCards />
        </div>
      </div>
      <div className="flex p-6 flex-col ">
        <div className="flex justify-between items-center">
          <p className="font-bold">Sales Report</p>
        </div>
        <p className="text-sm text-gray-600 italic pt-3">
          This chart displays total sales over the past three years with a trend line showing the
          average sales.
        </p>
        {isLoadingBookingData ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="">
            {salesData.length > 0 ? (
              <div className=" gap-10 ">
                {/* <div className="pt-4 w-[40rem]">
                      <Bar data={salesChartData} options={salesChartOptions} />
                    </div> */}
                <div className="pt-4 w-[40rem]">
                  <Bar data={combinedChartData} options={combinedChartOptions} />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600">No data available.</p>
            )}
          </div>
        )}
      </div>
      <div className="p-6 w-[50rem]">
        <p className="font-bold ">Filtered Revenue Report</p>
        <p className="text-sm text-gray-600 italic py-4">
          This chart shows the filtered revenue data over different time periods.
        </p>
        <Menu shadow="md" width={130}>
          <Menu.Target>
            <Button className="secondary-button">View By: {viewBy[activeView] || 'Select'}</Button>
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
          <div className="flex flex-col items-start space-y-4 py-2 ">
            <DateRangeSelector dateValue={[startDate2, endDate2]} onChange={onDateChange} />
          </div>
        )}

        <div className="my-4">
          <Line data={chartData1} options={chartOptions1} />
        </div>
      </div>
      <div className="flex flex-col col-span-10 overflow-x-hidden">
        <div className="pt-6 w-[50rem] mx-10">
          <p className="font-bold ">Tag Wise Filtered Revenue Report</p>
          <p className="text-sm text-gray-600 italic py-4">
            This chart shows the filtered revenue data over different time periods.
          </p>
          <div className="flex">
            <div>
              {/* View By Dropdown */}
              <Menu shadow="md" width={130}>
                <Menu.Target>
                  <Button className="secondary-button">
                    View By: {viewBy[activeView3] || 'Select'}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {list.map(({ label, value }) => (
                    <Menu.Item
                      key={value}
                      onClick={() => handleMenuItemClick3(value)}
                      className={classNames(
                        activeView3 === value && label !== 'Reset' && 'text-purple-450 font-medium',
                      )}
                    >
                      {label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </div>
            <div className="mx-2">
              <MultiSelect
                data={options}
                value={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select Additional Tags"
                searchable
                clearable
              />
            </div>
            <div>
              {filter3 && (
                <Button onClick={handleReset3} className="mx-2 secondary-button">
                  Reset
                </Button>
              )}
            </div>
          </div>

          {filter3 === 'customDate' && (
            <div className="flex flex-col items-start space-y-4 py-2 ">
              <DateRangeSelector
                dateValue={[startDate1, endDate1]}
                onChange={onDateChange3}
                minDate={threeMonthsAgo}
                maxDate={today}
              />
            </div>
          )}
          <div className="my-4">
            <Line data={chartData3} options={chartOptions3} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-10 border-gray-450 mx-10">
          <Table COLUMNS={tableColumns3} data={tableData3} />
        </div>
      </div>

      <div className="col-span-12 md:col-span-12 lg:col-span-10 overflow-y-auto p-5">
        <p className="font-bold pt-10">Price and Traded Margin Report</p>
        <p className="text-sm text-gray-600 italic py-4">
          This report provide insights into the pricing trends, traded prices, and margins grouped
          by cities.
        </p>
        <div className="overflow-y-auto h-[400px]">
          <Table data={processedData || []} COLUMNS={columns3} loading={isLoadingInventoryData} />
        </div>
      </div>
      <div className="col-span-12 md:col-span-12 lg:col-span-10 p-5 overflow-hidden">
        <p className="font-bold ">Invoice and amount collected Report</p>
        <p className="text-sm text-gray-600 italic py-4">
          This report provide insights into the invoice raised, amount collected and outstanding by
          table, graph and chart.
        </p>
        <div className="flex py-4">
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button className="secondary-button">
                  View By: {viewBy1[activeView1] || 'Select'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {list1.map(({ label, value }) => (
                  <Menu.Item
                    key={value}
                    onClick={() => handleMenuItemClick1(value)}
                    className={classNames(activeView1 === value && 'text-purple-450 font-medium')}
                  >
                    {label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </div>

          {activeView1 && (
            <Button onClick={handleReset1} className="mx-2 secondary-button">
              Reset
            </Button>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-10  overflow-x-auto">
          <div className="overflow-y-auto w-[600px] h-[400px]">
            <Table data={groupedData1 || []} COLUMNS={column1} loading={isLoadingInventoryData} />
          </div>
          <div className="flex flex-col">
            <p className="pb-6 font-bold text-center">Invoice Raised Vs Amount Collected</p>
            <GaugeChart
              invoiceRaised={isFilterApplied ? invoiceRaised : 0}
              amountCollected={isFilterApplied ? amountCollected : 0}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="py-10 font-bold">Invoice Raised Vs Amount Collected Vs Outstanding</p>
          <InvoiceReportChart data={activeView1 ? groupedData1 : []} />{' '}
        </div>
      </div>
      <div className="overflow-y-auto px-5 col-span-10 w-[65rem]">
        <p className="font-bold pt-10">Performance Ranking Report</p>
        <p className="text-sm text-gray-600 italic py-4">
          This report shows Performance Cards with pagination controls and a sortable, paginated
          table.
        </p>
        <PerformanceCard />
      </div>
    </div>
  );
};

export default OtherNewReports;
