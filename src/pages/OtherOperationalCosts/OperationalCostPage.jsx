import React, { useMemo } from 'react';
import { useFetchMasters } from '../../apis/queries/masters.queries';
import { useFetchOperationalCostData } from '../../apis/queries/operationalCost.queries';
import { serialize } from '../../utils';
import { Pie, Line, Bar, Scatter } from 'react-chartjs-2';
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
} from 'chart.js';

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

const OperationalCostPage = () => {
  const { data: operationalCostTypes } = useFetchMasters(
    serialize({
      type: 'operational_cost_type',
      limit: 100,
      page: 1,
      sortBy: 'name',
      sortOrder: 'asc',
    }),
  );

  const { data: operationalCostData } = useFetchOperationalCostData();

  const totalAmountsByType = useMemo(() => {
    if (!operationalCostData || !operationalCostTypes) return {};

    return operationalCostTypes.docs.reduce((acc, type) => {
      const total = operationalCostData
        .filter(item => item.type.name === type.name)
        .reduce((sum, item) => sum + parseFloat(item.amount) || 0, 0);

      return {
        ...acc,
        [type.name]: total,
      };
    }, {});
  }, [operationalCostData, operationalCostTypes]);

  const chartLabels = Object.keys(totalAmountsByType);
  const chartData = Object.values(totalAmountsByType);

  const pieChartData = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: 'Operational Costs',
          data: chartData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#BB9AB1',
            '#6482AD',
            '#BC9F8B',
            '#FFAD60',
            '#4E31AA',
            '#7FA1C3',
            '#8C3061',
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#BB9AB1',
            '#6482AD',
            '#BC9F8B',
            '#FFAD60',
            '#4E31AA',
            '#7FA1C3',
            '#8C3061',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [chartLabels, chartData]);

  const lineChartData = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: 'Line Chart - Operational Costs',
          data: chartData,
          fill: false,
          borderColor: '#36A2EB',
          tension: 0.1,
        },
      ],
    };
  }, [chartLabels, chartData]);

  const barChartData = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: 'Bar Chart - Operational Costs',
          data: chartData,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#BB9AB1',
            '#6482AD',
            '#BC9F8B',
            '#FFAD60',
            '#4E31AA',
            '#7FA1C3',
            '#8C3061',
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#BB9AB1',
            '#6482AD',
            '#BC9F8B',
            '#FFAD60',
            '#4E31AA',
            '#7FA1C3',
            '#8C3061',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [chartLabels, chartData]);

  const scatterChartData = useMemo(() => {
    const scatterData = chartLabels.map((label, index) => ({
      x: index,
      y: chartData[index],
      label: label,
    }));

    return {
      datasets: [
        {
          label: 'Scatter Chart - Operational Costs',
          data: scatterData,
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
          borderWidth: 1,
          pointRadius: 5,
        },
      ],
    };
  }, [chartLabels, chartData]);

  const scatterOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        ticks: {
          callback: function (value, index) {
            return chartLabels[index];
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: tooltipItems => {
            return tooltipItems[0].raw.label;
          },
        },
      },
    },
  };

  return (
    <div className="flex gap-10">
      <div className="w-auto p-10">
        <h1 className="text-xl font-bold mb-4">Pie Chart</h1>
        <div className="w-80 m-auto">
          <Pie data={pieChartData} />
        </div>
      </div>
      <div className="w-auto p-10">
        <h1 className="text-xl font-bold mb-4">Line Chart</h1>
        <div className=" w-[40rem] m-auto">
          <Line data={lineChartData} />
        </div>
      </div>
      <div className="w-auto p-10">
        <h1 className="text-xl font-bold mb-4">Bar Chart</h1>
        <div className="w-[40rem] m-auto">
          <Bar data={barChartData} />
        </div>
      </div>
      <div className="w-auto p-10">
        <h1 className="text-xl font-bold mb-4">Scatter Chart</h1>
        <div className=" w-[40rem] m-auto">
          <Scatter data={scatterChartData} options={scatterOptions} />
        </div>
      </div>
    </div>
  );
};

export default OperationalCostPage;
