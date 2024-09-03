import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useUserSalesByUserId } from '../../apis/queries/booking.queries';
import { financialEndDate, financialStartDate, serialize } from '../../utils';
import useUserStore from '../../store/user.store';

const config = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const Report1Page = () => {
  const userId = useUserStore(state => state.id);
  const userSales = useUserSalesByUserId({
    startDate: financialStartDate,
    endDate: financialEndDate,
    userId,
  });

  const dummyStats = {
    tradedsite: userSales.data?.totalTradedAmount || 0,
    ownsite: userSales.data?.ownSiteSales || 0,
  };

  const printStatusData = useMemo(() => ({
    datasets: [
      {
        data: [dummyStats.tradedsite, dummyStats.ownsite],
        backgroundColor: ['#914EFB', '#FF900E'],
        borderColor: ['#914EFB', '#FF900E'],
        borderWidth: 1,
      },
    ],
  }), [dummyStats.tradedsite, dummyStats.ownsite]);

 
  return (
    <>
      <div className="flex mt-16 mx-10 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 p-4 items-center min-h-[200px]">
            <div className="flex flex-col items-center">
              <p className="font-bold">Own Sites Vs Traded sites</p>
              <div className="flex gap-8 mt-6 ">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-2 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="my-2 text-xs font-light">Own Sites</p>
                    <p className="text-sm">₹{dummyStats.ownsite}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-2 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="my-2 text-xs font-light">Traded sites</p>
                    <p className="text-sm">₹ {dummyStats.tradedsite}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-80">
              {printStatusData.datasets[0].data.length === 0 ? (
                <p className="text-center">NA</p>
              ) : (
                <Doughnut options={config.options} data={printStatusData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report1Page;
