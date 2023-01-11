import { BackgroundImage, Center, Image, Skeleton, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import toIndianCurrency from '../../../utils/currencyFormat';

const DATE_FORMAT = 'DD MMM YYYY';

const SkeletonTopWrapper = () => (
  <div className="flex flex-row justify-between gap-2">
    <Skeleton height={200} mb="md" />
    <Skeleton height={200} />
  </div>
);

const Details = ({ proposalData, isProposalDataLoading, inventoryData }) => {
  const [previewSpacesPhotos, setPreviewSpacesPhotos] = useState([]);

  const getAllSpacePhotos = useMemo(
    () => () => {
      const tempPics = [];
      const tempArr = inventoryData;
      tempArr?.docs?.map(item => {
        if (item?.spacePhoto) tempPics.push(item.spacePhoto);
        if (item?.otherPhotos) tempPics.push(...item.otherPhotos);
        return tempPics;
      });

      return tempPics;
    },
    [inventoryData],
  );

  useEffect(() => {
    const result = getAllSpacePhotos();
    setPreviewSpacesPhotos(result);
  }, [inventoryData]);

  return (
    <div className="mt-4 pl-5 pr-7">
      <Text size="xl" weight="bold">
        Proposal Details
      </Text>
      {isProposalDataLoading ? (
        <SkeletonTopWrapper />
      ) : (
        <div className="border p-5 pr-8 mt-2 flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div>
              <Text weight="bold" className="capitalize">
                {proposalData?.name}
              </Text>
              <Text size="sm">{proposalData?.description}</Text>
            </div>
            <div className="flex flex-1 flex-col max-w-[500px]">
              <div className="flex flex-row flex-wrap justify-start">
                {previewSpacesPhotos?.map(
                  (src, index) =>
                    index < 4 && (
                      <div key={src} className="mr-2 mb-4 border-[1px] border-gray">
                        <Image
                          key={src}
                          className="bg-slate-100"
                          height={index === 0 ? 300 : 96}
                          width={index === 0 ? 400 : 112}
                          src={src}
                          fit="contain"
                          alt="poster"
                        />
                      </div>
                    ),
                )}
                {previewSpacesPhotos?.length > 4 && (
                  <div className="border-[1px] border-gray mr-2 mb-4">
                    <BackgroundImage src={previewSpacesPhotos[4]} className="w-[112px] h-[96px]">
                      <Center className="h-full">
                        <Text weight="bold" color="white" className="mix-blend-difference">
                          +{previewSpacesPhotos.length - 4} more
                        </Text>
                      </Center>
                    </BackgroundImage>
                  </div>
                )}
              </div>
            </div>
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
              <Text weight="bolder">
                {proposalData?.price ? toIndianCurrency(proposalData.price) : 0}
              </Text>
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
};

export default Details;
