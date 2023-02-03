import { Box, Loader, Text } from '@mantine/core';
import { Folder } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Header from '../../components/Finance/Header';
import { useFetchFinance } from '../../hooks/finance.hooks';
import toIndianCurrency from '../../utils/currencyFormat';

const Home = () => {
  const navigate = useNavigate();
  const { data: financialData, isLoading } = useFetchFinance();

  const handleNavigation = finance => {
    navigate(`${finance?._id}`, {
      state: {
        totalSales: finance?.totalSales,
        totalOperationlCost: finance?.totalOperationlCost,
        year: finance?._id,
      },
    });
  };

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header />
      <div className="flex flex-wrap gap-4 pl-5 pr-7">
        {!financialData?.length && !isLoading ? (
          <div className="w-full mt-20">
            <Text size="lg" className="text-center">
              No financial record found
            </Text>
          </div>
        ) : null}
        <div className="w-full">{isLoading ? <Loader className="w-full mt-20" /> : null}</div>
        {financialData?.map(finance => (
          <Box
            key={uuidv4()}
            onClick={() => handleNavigation(finance)}
            className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer"
          >
            <Folder size={32} strokeWidth="1.2" />
            <p className="font-bold text-lg">Year {finance?._id || 'NA'}</p>
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Sales</p>
                <p className="text-orange-400">{toIndianCurrency(finance?.totalSales || 0)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Total Operational Cost</p>
                <p className="text-green-400">
                  {toIndianCurrency(finance?.totalOperationlCost || 0)}
                </p>
              </div>
            </div>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default Home;
