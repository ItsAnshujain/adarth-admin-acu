import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const drawNeedlePlugin = {
  id: 'drawNeedle',
  afterDatasetDraw(chart, args, options) {
    const { ctx, data, chartArea: { width, height }, } = chart;
    const dataset = data.datasets[0];

    const needleValue = options.needleValue ?? 0; 
    const invoiceRaised = options.invoiceRaised ?? 0;
    const dataTotal = dataset.data.reduce((a, b) => a + b, 0);
    const angle = (Math.PI + (Math.PI * (needleValue / 100))); 

    const cx = width / 2;
    const cy = chart._metasets[0].data[0].y;


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

    
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#444';
    ctx.fill();
    ctx.restore();

  
    ctx.beginPath();
    ctx.moveTo(0, cy); 
    ctx.lineTo(width, cy); 
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1; 
    ctx.stroke();

    
    const intervals = 5; 
    const stepAmount = invoiceRaised / intervals; 
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    
    for (let i = 0; i <= intervals; i++) {
      const xPos = (i / intervals) * width;
      const amount = (stepAmount * i).toFixed(2); 
      
      
      ctx.fillText(amount, xPos - ctx.measureText(amount).width / 2, cy + 20); 
      
      
      ctx.beginPath();
      ctx.moveTo(xPos, cy); 
      ctx.lineTo(xPos, cy - 10); 
      ctx.strokeStyle = '#000'; 
      ctx.lineWidth = 1;
      ctx.stroke();
    }

  
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    const label = '(INR In lac)'; 
    ctx.fillText(label, (width / 2) - ctx.measureText(label).width / 2, cy + 50); 
  },
};


const GaugeChart = ({ invoiceRaised, amountCollected }) => {
  const collectedPercentage = invoiceRaised > 0 ? (amountCollected / invoiceRaised) * 100 : 0;
  const remainingPercentage = 100 - collectedPercentage;

  const data = {
    labels: ["Amount collected", "Invoice Raised"],
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
    rotation: -90, 
    plugins: {
      tooltip: {
        enabled: true, 
        callbacks: {
          label: (tooltipItem) => {
            
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            if (label === "Amount collected") {
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
    <div className='w-[300px] overflow-x-auto'>
      <Doughnut
        data={data}
        options={options}
        plugins={[drawNeedlePlugin]}
      />
      <div className='text-center mt-[5px]'>
        <p className='text-xs'>{collectedPercentage.toFixed(2)}% Amount Collected</p>
      </div>
    </div>
  );
};

export default GaugeChart;

