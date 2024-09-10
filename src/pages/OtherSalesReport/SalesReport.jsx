import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
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
import { Loader } from 'react-feather';
import { monthsInShort } from '../../utils';
import { useBookings } from '../../apis/queries/booking.queries';

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

const SalesReport = () => {
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
            aggregated[month][year] += amount / 100000;
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
          [year]: aggregated[index][year],
        }),
        {},
      ),
    }));

    return result;
  };

  const currentYear = getCurrentYear();
  const pastYears = [currentYear - 3, currentYear - 2, currentYear - 1];
  const salesChartData = useMemo(() => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56'];

    return {
      labels: monthsInShort,
      datasets: pastYears.map((year, idx) => ({
        label: year,
        data: salesData.map(data => data[`year${year}`]),
        backgroundColor: colors[idx % colors.length], // Rotate colors based on the index
        borderColor: colors[idx % colors.length],
        borderWidth: 1,
      })),
    };
  }, [salesData, pastYears]);

  const salesChartOptions = useMemo(
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
    [salesData],
  );

  // Calculate the average sales per month for the trend line
  const calculateAverageSales = () => {
    return salesData.map(monthData => {
      const total = pastYears.reduce((sum, year) => sum + monthData[year], 0);
      return total / pastYears.length; // Average of the past 3 years
    });
  };

  const averageSalesData = calculateAverageSales();

  // New Percentage Contribution Data
  const percentageChartData = useMemo(() => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56'];

    return {
      labels: monthsInShort,
      datasets: [
        ...pastYears.map((year, idx) => ({
          label: year,
          data: salesData.map(data => (data[year] / 100) * 100), // Example contribution percentage calculation
          backgroundColor: colors[idx % colors.length], // Rotate colors based on the index
          borderColor: colors[idx % colors.length],
          borderWidth: 1,
          yAxisID: idx % 2 === 0 ? 'left' : 'right', // Assign dataset to left or right axis
        })),
        {
          label: 'Trend (Avg)',
          data: averageSalesData, // Use average sales data for the trend line
          type: 'line', // Specify as a line chart
          borderColor: 'red',
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: 'red',
          yAxisID: 'left', // Trend line should be on the left Y-axis
        },
      ],
    };
  }, [salesData, averageSalesData, pastYears]);

  // Two-Sided Y-Axis Options
  const percentageChartOptions = useMemo(
    () => ({
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
        left: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Percentage Contribution (Left)',
          },
        },
        right: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Percentage Contribution (Right)',
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
                label += `${context.parsed.y}%`;
              }
              return label;
            },
          },
        },
      },
    }),
    [salesData],
  );

  return (
    <div className="flex p-6 flex-col w-[80rem] overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="font-bold">Sales Report</p>
      </div>
      <p className="text-sm text-gray-600 italic pt-3">
        This chart displays total sales over the past three years with a trend line showing the average sales.
      </p>
      {isLoadingBookingData ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="overflow-hidden">
          {salesData.length > 0 ? (
            <div className="flex gap-10">
              {/* Existing Sales Chart */}
              <div className="pt-4 w-[30rem]">
                <Bar data={salesChartData} options={salesChartOptions} />
              </div>

              {/* New Percentage Contribution Chart */}
              <div className="pt-4 w-[30rem]">
                <Bar data={percentageChartData} options={percentageChartOptions} />
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesReport;
