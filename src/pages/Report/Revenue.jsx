import { useCallback, useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, Loader } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import dayjs from 'dayjs';
import DomToPdf from 'dom-to-pdf';
import { v4 as uuidv4 } from 'uuid';
import Header from '../../components/Reports/Header';
import RevenueFilter from '../../components/Reports/RevenueFilter';
import ViewByFilter from '../../components/Reports/ViewByFilter';
import {
  useFetchFinanceByIndustry,
  useFetchFinanceByLocation,
  useFetchFinanceByStats,
} from '../../hooks/finance.hooks';
import { dateByQuarter, monthsInShort, serialize } from '../../utils';
import RevenueStatsContent from '../../components/Reports/Revenue/RevenueStatsContent';

dayjs.extend(quarterOfYear);

const DATE_FORMAT = 'YYYY-MM-DD';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Title,
  Legend,
);

const barDataConfigByLocation = {
  options: {
    responsive: true,
  },
  styles: {
    backgroundColor: '#914EFB',
    cubicInterpolationMode: 'monotone',
  },
};

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

const options = {
  responsive: true,
};

const lineData = {
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

const RevenueReport = () => {
  const [updatedLocation, setUpdatedLocation] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: 'City or State',
        data: [],
        ...barDataConfigByLocation.styles,
      },
    ],
  });

  const [queryByLocation, setQueryByLocation] = useState({
    'by': 'city',
    'startDate': dayjs().startOf('year').format(DATE_FORMAT),
    'endDate': dayjs().endOf('year').format(DATE_FORMAT),
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

  const [queryByIndustry, setQueryByIndustry] = useState({
    'startDate': dayjs().startOf('year').format(DATE_FORMAT),
    'endDate': dayjs().endOf('year').format(DATE_FORMAT),
  });

  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter(!showFilter);

  const { data: revenueData } = useFetchFinanceByStats();
  const { data: revenueDataByLocation, isLoading: isByLocationLoading } = useFetchFinanceByLocation(
    serialize(queryByLocation),
  );
  const { data: revenueDataByIndustry, isLoading: isByIndustryLoading } = useFetchFinanceByIndustry(
    serialize(queryByIndustry),
  );

  const handleLocationViewBy = viewType => {
    if (viewType === 'reset') {
      setQueryByLocation(prevState => ({
        ...prevState,
        'startDate': dayjs().startOf('year').format(DATE_FORMAT),
        'endDate': dayjs().endOf('year').format(DATE_FORMAT),
      }));
    }
    if (viewType === 'week' || viewType === 'month' || viewType === 'year') {
      setQueryByLocation(prevState => ({
        ...prevState,
        'startDate': dayjs().startOf(viewType).format(DATE_FORMAT),
        'endDate': dayjs().endOf(viewType).format(DATE_FORMAT),
      }));
    }
    if (viewType === 'quarter') {
      setQueryByLocation(prevState => ({
        ...prevState,
        ...dateByQuarter[dayjs().quarter()],
      }));
    }
  };

  const handleIndustryViewBy = viewType => {
    if (viewType === 'reset') {
      setQueryByIndustry(prevState => ({
        ...prevState,
        'startDate': dayjs().startOf('year').format(DATE_FORMAT),
        'endDate': dayjs().endOf('year').format(DATE_FORMAT),
      }));
    }
    if (viewType === 'week' || viewType === 'month' || viewType === 'year') {
      setQueryByIndustry(prevState => ({
        ...prevState,
        'startDate': dayjs().startOf(viewType).format(DATE_FORMAT),
        'endDate': dayjs().endOf(viewType).format(DATE_FORMAT),
      }));
    }
    if (viewType === 'quarter') {
      setQueryByIndustry(prevState => ({
        ...prevState,
        ...dateByQuarter[dayjs().quarter()],
      }));
    }
  };

  const downloadPdf = () => {
    const element = document.getElementById('revenue-pdf');
    const option = {
      filename: 'revenue.pdf',
    };
    DomToPdf(element, option);
  };

  const handleUpdatedReveueByLocation = useCallback(() => {
    const tempBarData = { ...updatedLocation, id: uuidv4() };
    if (revenueDataByLocation) {
      revenueDataByLocation?.forEach((item, index) => {
        tempBarData.labels[index] = item?._id;
        tempBarData.datasets[0].data[index] = item?.total;
      });
      setUpdatedLocation(tempBarData);
    }
  }, [revenueDataByLocation]);

  const handleUpdatedReveueByIndustry = useCallback(() => {
    const tempBarData = { ...updatedIndustry, id: uuidv4() };
    if (revenueDataByIndustry) {
      revenueDataByIndustry?.forEach((item, index) => {
        tempBarData.labels[index] = item?._id;
        tempBarData.datasets[0].data[index] = item?.total;
      });
      setUpdatedIndustry(tempBarData);
    }
  }, [revenueDataByIndustry]);

  useEffect(() => {
    handleUpdatedReveueByLocation();
  }, [revenueDataByLocation]);

  useEffect(() => {
    handleUpdatedReveueByIndustry();
  }, [revenueDataByIndustry]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
        <Header text="Revenue Report" onClickDownloadPdf={downloadPdf} />
        <div className="mr-7 pl-5 mt-5 mb-10" id="revenue-pdf">
          <RevenueStatsContent revenueData={revenueData} />
          <div className="flex gap-8">
            <div className="w-[70%] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <p className="font-bold">Revenue Graph</p>
                {/* TODO: wip */}
                <ViewByFilter handleViewBy={() => {}} />
              </div>
              <div className="flex flex-col pl-7 relative">
                <p className="transform rotate-[-90deg] absolute left-[-25px] top-[40%]">
                  In Lakhs &gt;
                </p>
                <Line height="100" data={lineData} options={options} />
                <p className="text-center">Months &gt;</p>
              </div>
            </div>
            <div className="w-[30%] flex flex-col">
              <div className="flex justify-between items-start">
                <p className="font-bold">Industry wise revenue graph</p>
                <ViewByFilter handleViewBy={handleIndustryViewBy} />
              </div>
              <div className="w-80 m-auto">
                {isByIndustryLoading ? (
                  <Loader className="mx-auto" />
                ) : !updatedIndustry.length ? (
                  <p className="text-center">NA</p>
                ) : (
                  <Pie
                    data={updatedIndustry}
                    options={barDataConfigByIndustry.options}
                    key={uuidv4()}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="my-10">
            <div className="flex justify-between items-center">
              <p className="font-bold">City Or State</p>
              <div className="flex justify-around">
                <div className="mx-2">
                  <Button onClick={toggleFilter} variant="default" className="font-medium">
                    <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                  </Button>
                  {showFilter && (
                    <RevenueFilter
                      isOpened={showFilter}
                      setShowFilter={setShowFilter}
                      handleQueryByLocation={setQueryByLocation}
                      queryByLocation={queryByLocation}
                    />
                  )}
                </div>
                <ViewByFilter handleViewBy={handleLocationViewBy} />
              </div>
            </div>
            <div className="flex flex-col pl-7 relative">
              <p className="transform rotate-[-90deg] absolute left-[-15px] top-[40%]">
                Total &gt;
              </p>
              {isByLocationLoading ? (
                <Loader className="mx-auto my-10" />
              ) : (
                <Bar
                  height="80"
                  data={updatedLocation}
                  options={barDataConfigByLocation.options}
                  key={uuidv4()}
                />
              )}
              <p className="text-center">City or State &gt;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
