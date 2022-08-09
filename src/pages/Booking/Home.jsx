import { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Text } from '@mantine/core';
import AreaHeader from '../../components/Bookings/Header';
import useSideBarState from '../../store/sidebar.the.store';
import ongoing from '../../assets/ongoing.svg';
import completed from '../../assets/completed.svg';
import upcoming from '../../assets/upcoming.svg';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  datasets: [
    {
      data: [3425, 3425],
      backgroundColor: ['#FF900E', '#914EFB'],
      borderColor: ['#FF900E', '#914EFB'],
      borderWidth: 1,
    },
  ],
};
const config = {
  type: 'line',
  data,
  options: { responsive: true },
};

const Proposals = () => {
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(1);
  }, []);

  return (
    <div className="col-span-10 border-gray-450 border-l">
      <AreaHeader text="Order" />
      <div className="pr-7">
        <div className="mt-5 pl-5">
          <Text className="mb-2" weight="bolder" size="xl">
            Stats
          </Text>
          <div className="flex justify-between gap-4">
            <div className="flex gap-4 p-4 border rounded-md items-center">
              <div className="w-32">
                <Doughnut options={config.options} data={config.data} />
              </div>
              <div>
                <Text size="md">Revenue Breakup</Text>
                <div className="flex gap-8 mt-6">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <Text size="xs" weight="200">
                        Online Sale
                      </Text>
                      <Text weight="bolder" size="xl">
                        1233
                      </Text>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <Text size="xs" weight="200">
                        Offline Sale
                      </Text>
                      <Text weight="bolder" size="xl">
                        1233
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-between">
              <div className="border rounded p-8  pr-20">
                <img src={ongoing} alt="ongoing" />
                <Text className="my-2" size="sm" weight="200">
                  Ongoing Orders
                </Text>
                <Text weight="bold">386387</Text>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={upcoming} alt="upcoming" />
                <Text className="my-2" size="sm" weight="200">
                  Upcoming Orders
                </Text>
                <Text weight="bold">386387</Text>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={completed} alt="completed" />
                <Text className="my-2" size="sm" weight="200">
                  Completed Orders
                </Text>
                <Text weight="bold">386387</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposals;
