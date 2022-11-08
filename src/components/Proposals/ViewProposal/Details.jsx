import { Image, Skeleton, Text } from '@mantine/core';
import dayjs from 'dayjs';

const DATE_FORMAT = 'DD MMM YYYY';

const Details = ({ proposalData, isProposalDataLoading }) => (
  <div className="mt-4 pl-5 pr-7">
    <Text size="xl" weight="bold">
      Proposal Details
    </Text>
    {isProposalDataLoading ? (
      <>
        <Skeleton height={200} mb="md" />
        <Skeleton height={150} />
      </>
    ) : (
      <div className="border p-5 pr-8 mt-2 flex flex-col gap-4">
        <div className="flex justify-between">
          <div>
            <Text weight="bold" className="capitalize">
              {proposalData?.name}
            </Text>
            <Text size="sm">{proposalData?.description}</Text>
          </div>
          {proposalData?.image ? (
            <Image
              src={proposalData?.image}
              alt="proposal-preview"
              height={400}
              className="bg-slate-300"
              placeholder={
                <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
              }
            />
          ) : (
            <Image src={null} withPlaceholder height={200} width={200} />
          )}
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <Text color="grey" weight="400">
              Total Spaces
            </Text>
            <Text weight="bolder">{proposalData?.totalSpaces || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Total Media
            </Text>
            <Text weight="bolder">{proposalData?.totalSpaces || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Expected Impressions
            </Text>
            <Text weight="bolder">{proposalData?.totalImpression || 0}</Text>
          </div>
          <div>
            <Text color="grey" weight="400">
              Total Cities
            </Text>
            <Text weight="bolder">{proposalData?.totalCities || 0}</Text>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-1">
            <Text color="grey" weight="400">
              Price
            </Text>
            <Text weight="bolder">{proposalData?.price || 0}</Text>
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
    )}
  </div>
);

export default Details;
