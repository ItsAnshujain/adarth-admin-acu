import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useBookings, useBookingsNew } from '../../apis/queries/booking.queries';
import { useSearchParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { Menu, Button } from '@mantine/core';
import classNames from 'classnames';
import DateRangeSelector from '../../components/DateRangeSelector';
import Table from '../../components/Table/Table';

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
const TagsWiseReport = () => {
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
  
  const [searchParams1] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });

  const {
    data: bookingDataNew,
    isLoading: isLoadingBookingDataNew,
  } = useBookingsNew(searchParams1.toString());

  console.log("new booking data", bookingDataNew);
  

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
            text: 'Revenue (lac)',
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

  // Table Columns
  // const columns4 = useMemo(
  //   () => [
  //     {
  //       Header: '#',
  //       accessor: 'id',
  //       disableSortBy: true,
  //       Cell: info => <p>{info.row.index + 1}</p>,
  //     },
  //     { Header: 'Tags', accessor: 'tag', disableSortBy: true, Cell: info => <p>{}</p> },
  //     { Header: 'January', accessor: 'January', disableSortBy: true, Cell: info => <p>{}</p> },
  //     { Header: 'February', accessor: 'February', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'March', accessor: 'March', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'April', accessor: 'April', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'May', accessor: 'May', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'June', accessor: 'June', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'July', accessor: 'July', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'August', accessor: 'August', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'September', accessor: 'September', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'October', accessor: 'October', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'November', accessor: 'November', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'December', accessor: 'December', disableSortBy: true, Cell: info => <p>{}</p>  },
  //     { Header: 'Grand Total', accessor: 'grandTotal', disableSortBy: true, Cell: info => <p>{}</p>  },
  //   ],
  //   [],
  // );

  return (
    <>
      <div className="pt-6 w-[40rem]">
        {/* <div className="col-span-12 md:col-span-12 lg:col-span-10 overflow-y-auto p-5">
          <p className="font-bold pb-4">Revenue Report with Tag Filtering</p>
          <Table COLUMNS={columns4} loading={isLoadingBookingData} />
        </div> */}
        <p className="font-bold text-center">Filtered Revenue Report</p>
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
          <div className="flex flex-col items-start space-y-4 py-2">
            <DateRangeSelector dateValue={[startDate, endDate]} onChange={onDateChange} />
          </div>
        )}

        <div className="my-4">
          <Line data={chartData1} options={chartOptions1} />
        </div>
      </div>
    </>
  );
};

export default TagsWiseReport;
