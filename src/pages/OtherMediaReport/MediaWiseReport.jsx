import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBookingsNew } from '../../apis/queries/booking.queries';
import { Bar } from 'react-chartjs-2';
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
  registerables,
} from 'chart.js';
import { monthsInShort } from '../../utils'; 
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
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
);

Chart.register(...registerables);
const MediaWiseReport = () => {
  const chartRef = useRef(null); 
  const [searchParams] = useSearchParams({
    page: 1,
    limit: 1000,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  
  const { data: bookingData2, isLoading: isLoadingBookingData } = useBookingsNew(searchParams.toString());

  const currentFinancialYear = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  };

  
  const aggregatedData3 = useMemo(() => {
    if (!bookingData2) {
      return {
        sales: monthsInShort.reduce((acc, month) => {
          acc[month] = { government: 0, nationalagency: 0, localagency: 0, directclient: 0 };
          return acc;
        }, {}),
      };
    }

    const result = {
      sales: monthsInShort.reduce((acc, month) => {
        acc[month] = { government: 0, nationalagency: 0, localagency: 0, directclient: 0 };
        return acc;
      }, {}),
    };

    bookingData2.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      const fy = currentFinancialYear(bookingDate);

      if (fy === currentFinancialYear(new Date())) {
        const totalAmount = booking?.totalAmount || 0;

        if (Array.isArray(booking.details) && booking.details.length > 0) {
          booking.details.forEach(detail => {
            const clientType = detail?.client?.clientType?.toLowerCase().replace(/\s/g, '');

            const monthKey = bookingDate.toLocaleString('default', { month: 'short' });
            if (result.sales[monthKey] && clientType) {
              result.sales[monthKey][clientType] += totalAmount / 100000; 
            }
          });
        }
      }
    });

    return result;
  }, [bookingData2]);

  const totalSalesByMonth = useMemo(() => 
    Object.values(aggregatedData3.sales).map(
      item => item.government + item.nationalagency + item.localagency + item.directclient
    ),
  [aggregatedData3]);


  const barChartOptions = useMemo(() => ({
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
          text: 'Sales (lac)',
        },
        ticks: {
          callback: value => `${value.toFixed(2)} L`,
        },
        beginAtZero: true,
        position: 'left',
      },
    },
    plugins: {
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        formatter: (value, context) => {
          if(value === 0) {
            return ''
          }
          return value >= 1 ? Math.floor(value) : value.toFixed(2);
        },
        color: '#000',
        font: {
          weight: 'light',
          size: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: context => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y.toFixed(2)} L`;
            }
            return label;
          },
        },
      },
    },
  }), []);

  const stackedBarOptions = useMemo(() => ({
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
        stacked: true, 
      },
      y: {
        title: {
          display: true,
          text: 'Percentage Contribution (%)',
        },
        stacked: true, 
        beginAtZero: true,
        ticks: {
          callback: value => `${value}%`, 
        },
      },
    },
    plugins: {
      datalabels: {
        display: true, 
        anchor: 'center', 
        align: 'center',  
        formatter: (value) => {
          const parsedValue = parseFloat(value);
          if (parsedValue > 0) {
            return `${parsedValue.toFixed(0)}%`; 
          } else {
            return ''; 
          }
        },
        color: '#000', 
        font: {
          size: 12, 
        },
      },
      tooltip: {
        callbacks: {
          label: context => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += `${context.raw}%`;
            }
            return label;
          },
        },
      },
    },
  }), []);
  const barData = useMemo(() => ({
    labels: monthsInShort,
    datasets: [
      {
        label: 'Government',
        data: Object.values(aggregatedData3.sales).map(item => item.government),
        backgroundColor: '#FF6384',
      },
      {
        label: 'National Agency',
        data: Object.values(aggregatedData3.sales).map(item => item.nationalagency),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Local Agency',
        data: Object.values(aggregatedData3.sales).map(item => item.localagency),
        backgroundColor: '#FFCE56',
      },
      {
        label: 'Direct Client',
        data: Object.values(aggregatedData3.sales).map(item => item.directclient),
        backgroundColor: '#4BC0C0',
      },
    ],
  }), [aggregatedData3]);

  const percentageBarData = useMemo(() => ({
    labels: monthsInShort,
    datasets: [
      {
        label: 'Government',
        data: Object.values(aggregatedData3.sales).map((item, idx) =>
          totalSalesByMonth[idx]
            ? ((item.government / totalSalesByMonth[idx]) * 100).toFixed(2)
            : 0
        ),
        backgroundColor: '#FF6384',
      },
      {
        label: 'National Agency',
        data: Object.values(aggregatedData3.sales).map((item, idx) =>
          totalSalesByMonth[idx]
            ? ((item.nationalagency / totalSalesByMonth[idx]) * 100).toFixed(2)
            : 0
        ),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Local Agency',
        data: Object.values(aggregatedData3.sales).map((item, idx) =>
          totalSalesByMonth[idx]
            ? ((item.localagency / totalSalesByMonth[idx]) * 100).toFixed(2)
            : 0
        ),
        backgroundColor: '#FFCE56',
      },
      {
        label: 'Direct Client',
        data: Object.values(aggregatedData3.sales).map((item, idx) =>
          totalSalesByMonth[idx]
            ? ((item.directclient / totalSalesByMonth[idx]) * 100).toFixed(2)
            : 0
        ),
        backgroundColor: '#4BC0C0',
      },
    ],
  }), [aggregatedData3, totalSalesByMonth]);



  return (
    <div className="overflow-y-auto p-3 col-span-10 overflow-hidden">
      <div className="flex p-6 flex-col">
        <div>
          <div className="flex justify-between items-center">
            <p className="font-bold">Amount Sales Bar Chart</p>
          </div>
          <p className="text-sm text-gray-600 italic pt-3">
            This bar chart shows total sales by client type over the months of the financial year,
          </p>
          {isLoadingBookingData ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <div className="gap-10">
              <div className="pt-4 w-[50rem]">
                <Bar
                  ref={chartRef}
                  data={barData}
                  options={barChartOptions}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <p className="font-bold">Monthly Percentage Contribution Bar Chart</p>
          </div>
          <p className="text-sm text-gray-600 italic pt-3">
            This bar chart shows the percentage contribution of each client type to total sales for each month,
          </p>
          {isLoadingBookingData ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <div className="gap-10">
              <div className="pt-4 w-[50rem]">
                <Bar
                  ref={chartRef}
                  data={percentageBarData}
                  options={stackedBarOptions}
                  plugins={[ChartDataLabels]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaWiseReport;
