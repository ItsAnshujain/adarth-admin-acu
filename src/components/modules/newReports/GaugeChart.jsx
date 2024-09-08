import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

// Custom plugin for drawing the needle
const drawNeedlePlugin = {
  id: 'drawNeedle',
  afterDatasetDraw(chart, args, options) {
    const { ctx, data, chartArea: { width, height }, scales } = chart;
    const dataset = data.datasets[0];

    // Validate needleValue
    const needleValue = options.needleValue ?? 0; // Default to 0 if not provided
    const dataTotal = dataset.data.reduce((a, b) => a + b, 0); // Total of the dataset values
    const angle = (Math.PI + (Math.PI * (needleValue / 100))); // Based on percentage

    const cx = width / 2;
    const cy = chart._metasets[0].data[0].y;

    // Draw the needle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(height / 2.5, 0);
    ctx.lineTo(0, 2);
    ctx.fillStyle = '#444';
    ctx.fill();
    ctx.restore();

    // Draw the needle center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#444';
    ctx.fill();
    ctx.restore();
  },
};

const GaugeChart = ({ invoiceRaised, amountCollected }) => {
  const collectedPercentage = invoiceRaised > 0 ? (amountCollected / invoiceRaised) * 100 : 0;
  const remainingPercentage = 100 - collectedPercentage;

  const data = {
    labels:["Amount collected", "Invoice Raised"],
    datasets: [
      {
        data: [collectedPercentage, remainingPercentage], // Collected and remaining scale
        backgroundColor: ['#36A2EB', '#E0E0E0'], // Adjust the colors accordingly
        borderWidth: 0,
        circumference: 180, // Half-circle
        rotation: -90, // Start at the top
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '80%', // Adjust the inner radius
    circumference: 180, // Half-circle
    rotation: -90, // Start from the bottom center
    plugins: {
      tooltip: {
        enabled: false,
      },
      drawNeedle: {
        needleValue: collectedPercentage, // Needle shows the collected percentage
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '150px', marginInline:"22rem" , marginTop:"2rem"}}>
      <Doughnut
        data={data}
        options={options}
        plugins={[drawNeedlePlugin]} // Only apply the needle plugin to this chart
      />
      <div style={{ textAlign: 'center', marginTop: '-40px' }}>
        <strong>{collectedPercentage.toFixed(2)}%</strong> of Amount Collected
      </div>
    </div>
  );
};

export default GaugeChart;
