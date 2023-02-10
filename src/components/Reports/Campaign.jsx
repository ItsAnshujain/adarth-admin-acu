import { Image, Loader } from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import DomToPdf from 'dom-to-pdf';
import Header from './Header';
import TotalCampaignIcon from '../../assets/total-campaign.svg';
import OngoingCampaignIcon from '../../assets/ongoing-campaign.svg';
import UpcomingCampaignIcon from '../../assets/upcoming-campaign.svg';
import CompletedCampaignIcon from '../../assets/completed-campaign.svg';
import ImpressionsIcon from '../../assets/impressions.svg';
import { useCampaignReport, useCampaignStats } from '../../hooks/campaigns.hooks';
import ViewByFilter from './ViewByFilter';

dayjs.extend(quarterOfYear);

const DATE_FORMAT = 'YYYY-MM-DD';

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement, Title);
const options = {
  responsive: true,
};

const labels = [
  'Jan',
  'Febr',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Doughnut data
const config = {
  type: 'line',
  options: { responsive: true },
};

const Campaign = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatedBarData, setUpdatedBarData] = useState({
    id: uuidv4(),
    labels,
    datasets: [
      {
        label: 'Upcoming',
        data: Array.from({ length: 12 }, () => 0),
        backgroundColor: '#FF900E',
      },
      {
        label: 'Ongoing',
        data: Array.from({ length: 12 }, () => 0),
        backgroundColor: '#914EFB',
      },
      {
        label: 'Completed',
        data: Array.from({ length: 12 }, () => 0),
        backgroundColor: '#28B446',
      },
    ],
  });

  const { data: stats, isLoading: isStatsLoading } = useCampaignStats();
  const {
    data: report,
    isLoading: isReportLoading,
    isSuccess,
  } = useCampaignReport(searchParams.toString());

  const handleViewBy = viewType => {
    if (viewType === 'reset') {
      searchParams.delete('startDate');
      searchParams.delete('endDate');
    }
    if (viewType === 'week' || viewType === 'month' || viewType === 'year') {
      searchParams.set('startDate', dayjs().format(DATE_FORMAT));
      searchParams.set('endDate', dayjs().add(1, viewType).format(DATE_FORMAT));
    }
    if (viewType === 'quarter') {
      searchParams.set('startDate', dayjs().format(DATE_FORMAT));
      searchParams.set(
        'endDate',
        dayjs(dayjs().format(DATE_FORMAT)).quarter(2).format(DATE_FORMAT),
      );
    }
    setSearchParams(searchParams);
  };

  const healthStatusData = useMemo(
    () => ({
      datasets: [
        {
          data: [stats?.unhealthy ?? 0, stats?.healthy ?? 0],
          backgroundColor: ['#914EFB', '#FF900E'],
          borderColor: ['#914EFB', '#FF900E'],
          borderWidth: 1,
        },
      ],
    }),
    [stats],
  );

  const printStatusData = useMemo(
    () => ({
      datasets: [
        {
          data: [stats?.printCompleted ?? 0, stats?.printOngoing ?? 0],
          backgroundColor: ['#914EFB', '#FF900E'],
          borderColor: ['#914EFB', '#FF900E'],
          borderWidth: 1,
        },
      ],
    }),
    [stats],
  );

  const mountStatusData = useMemo(
    () => ({
      datasets: [
        {
          data: [stats?.mountCompleted ?? 0, stats?.mountOngoing ?? 0],
          backgroundColor: ['#914EFB', '#FF900E'],
          borderColor: ['#914EFB', '#FF900E'],
          borderWidth: 1,
        },
      ],
    }),
    [stats],
  );

  const calculateBarData = useCallback(() => {
    setUpdatedBarData(prevState => {
      const tempBarData = { ...prevState, id: uuidv4() };
      // if (report) {
      //   report?.forEach(item => {
      //     if (item._id.month) {
      //       if (item.upcoming) {
      //         tempBarData.datasets[0].data[item._id.month - 1] = item.upcoming;
      //       }
      //       if (item.ongoing) {
      //         tempBarData.datasets[1].data[item._id.month - 1] = item.ongoing;
      //       }
      //       if (item.completed) {
      //         tempBarData.datasets[2].data[item._id.month - 1] = item.completed;
      //       }
      //     }
      //   });
      // }
      return tempBarData;
    });
  }, [report]);

  console.log(report);
  const downloadPdf = () => {
    const element = document.getElementById('campaign-pdf');
    const option = {
      filename: 'campaign.pdf',
    };
    DomToPdf(element, option);
  };

  useEffect(() => {
    calculateBarData();
  }, [report, isSuccess]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header text="Campaign Report" onClickDownloadPdf={downloadPdf} />
      <div className="pr-7 pl-5 mt-5" id="campaign-pdf">
        <div className="flex justify-between gap-4 flex-wrap mb-8">
          <div className="flex gap-2 w-2/3 flex-wrap">
            <div className="border rounded p-8 flex-1">
              <Image src={TotalCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Total Campaign(Overall)</p>
              <p className="font-bold">{stats?.total ?? 0}</p>
            </div>
            <div className="border rounded p-8  flex-1">
              <Image src={OngoingCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Total Ongoing Campaign</p>
              <p className="font-bold">{stats?.ongoing ?? 0}</p>
            </div>
            <div className="border rounded p-8  flex-1">
              <Image src={UpcomingCampaignIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Upcoming Campaign</p>
              <p className="font-bold">{stats?.upcoming ?? 0}</p>
            </div>
            <div className="border rounded p-8 flex-1">
              <Image
                src={CompletedCampaignIcon}
                alt="folder"
                fit="contain"
                height={24}
                width={24}
              />
              <p className="my-2 text-sm font-light text-slate-400">Completed Campaign</p>
              <p className="font-bold">{stats?.completed ?? 0}</p>
            </div>
            <div className="border rounded p-8 flex-1">
              <Image src={ImpressionsIcon} alt="folder" fit="contain" height={24} width={24} />
              <p className="my-2 text-sm font-light text-slate-400">Total Impression Count</p>
              <p className="font-bold">{stats?.impression ?? 0}</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 border rounded-md items-center flex-1 flex-wrap-reverse">
            <div className="w-32">
              {isStatsLoading ? (
                <Loader className="mx-auto" />
              ) : (
                <Doughnut options={config.options} data={healthStatusData} />
              )}
            </div>
            <div>
              <p className="font-medium">Health Status</p>
              <div className="flex gap-8 mt-6 flex-wrap">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
                    <p className="font-bold text-lg">{stats?.healthy ?? 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
                    <p className="font-bold text-lg">{stats?.unhealthy ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-2/3">
            <div className="flex justify-between items-center">
              <p className="font-bold tracking-wide">Campaign Report</p>
              <div className="border rounded px-4 py-2 flex my-4">
                <p className="my-2 text-sm font-light text-slate-400 mr-5">
                  Total Proposals Sent:{' '}
                  <span className="font-bold">{report?.proposal?.sent ?? 0}</span>
                </p>
                <p className="my-2 text-sm font-light text-slate-400">
                  Total Proposals Created:{' '}
                  <span className="font-bold">{report?.proposal?.created ?? 0}</span>
                </p>
              </div>
              <ViewByFilter handleViewBy={handleViewBy} />
            </div>

            <div>
              {isReportLoading ? (
                <Loader className="mx-auto" mt={80} />
              ) : (
                <Bar options={options} data={updatedBarData} key={updatedBarData.id} />
              )}
            </div>
          </div>
          <div className="flex flex-col w-1/3 gap-4 ">
            <div className="flex gap-4 p-4 border rounded-md items-center min-h-[200px]">
              <div className="w-32">
                {isStatsLoading ? (
                  <Loader className="mx-auto" />
                ) : (
                  <Doughnut options={config.options} data={printStatusData} />
                )}
              </div>
              <div>
                <p className="font-medium">Printing Status</p>
                <div className="flex gap-8 mt-6 flex-wrap">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Ongoing</p>
                      <p className="font-bold text-lg">{stats?.printOngoing ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Completed</p>
                      <p className="font-bold text-lg">{stats?.printCompleted ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 p-4 border rounded-md items-center min-h-[200px]">
              <div className="w-32">
                {isStatsLoading ? (
                  <Loader className="mx-auto" />
                ) : (
                  <Doughnut options={config.options} data={mountStatusData} />
                )}
              </div>
              <div>
                <p className="font-medium">Mounting Status</p>
                <div className="flex gap-8 mt-6 flex-wrap">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Ongoing</p>
                      <p className="font-bold text-lg">{stats?.mountOngoing ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Completed</p>
                      <p className="font-bold text-lg">{stats?.mountCompleted ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
