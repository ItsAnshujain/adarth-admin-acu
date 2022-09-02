import { Line, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import AreaHeader from '../components/Home/Header';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import greenFolder from '../assets/ongoing.svg';
import blueFolder from '../assets/completed.svg';
import orangeFolder from '../assets/upcoming.svg';

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Title,
);

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

const lineData = {
  labels,
  datasets: [
    {
      label: 'Revenue',
      data: [10, 0, 23, 23, 31, 23, 5, 21, 22, 12, 3, 4],
      borderColor: '#914EFB',
      backgroundColor: '#914EFB',
      cubicInterpolationMode: 'monotone',
    },
  ],
};

// Doughnut
const data = {
  datasets: [
    {
      data: [3425, 3425],
      backgroundColor: ['#914EFB', '#FF900E'],
      borderColor: ['#914EFB', '#FF900E'],
      borderWidth: 1,
    },
  ],
};
const config = {
  type: 'line',
  data,
  options: { responsive: true },
};

const HomePage = () => (
  <div className="absolute top-0">
    <Header title="Home" />
    <div className="grid grid-cols-12">
      <Sidebar />
      <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
        <AreaHeader text="Hello, Adarth" />
        <div className="pr-7 pl-5 mt-5 mb-10">
          <div className="flex justify-between gap-4 flex-wrap mb-8">
            <div className="border rounded p-8 flex-1">
              <img src={orangeFolder} alt="folder" />
              <p className="my-2 text-xs font-light text-slate-400">Total Campaign(Overall)</p>
              <p className="font-bold">386387</p>
            </div>
            <div className="border rounded p-8  flex-1">
              <img src={blueFolder} alt="folder" />
              <p className="my-2 text-xs font-light text-slate-400">Total Ongoing Campaign</p>
              <p className="font-bold">386387</p>
            </div>
            <div className="border rounded p-8  flex-1">
              <img src={greenFolder} alt="folder" />
              <p className="my-2 text-xs font-light text-slate-400">Upcoming Campaign</p>
              <p className="font-bold">386387</p>
            </div>
            <div className="border rounded p-8 flex-1">
              <img src={greenFolder} alt="folder" />
              <p className="my-2 text-xs font-light text-slate-400">Completed Campaign</p>
              <p className="font-bold">386387</p>
            </div>
            <div className="border rounded p-8 flex-1">
              <img src={greenFolder} alt="folder" />
              <p className="my-2 text-xs font-light text-slate-400">Vacant</p>
              <p className="font-bold">386387</p>
            </div>
            <div className="border rounded p-8  flex-1">
              <img src={blueFolder} alt="folder" />
              <p className="my-2 text-xs font-light text-slate-400">Occupied</p>
              <p className="font-bold">386387</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pr-7">
            <div className="w-[68%]">
              <p className="font-bold mb-5">Revenue Graph</p>
              <Line height="80" data={lineData} options={options} />
            </div>
            <div className="flex gap-4 p-4 border rounded-md items-center justify-center flex-1 flex-wrap-reverse">
              <div className="w-32">
                <Doughnut options={config.options} data={config.data} />
              </div>
              <div>
                <p className="font-medium text-center">Health Status</p>
                <div className="flex gap-8 mt-6 flex-wrap">
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Healthy</p>
                      <p className="font-bold text-lg">1233</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                    <div>
                      <p className="my-2 text-xs font-light text-slate-400">Unhealthy</p>
                      <p className="font-bold text-lg">1233</p>
                    </div>
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

export default HomePage;
