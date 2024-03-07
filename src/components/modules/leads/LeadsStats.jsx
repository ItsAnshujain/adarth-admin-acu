import { Box, Image } from '@mantine/core';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { v4 as uuidv4 } from 'uuid';
import InitiateDiscussionIcon from '../../../assets/message-share.svg';
import InProgressIcon from '../../../assets/git-branch.svg';
import CompleteIcon from '../../../assets/discount-check.svg';
import LostIcon from '../../../assets/file-percent.svg';

const LeadsStats = () => {
  const leadsPieConfig = {
    options: {
      responsive: true,
    },
    styles: {
      backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(145, 78, 251, 1)', 'rgba(255, 144, 14 , 1)'],
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

  return (
    <div className="mx-2 my-6 p-4 border border-gray-200 rounded-md font-bold">
      <div className="pb-4 text-lg">Leads Stats</div>
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
          <div className="text-2xl font-bold text-orange-350">1</div>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={InProgressIcon} alt="icon" width={20} />
          <div className="font-normal w-full">In Progress</div>
          <div className="text-2xl font-bold text-purple-350">1</div>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={CompleteIcon} alt="icon" width={20} />
          <div className="font-normal w-full">Complete</div>
          <div className="text-2xl font-bold text-green-350">1</div>
        </div>
        <div className="text-base font-semibold border border-gray-200 py-4 px-4 rounded-md w-full flex flex-col gap-2">
          <Image src={LostIcon} alt="icon" width={20} />
          <div className="font-normal w-full">Lost</div>
          <div className="text-2xl font-bold text-red-500">1</div>
        </div>
      </div>
    </div>
  );
};

export default LeadsStats;
