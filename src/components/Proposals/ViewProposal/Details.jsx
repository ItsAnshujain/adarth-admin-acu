import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const DATE_FORMAT = 'DD MMM YYYY';

const Details = ({ proposalData }) => {
  const calcutateTotalPrice = useMemo(() => {
    const initialCost = 0;
    if (proposalData?.spaces.length > 0) {
      return proposalData.spaces
        .map(item => item?.price)
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialCost);
    }
    return initialCost;
  }, [proposalData?.spaces]);

  const calcutateTotalMinimumImpressions = useMemo(() => {
    const initialImpressions = 0;
    if (proposalData?.spaces.length > 0) {
      return proposalData.spaces
        .map(item => item?.specifications?.impressions?.min)
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialImpressions);
    }
    return initialImpressions;
  }, [proposalData?.spaces]);

  const calculateTotalCities = useMemo(() => {
    const initialCity = 0;
    if (proposalData?.spaces.length > 0) {
      const filteredNamesArr = proposalData.spaces.map(item => item?.location?.city);
      const uniqueNamesArr = Array.from(new Set(filteredNamesArr.map(item => item.toLowerCase())));
      return uniqueNamesArr;
    }
    return initialCity;
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
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <Text color="grey" weight="400">
              Total Spaces
            </Text>
            <Text weight="bolder">{proposalData?.spaces.length || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Total Media
            </Text>
            <Text weight="bolder">{proposalData?.spaces.length || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Expected Impressions
            </Text>
            <Text weight="bolder">{calcutateTotalMinimumImpressions || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Total Cities
            </Text>
            <Text weight="bolder">{calculateTotalCities?.length || 0}</Text>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <Text color="grey" weight="400">
              Price
            </Text>
            <Text weight="bolder">{calcutateTotalPrice || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Overall Start Date
            </Text>
            <Text weight="bolder">
              {proposalData?.startDate ? dayjs(proposalData.startDate).format(DATE_FORMAT) : 'NA'}
            </Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Overall End Date
            </Text>
            <Text weight="bolder">
              {proposalData?.endDate ? dayjs(proposalData.endDate).format(DATE_FORMAT) : 'NA'}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
