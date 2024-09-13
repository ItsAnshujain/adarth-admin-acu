import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const drawNeedlePlugin = {
  id: 'drawNeedle',
  afterDatasetDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;

    const needleValue = options.needleValue ?? 0;
    const invoiceRaised = options.invoiceRaised ?? 0;
    const intervals = 10; // Number of tick marks on the circular portion
    const stepAngle = Math.PI / intervals; // Step angle for each interval
    const stepAmount = invoiceRaised / intervals; // Amount for each step (based on total invoiceRaised)

    const cx = width / 2; // Center x
    const cy = chart._metasets[0].data[0].y; // Center y
    const radius = height / 2.5; // Radius for the tick marks

    // Draw tick marks along the circular portion (ring)
    // Adjust the radius for the tick marks and labels to be outside the chart
    const outerTickRadius = radius + 50; // Move tick marks outside
    const innerTickRadius = radius + 40; // Slightly shorter tick marks
    const labelRadius = radius + 50; // Move labels further outside

    ctx.save();
    for (let i = 0; i <= intervals; i++) {
      const angle = Math.PI + stepAngle * i; // Calculate the angle for each tick mark

      // Tick mark start and end coordinates
      const xStart = cx + outerTickRadius * Math.cos(angle); // Outer radius for tick marks
      const yStart = cy + outerTickRadius * Math.sin(angle);
      const xEnd = cx + innerTickRadius * Math.cos(angle); // Inner radius for tick marks
      const yEnd = cy + innerTickRadius * Math.sin(angle);

      // Draw the tick mark
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.strokeStyle = '#000'; // Color of the tick marks
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw the invoice amount label at each tick mark, outside the tick
      const invoiceAmount = (stepAmount * i).toFixed(2); // Calculate the invoice amount for each tick
      const xText = cx + labelRadius * Math.cos(angle); // Move the text further outside the ring
      const yText = cy + labelRadius * Math.sin(angle);

      ctx.font = '12px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(`${invoiceAmount}`, xText - 10, yText - 10); // Position the amount above the tick
    }
    ctx.restore();

    // Draw the needle
    const angle = Math.PI + Math.PI * (needleValue / 100); // Angle for the needle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(radius, 0);
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

    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    const label = '(Amount In lac)';
    ctx.fillText(label, width / 2 - ctx.measureText(label).width / 2, cy - radius - 80);
  },
};

const GaugeChart = ({ invoiceRaised, amountCollected }) => {
  const collectedPercentage = invoiceRaised > 0 ? (amountCollected / invoiceRaised) * 100 : 0;
  const remainingPercentage = 100 - collectedPercentage;

  const data = {
    labels: ['Amount collected', 'Invoice Raised'],
    datasets: [
      {
        data: [collectedPercentage, remainingPercentage],
        backgroundColor: ['#914EFB', '#E0E0E0'],
        borderWidth: 0,
        circumference: 180,
        rotation: -90,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '80%',
    circumference: 180,
    rotation: -85,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: tooltipItem => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            if (label === 'Amount collected') {
              return `Amount Collected: ${amountCollected.toFixed(2)}`;
            } else {
              return `Invoice Raised: ${invoiceRaised.toFixed(2)}`;
            }
          },
        },
      },
      drawNeedle: {
        needleValue: collectedPercentage,
        rightText: `${invoiceRaised.toFixed(2)}`,
        invoiceRaised,
      },
    },
  };

  return (
    <div className="w-[300px] overflow-x-auto">
      <Doughnut data={data} options={options} plugins={[drawNeedlePlugin]} />
      <div className="text-center mt-[-15px]">
        <p className="text-xs">{collectedPercentage.toFixed(2)}% Amount Collected</p>
      </div>
    </div>
  );
};

export default GaugeChart;
