import { Box, Image } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Title,
  BarElement,
  Tooltip,
} from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import InitiateDiscussionIcon from '../../../assets/message-share.svg';
import InProgressIcon from '../../../assets/git-branch.svg';
import CompleteIcon from '../../../assets/discount-check.svg';
import LostIcon from '../../../assets/file-percent.svg';
import { useLeadStats } from '../../../apis/queries/leads.queries';
import { financialEndDate, financialStartDate, serialize } from '../../../utils';
import { DATE_FORMAT } from '../../../utils/constants';

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
  Title,
);

const LeadsStats = () => {
  const leadStatsQuery = useLeadStats(
    serialize({
      from: dayjs(financialStartDate).format(DATE_FORMAT),
      to: dayjs(financialEndDate).format(DATE_FORMAT),
    }),
    !!financialStartDate && !!financialEndDate,
  );

  const leadsPieConfig = {
    options: {
      responsive: true,
    },
    styles: {
      backgroundColor: ['#FF900E', '#914EFB', '#4BC0C0', '#EF4444'],
      borderColor: ['#FF900E', '#914EFB', '#4BC0C0', '#EF4444'],
      borderWidth: 1,
    },
  };

  const [updatedLeadsChart, setUpdatedLeadsChart] = useState({
    id: uuidv4(),
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        ...leadsPieConfig.styles,
      },
    ],
  });

  const handleUpdatedLeadsStatsChart = useCallback(() => {
    const tempBarData = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          ...leadsPieConfig.styles,
        },
      ],
    };
    if (leadStatsQuery.data) {
      tempBarData.datasets[0].data[0] = leadStatsQuery?.data?.stage?.filter(
        ({ _id }) => _id === 'initiateDiscussion',
      )?.[0]?.count;
      tempBarData.datasets[0].data[1] =
        leadStatsQuery?.data?.stage?.filter(({ _id }) => _id === 'inProgress')?.[0]?.count || 0;
      tempBarData.datasets[0].data[2] = leadStatsQuery?.data?.stage?.filter(
        ({ _id }) => _id === 'converted',
      )?.[0]?.count;
      tempBarData.datasets[0].data[3] = leadStatsQuery?.data?.stage?.filter(
        ({ _id }) => _id === 'lost',
      )?.[0]?.count;

      setUpdatedLeadsChart(tempBarData);
    }
  }, [leadStatsQuery.data]);

  useEffect(() => handleUpdatedLeadsStatsChart(), [leadStatsQuery?.data]);

  return (
    <div className="mx-2 my-6 p-4 border border-gray-200 rounded-md font-bold">
      <div className="pb-4 text-lg">Lead Stats</div>
      <div className="flex justify-between gap-3">
        <div className="w-full">
          <Box className="w-36">
            {updatedLeadsChart.datasets?.[0].data.every(item => item === 0) ? (
              <p className="text-center font-bold text-md my-12">NA</p>
            ) : (
              <Pie
                data={updatedLeadsChart}
                options={leadsPieConfig.options}
                key={updatedLeadsChart.id}
              />
            )}
          </Box>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={InitiateDiscussionIcon} alt="icon" width={20} />
          <div className="font-normal w-full">Initiate Discussion</div>
          <div className="text-2xl font-bold text-orange-350">
            {leadStatsQuery?.data?.stage?.filter(({ _id }) => _id === 'initiateDiscussion')?.[0]
              ?.count || 0}
          </div>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={InProgressIcon} alt="icon" width={20} />
          <div className="font-normal w-full">In Progress</div>
          <div className="text-2xl font-bold text-purple-350">
            {leadStatsQuery?.data?.stage?.filter(({ _id }) => _id === 'inProgress')?.[0]?.count ||
              0}
          </div>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={CompleteIcon} alt="icon" width={20} />
          <div className="font-normal w-full">Complete</div>
          <div className="text-2xl font-bold text-green-350">
            {leadStatsQuery?.data?.stage?.filter(({ _id }) => _id === 'converted')?.[0]?.count || 0}
          </div>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={LostIcon} alt="icon" width={20} />
          <div className="font-normal w-full">Lost</div>
          <div className="text-2xl font-bold text-red-500">
            {' '}
            {leadStatsQuery?.data?.stage?.filter(({ _id }) => _id === 'lost')?.[0]?.count || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsStats;
