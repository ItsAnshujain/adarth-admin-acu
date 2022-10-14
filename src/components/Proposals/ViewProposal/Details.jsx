import { Text } from '@mantine/core';
import { useMemo } from 'react';

const Details = ({ proposalData }) => {
  const calcutateTotalPrice = useMemo(() => {
    const initialCost = 0;
    if (proposalData?.spaces.length > 0) {
      const totalPriceArray = proposalData.spaces.map(item => item?.price);
      const total = totalPriceArray.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialCost,
      );
      return total;
    }
    return initialCost;
  }, [proposalData?.spaces]);

  return (
    <div className="mt-4 pl-5 pr-7">
      <Text size="xl" weight="bold">
        Proposal Details
      </Text>
      <div className="border p-5 pr-8 mt-2 flex flex-col gap-4">
        <Text weight="bold" className="capitalize">
          {proposalData?.name}
        </Text>
        <Text size="sm">{proposalData?.description}</Text>
        <div className="flex gap-32">
          <div>
            <Text color="grey" weight="400">
              Total Spaces
            </Text>
            <Text weight="bolder">{proposalData?.spaces.length || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Total Media
            </Text>
            <Text weight="bolder">0</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Expected Impressions
            </Text>
            <Text weight="bolder">0</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Total Cities
            </Text>
            <Text weight="bolder">0</Text>
          </div>
        </div>
        <div>
          <Text color="grey" weight="400">
            Price
          </Text>
          <Text weight="bolder">{calcutateTotalPrice || 0}</Text>
        </div>
      </div>
    </div>
  );
};

export default Details;
