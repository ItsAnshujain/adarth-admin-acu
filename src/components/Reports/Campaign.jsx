import { Button, Image, Loader } from '@mantine/core';
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
import Header from './Header';
import calendar from '../../assets/data-table.svg';
import DateRange from '../DateRange';
import TotalCampaignIcon from '../../assets/total-campaign.svg';
import OngoingCampaignIcon from '../../assets/ongoing-campaign.svg';
import UpcomingCampaignIcon from '../../assets/upcoming-campaign.svg';
import CompletedCampaignIcon from '../../assets/completed-campaign.svg';
import ImpressionsIcon from '../../assets/impressions.svg';
import { useCampaignReport, useCampaignStats } from '../../hooks/campaigns.hooks';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const [updatedBarData, setUpdatedBarData] = useState({
    id: uuidv4(),
    labels,
    datasets: [
      {
        label: 'Upcoming',
        data: Array.from({ length: 12 }, () => 0),
        backgroundColor: '#28B446',
      },
      {
        label: 'Ongoing',
        data: Array.from({ length: 12 }, () => 0),
        backgroundColor: '#FF900E',
      },
      {
        label: 'Completed',
        data: Array.from({ length: 12 }, () => 0),
        backgroundColor: '#914EFB',
      },
    ],
  });

  const { data: stats, isLoading: isStatsLoading } = useCampaignStats();
  const { data: report, isLoading: isReportLoading, isSuccess } = useCampaignReport();

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
      if (report) {
        report?.forEach(item => {
          if (item._id.month) {
            if (item.upcoming) {
              tempBarData.datasets[0].data[item._id.month - 1] = item.upcoming;
            }
            if (item.ongoing) {
              tempBarData.datasets[1].data[item._id.month - 1] = item.ongoing;
            }
            if (item.completed) {
              tempBarData.datasets[2].data[item._id.month - 1] = item.completed;
            }
          }
        });
      }
      return tempBarData;
    });
  }, [report]);

  useEffect(() => {
    calculateBarData();
  }, [report, isSuccess]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto pb-28">
      <Header text="Campaign Report" />
      <div className="pr-7 pl-5 mt-5 mb-10">
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
            <div className="flex justify-between">
              <p className="font-bold tracking-wide">Campaign Report</p>
              <div className="flex justify-around">
                <div className="mr-2 relative">
                  <Button onClick={toggleDatePicker} variant="default">
                    <img src={calendar} className="h-5" alt="calendar" />
                  </Button>
                  {showDatePicker && (
                    <div className="absolute z-20 -translate-x-2/3 bg-white -top-0.3">
                      <DateRange handleClose={toggleDatePicker} />
                    </div>
                  )}
                </div>
              </div>
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
            <div className="flex gap-4 p-4 border rounded-md items-center flex-1 flex-wrap-reverse">
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
            <div className="flex gap-4 p-4 border rounded-md items-center flex-1 flex-wrap-reverse">
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
