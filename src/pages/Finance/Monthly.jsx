import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Folder } from 'react-feather';
import { Box, Loader, Text } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import Header from '../../components/Finance/Header';
import toIndianCurrency from '../../utils/currencyFormat';
import { useFetchFinanceByYear } from '../../hooks/finance.hooks';
import { months } from '../../utils';

const Home = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { year } = useParams();
  const { data: financialDataByYear, isLoading } = useFetchFinanceByYear(year);

  const handleNavigation = finance => {
    navigate(`${finance?._id}`, {
      state: {
        totalSales: finance?.totalSales,
        totalOperationlCost: finance?.totalOperationlCost,
      },
    });
  };

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <Header {...state} />
      <div className="flex flex-wrap gap-4 pl-5 pr-7">
        {!financialDataByYear?.length && !isLoading ? (
          <div className="w-full mt-20">
            <Text size="lg" className="font-sans text-center">
              No financial record found
            </Text>
          </div>
        ) : null}
        <div className="w-full">{isLoading ? <Loader className="w-full mt-20" /> : null}</div>

        {financialDataByYear?.map(finance => (
          <Box
            key={uuidv4()}
            onClick={() => handleNavigation(finance)}
            className="flex flex-col gap-2 p-4 border rounded-lg cursor-pointer"
          >
            <Folder size={32} strokeWidth="1.2" />
            {finance?._id ? (
              <p className="font-bold text-lg">{months[finance._id - 1 || 0]}</p>
            ) : null}
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
