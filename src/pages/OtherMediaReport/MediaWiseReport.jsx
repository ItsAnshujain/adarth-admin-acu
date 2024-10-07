import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useFetchOperationalCostData } from '../../apis/queries/operationalCost.queries';
import { Loader } from 'react-feather';


const config = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const MediaWiseReport = () => {
  const { data: operationalCostData, isLoading: isStatsLoading, error } = useFetchOperationalCostData();

  // Extract and filter relevant data
  const costData = useMemo(() => {
    if (!operationalCostData) return {};

    const relevantTypes = ['Printing', 'Mounting', 'Reprinting', 'Remounting'];

    // Initialize totals for each type
    const totals = {
      Printing: 0,
      Mounting: 0,
      Reprinting: 0,
      Remounting: 0,
    };

    // Calculate the total for each type
    operationalCostData.forEach(item => {
      const typeName = item?.type?.name;
      if (relevantTypes.includes(typeName)) {
        totals[typeName] += item.amount || 0;
      }
    });

    return totals;
  }, [operationalCostData]);

  const printingMountingData =  useMemo(
    () => ({
    datasets: [
      {
        data: [costData.Printing, costData.Mounting],
        backgroundColor: [ '#FF900E', '#914EFB'],
          borderColor: [ '#FF900E', '#914EFB'],
      },
    ],
  }),
  [],
);


  const reprintingRemountingData = useMemo(
    () => ({
    datasets: [
      {
        data: [costData.Reprinting, costData.Remounting],
        backgroundColor: [ '#FF900E', '#914EFB'],
          borderColor: [ '#FF900E', '#914EFB'],
      },
    ],
  }),
  [],
);

  return (
    <div className="overflow-y-auto p-3 col-span-10 overflow-hidden">
      <div className="px-5">
        <div className="mb-4 flex flex-col">
          <p className="font-bold">Printing & Mounting Costs</p>
          <p className="text-sm text-gray-600 italic py-4">
            This chart compares costs for printing, mounting, reprinting, and remounting activities.
          </p>
        </div>

        <div className="flex w-1/3 gap-4 h-[300px] ">
          {/* Printing & Mounting Revenue Split */}
          <div className="flex gap-4 p-4 border rounded-md items-center min-h-[200px]">
            <div className="w-32">
              {isStatsLoading ? (
                <Loader className="mx-auto" />
              ) : costData.Printing === 0 && costData.Mounting === 0 ? (
                <p className="text-center">NA</p>
              ) :
                <Doughnut options={config.options} data={printingMountingData} />
              }
            </div>
            <div>
              <p className="font-medium"> Printing, Mounting Revenue Split </p>
              <div className="flex gap-8 mt-6 flex-wrap">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Printing</p>
                    <p className="font-bold text-lg">{costData.Printing ?? 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Mounting</p>
                    <p className="font-bold text-lg">{costData.Mounting ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reprinting & Remounting Revenue Split */}
          <div className="flex gap-4 p-4 border rounded-md items-center min-h-[200px]">
            <div className="w-32">
              {isStatsLoading ? (
                <Loader className="mx-auto" />
           
              ) : costData.Remounting === 0 && costData.Reprinting === 0 ? (
                <p className="text-center">NA</p>
              ) :
                <Doughnut options={config.options} data={reprintingRemountingData} />
              }
            </div>
            <div>
              <p className="font-medium"> Reprinting, Remounting Revenue Split </p>
              <div className="flex gap-8 mt-6 flex-wrap">
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 bg-orange-350 rounded-full" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Reprinting</p>
                    <p className="font-bold text-lg">{costData.Reprinting ?? 0}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="h-2 w-1 p-2 rounded-full bg-purple-350" />
                  <div>
                    <p className="my-2 text-xs font-light text-slate-400">Remounting</p>
                    <p className="font-bold text-lg">{costData.Remounting ?? 0}</p>
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

export default MediaWiseReport;
