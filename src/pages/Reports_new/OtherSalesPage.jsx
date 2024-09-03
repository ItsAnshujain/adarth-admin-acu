import { useEffect, useState, useMemo } from 'react';
import { useBookings } from '../../apis/queries/booking.queries';
import { useSearchParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Loader } from 'react-feather';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Title, Tooltip, Legend);

import { monthsInShort } from '../../utils';

const OtherSalesPage = () => {
  const [searchParams] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: bookingData, isLoading: isLoadingBookingData, error } = useBookings(searchParams.toString());
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (bookingData && bookingData.docs) {
      const aggregatedData = aggregateSalesData(bookingData.docs);
      setSalesData(aggregatedData);
      console.log("Booking Data:", bookingData);
    }
  }, [bookingData, error]);

  const getCurrentYear = () => new Date().getFullYear();

  const aggregateSalesData = (data) => {
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
      ...pastYears.reduce((acc, year) => ({
        ...acc,
        [`year${year}`]: aggregated[index][year],
      }), {})
    }));
  
    return result;
  };
  

  const getMaxValue = (data) => {
    return Math.max(...data.flatMap(d => Object.values(d).slice(1))); // Exclude month names
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

  const chartOptions = useMemo(() => ({
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
          callback: (value) => `${value} L`, // Format y-axis labels in lacs
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
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
  }), [salesData]);
  

  return (
    <div className="w-[40rem] flex flex-col space-y-4 p-6">
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold text-gray-800">Revenue Graph</p>
      </div>
      {isLoadingBookingData ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col items-center relative">
          <div className="relative w-full max-w-4xl overflow-hidden">
            <div className="p-4">
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
  );
};

export default OtherSalesPage;
