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
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import classNames from 'classnames';
import { useModals } from '@mantine/modals';
import Header from '../../components/Reports/Header';
import RevenueFilter from '../../components/Reports/RevenueFilter';
import {
  useBookingReportByRevenueStats,
  useBookingReportByRevenueGraph,
  useBookingRevenueByIndustry,
  useBookingRevenueByLocation,
} from '../../hooks/booking.hooks';
import {
  dateByQuarter,
  daysInAWeek,
  downloadPdf,
  monthsInShort,
  quarters,
  serialize,
} from '../../utils';
import RevenueStatsContent from '../../components/Reports/Revenue/RevenueStatsContent';
import ViewByFilter from '../../components/Reports/ViewByFilter';
import { useShareReport } from '../../hooks/report.hooks';
import modalConfig from '../../utils/modalConfig';
import ShareContent from '../../components/Reports/ShareContent';

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
    maintainAspectRatio: false,
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
  maintainAspectRatio: false,
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
  const modals = useModals();
  const [searchParams] = useSearchParams();
  const { mutateAsync, isLoading: isDownloadLoading } = useShareReport();

  const share = searchParams.get('share');

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

  const [queryByReveueGraph, setQueryByRevenueGraph] = useState({
    'groupBy': 'month',
    'startDate': dayjs().startOf('year').format(DATE_FORMAT),
    'endDate': dayjs().endOf('year').format(DATE_FORMAT),
  });

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

  const { data: revenueData } = useBookingReportByRevenueStats();
  const {
    data: revenueGraphData,
    isLoading: isRevenueGraphLoading,
    isSuccess,
  } = useBookingReportByRevenueGraph(serialize(queryByReveueGraph));
  const { data: revenueDataByLocation, isLoading: isByLocationLoading } =
    useBookingRevenueByLocation(serialize(queryByLocation));
  const { data: revenueDataByIndustry, isLoading: isByIndustryLoading } =
    useBookingRevenueByIndustry(serialize(queryByIndustry));

  const handleRevenueGraphViewBy = viewType => {
    if (viewType === 'reset') {
      const startDate = dayjs().startOf('year').format(DATE_FORMAT);
      const endDate = dayjs().endOf('year').format(DATE_FORMAT);
      setQueryByLocation({
        'by': 'city',
        startDate,
        endDate,
      });

      setQueryByIndustry({
        startDate,
        endDate,
      });

      setQueryByRevenueGraph({
        'groupBy': 'month',
        startDate,
        endDate,
      });
    }

    if (viewType === 'week' || viewType === 'month' || viewType === 'year') {
      const startDate = dayjs().startOf(viewType).format(DATE_FORMAT);
      const endDate = dayjs().endOf(viewType).format(DATE_FORMAT);

      setQueryByLocation(prevState => ({
        ...prevState,
        startDate,
        endDate,
      }));

      setQueryByIndustry(prevState => ({
        ...prevState,
        startDate,
        endDate,
      }));

      setQueryByRevenueGraph(prevState => ({
        ...prevState,
        'groupBy':
          viewType === 'year'
            ? 'month'
            : viewType === 'month'
            ? 'dayOfMonth'
            : viewType === 'week'
            ? 'dayOfWeek'
            : 'month',
        startDate,
        endDate,
      }));
    }
    if (viewType === 'quarter') {
      setQueryByLocation(prevState => ({
        ...prevState,
        ...dateByQuarter[dayjs().quarter()],
      }));

      setQueryByIndustry(prevState => ({
        ...prevState,
        ...dateByQuarter[dayjs().quarter()],
      }));

      setQueryByRevenueGraph({
        'groupBy': 'quarter',
        ...dateByQuarter[dayjs().quarter()],
      });
    }
  };

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

  const handleUpdateRevenueGraph = useCallback(() => {
    if (revenueGraphData) {
      const tempData = {
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
      tempData.labels =
        queryByReveueGraph.groupBy === 'dayOfWeek'
          ? daysInAWeek
          : queryByReveueGraph.groupBy === 'dayOfMonth'
          ? Array.from({ length: dayjs().daysInMonth() }, (_, index) => index + 1)
          : queryByReveueGraph.groupBy === 'quarter'
          ? quarters
          : monthsInShort;

      tempData.datasets[0].data = Array.from({ length: dayjs().daysInMonth() }, () => 0);

      revenueGraphData?.forEach(item => {
        if (item._id) {
          tempData.datasets[0].data[item._id - 1] = item.total / 100000 || 0;
        }
      });

      setUpdatedRevenueGraph(tempData);
    }
  }, [revenueGraphData]);

  const handleUpdatedReveueByLocation = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: 'City or State',
          data: [],
          ...barDataConfigByLocation.styles,
        },
      ],
    };
    if (revenueDataByLocation) {
      revenueDataByLocation?.forEach((item, index) => {
        tempBarData.labels[index] = item?._id;
        tempBarData.datasets[0].data[index] = item?.total;
      });
      setUpdatedLocation(tempBarData);
    }
  }, [revenueDataByLocation]);

  const handleUpdatedReveueByIndustry = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          ...barDataConfigByIndustry.styles,
        },
      ],
    };
    if (revenueDataByIndustry) {
      revenueDataByIndustry?.forEach((item, index) => {
        tempBarData.labels[index] = item?._id;
        tempBarData.datasets[0].data[index] = item?.total;
      });
      setUpdatedIndustry(tempBarData);
    }
  }, [revenueDataByIndustry]);

  useEffect(() => {
    handleUpdateRevenueGraph();
  }, [revenueGraphData, isSuccess]);

  useEffect(() => {
    handleUpdatedReveueByLocation();
  }, [revenueDataByLocation]);

  useEffect(() => {
    handleUpdatedReveueByIndustry();
  }, [revenueDataByIndustry]);

  return (
    <div
      className={classNames(
        'border-l border-gray-450 overflow-y-auto',
        share !== 'report' ? 'col-span-10 ' : 'col-span-12',
      )}
    >
      {share !== 'report' ? (
        <Header
          text="Revenue Report"
          onClickDownloadPdf={handleDownloadPdf}
          onClickSharePdf={toggleShareOptions}
          isDownloadLoading={isDownloadLoading}
        />
      ) : null}
      <div className="mr-7 pl-5 mt-5 mb-10" id="revenue-pdf">
        <RevenueStatsContent revenueData={revenueData} />
        {share !== 'report' ? (
          <div className="h-[60px] border-b border-t my-5 border-gray-450 flex justify-end items-center">
            <ViewByFilter handleViewBy={handleRevenueGraphViewBy} />
          </div>
        ) : null}
        <div className="flex gap-8">
          <div className="w-[70%] flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-between items-center">
              <p className="font-bold">Revenue Graph</p>
            </div>
            {isRevenueGraphLoading ? (
              <Loader className="m-auto" />
            ) : (
              <div className="flex flex-col pl-7 relative">
                <p className="transform rotate-[-90deg] absolute left-[-25px] top-[40%]">
                  In Lakhs &gt;
                </p>
                <div className="max-h-[350px]">
                  <Line
                    // height="100"
                    data={updatedReveueGraph}
                    options={options}
                    key={updatedReveueGraph.id}
                    className="w-full"
                  />
                </div>
                <p className="text-center">Months &gt;</p>
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

        <div className="my-10">
          <div className="flex justify-between items-center">
            <p className="font-bold">City Or State</p>
            <div className="flex justify-around">
              <div className="mx-2">
                {share !== 'report' ? (
                  <Button onClick={toggleFilter} variant="default" className="font-medium">
                    <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                  </Button>
                ) : null}
                {showFilter && (
                  <RevenueFilter
                    isOpened={showFilter}
                    setShowFilter={setShowFilter}
                    handleQueryByLocation={setQueryByLocation}
                    queryByLocation={queryByLocation}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col pl-7 relative">
            <p className="transform rotate-[-90deg] absolute left-[-15px] top-[40%]">Total &gt;</p>
            {isByLocationLoading ? (
              <Loader className="mx-auto my-10" />
            ) : (
              <div className="max-h-[350px]">
                <Bar
                  // height="80"
                  data={updatedLocation}
                  options={barDataConfigByLocation.options}
                  key={updatedLocation.id}
                  className="w-full"
                />
              </div>
            )}
            <p className="text-center">City or State &gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
