import { useState, useEffect, useCallback } from 'react';
import { Button, Text, Image, Skeleton, Badge, BackgroundImage, Center } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import layers from '../../../assets/layers.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFetchInventoryById } from '../../../hooks/inventory.hooks';
import MapView from '../CreateSpace/MapView';
import { tierList } from '../../../utils';

const SkeletonTopWrapper = () => (
  <div className="flex flex-col gap-2">
    <Skeleton height={300} width="100%" mb="md" />
    <div className="flex flex-row">
      <Skeleton height={96} width={112} mr="md" />
      <Skeleton height={96} width={112} mr="md" />
      <Skeleton height={96} width={122} mr="md" />
    </div>
  </div>
);

const BasicInfo = () => {
  const { id: inventoryId } = useParams();
  const [readMore, toggle] = useToggle();
  const [previewSpacesPhotos, setPreviewSpacesPhotos] = useState([]);

  const { data: inventoryDetails, isLoading: isInventoryDetailsLoading } = useFetchInventoryById(
    inventoryId,
    !!inventoryId,
  );

  const getAllSpacePhotos = useCallback(() => {
    const tempPics = [];

    if (inventoryDetails?.basicInformation?.spacePhoto)
      tempPics.push(inventoryDetails.basicInformation.spacePhoto);
    if (inventoryDetails?.basicInformation?.otherPhotos)
      tempPics.push(...inventoryDetails.basicInformation.otherPhotos);

    return tempPics;
  }, [inventoryDetails]);

  const renderBadges = useCallback(
    list =>
      list?.map((item, index) => (
        <p key={item?._id} className="pr-1 text-black">
          {item?.name}
          {list.length !== index + 1 && ','}
        </p>
      )),
    [inventoryDetails],
  );

  const renderColoredBadges = useCallback(
    list =>
      list?.map(item => (
        <Badge
          key={item?._id}
          className="text-purple-450 bg-purple-100 capitalize mr-1 my-2"
          size="lg"
          variant="filled"
          radius="sm"
        >
          {item?.name}
        </Badge>
      )),
    [inventoryDetails],
  );

  useEffect(() => {
    const result = getAllSpacePhotos();
    setPreviewSpacesPhotos(result);
  }, [inventoryDetails]);

  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5 max-w-1/2">
        {isInventoryDetailsLoading ? (
          <SkeletonTopWrapper />
        ) : (
          <div className="flex flex-1 flex-col w-full">
            <div className="flex flex-row flex-wrap justify-start">
              {previewSpacesPhotos?.map(
                (src, index) =>
                  index < 4 && (
                    <Image
                      key={uuidv4()}
                      className="mr-2 mb-4 border-[1px] bg-slate-100"
                      height={index === 0 ? 300 : 96}
                      width={index === 0 ? '100%' : 112}
                      src={src}
                      fit="cover"
                      alt="poster"
                    />
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
        )}

        <div className="grid grid-cols-2 grid-rows-2 mt-7 gap-4 mb-8">
          {!isInventoryDetailsLoading ? (
            <>
              <div className="flex items-center border pl-4 py-8">
                <div className="mr-4">
                  <Image src={layers} alt="poster" />
                </div>
                <div>
                  <Text size="sm" weight="300" color="gray">
                    Total Completed Bookings
                  </Text>
                  <Text>0</Text>
                </div>
              </div>
              <div className="flex items-center border pl-4">
                <div className="mr-4">
                  <Image src={layers} alt="poster" />
                </div>
                <div>
                  <Text size="sm" weight="300" color="gray">
                    Total Operational Cost
                  </Text>
                  <Text>0</Text>
                </div>
              </div>
              <div className="flex items-center border pl-4">
                <div className="mr-4">
                  <Image src={layers} alt="poster" />
                </div>
                <div>
                  <Text size="sm" weight="300" color="gray">
                    Total Revenue
                  </Text>
                  <Text>{toIndianCurrency(0)}</Text>
                </div>
              </div>
              <div className="flex items-center border pl-4">
                <div className="mr-4">
                  <Image src={layers} alt="poster" />
                </div>
                <div>
                  <Text size="sm" weight="300" color="gray">
                    Total Occupancy Days
                  </Text>
                  <Text size="sm" weight="300" color="gray">
                    This Year
                  </Text>
                  <Text>0</Text>
                </div>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="flex items-center border pl-4" height={112} />
              <Skeleton className="flex items-center border pl-4" height={112} />
              <Skeleton className="flex items-center border pl-4" height={112} />
              <Skeleton className="flex items-center border pl-4" height={112} />
            </>
          )}
        </div>
      </div>
      <div className="flex-1 pr-7 max-w-1/2">
        {!isInventoryDetailsLoading ? (
          <Text size="lg" weight="bolder">
            {inventoryDetails?.basicInformation?.spaceName}
          </Text>
        ) : (
          <Skeleton className="flex mb-4" height={30} />
        )}
        <div>
          {!isInventoryDetailsLoading ? (
            <>
              <div className="flex gap-2">
                <Text weight="bolder" size="xs" className="text-purple-450">
                  {inventoryDetails?.basicInformation?.category?.name}
                </Text>
                <Text weight="bolder" size="xs">
                  {inventoryDetails?.specifications?.spaceStatus?.name}
                </Text>
              </div>
              <Text weight="300" color="gray">
                {inventoryDetails?.basicInformation?.description}
                <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                  {readMore ? 'Read less' : 'Read more'}
                </Button>
              </Text>
              <Badge
                className="capitalize"
                variant="filled"
                color={inventoryDetails?.isUnderMaintenance ? 'yellow' : 'green'}
                size="lg"
                mt="xs"
              >
                {inventoryDetails?.isUnderMaintenance ? 'Under maintenance' : 'Available'}
              </Badge>
              <Text weight="bold" className="my-2">
                {toIndianCurrency(inventoryDetails?.basicInformation?.price || 0)}
              </Text>
              <div className="flex gap-2 mb-3">
                {inventoryDetails?.basicInformation?.audience?.length
                  ? renderColoredBadges(inventoryDetails?.basicInformation?.audience)
                  : null}
              </div>
              <div className="mb-2">
                <p className="text-slate-400">Previously advertised brands</p>
                <div className="flex w-full flex-wrap">
                  {inventoryDetails?.specifications?.previousBrands?.length
                    ? renderBadges(inventoryDetails?.specifications?.previousBrands)
                    : 'None'}
                </div>
              </div>
              <div className="mb-2">
                <p className="text-slate-400">Previously advertised tags</p>
                <div className="flex w-full flex-wrap">
                  {inventoryDetails?.specifications?.tags.length
                    ? renderBadges(inventoryDetails?.specifications?.tags)
                    : 'None'}
                </div>
              </div>
              <div className="mb-2">
                <p className="text-slate-400">Demographics</p>
                <div className="flex w-full flex-wrap">
                  {inventoryDetails?.basicInformation?.demographic?.name || 'NA'}
                </div>
              </div>
            </>
          ) : (
            <Skeleton className="flex gap-2 mb-4" height={155} />
          )}
          <div>
            {!isInventoryDetailsLoading ? (
              <>
                <Text>Specifications</Text>
                <Text color="gray" className="mb-2">
                  All the related details regarding campaign
                </Text>
              </>
            ) : (
              <Skeleton className="mb-4" height={30} />
            )}
            <div className="flex flex-col">
              {!isInventoryDetailsLoading ? (
                <div className="grid grid-cols-2 p-4 border rounded-md mb-4 flex-1">
                  <div>
                    <Text color="gray" size="xs" weight="300">
                      Size
                    </Text>
                    <Text className="mb-4">
                      {inventoryDetails?.specifications?.size?.height || 0}ft X{' '}
                      {inventoryDetails?.specifications?.size?.width || 0}ft
                    </Text>
                    <Text color="gray" size="xs" weight="300">
                      Impression
                    </Text>
                    <Text className="mb-4">
                      {inventoryDetails?.specifications?.impressions?.max || 0}+
                    </Text>
                    <Text color="gray" size="xs" weight="300">
                      Resolution
                    </Text>
                    <Text>{inventoryDetails?.specifications?.resolutions || 'NA'}</Text>
                  </div>
                  <div>
                    <Text color="gray" size="xs" weight="300">
                      Unit
                    </Text>
                    <Text className="mb-4">{inventoryDetails?.specifications?.unit}</Text>
                    <Text color="gray" size="xs" weight="300">
                      Supported Media
                    </Text>
                    <Text className="mb-4">
                      {inventoryDetails?.basicInformation?.supportedMedia || 'NA'}
                    </Text>
                    <Text color="gray" size="xs" weight="300">
                      Illumination
                    </Text>
                    <Text>{inventoryDetails?.specifications?.illuminations?.name || 'NA'}</Text>
                  </div>
                </div>
              ) : (
                <Skeleton className="grid grid-cols-2 p-4 mb-4" height={196} />
              )}
              {!isInventoryDetailsLoading ? (
                <div className="flex gap-2 p-4 border rounded-md flex-1">
                  <div className="flex-1 ">
                    <Text color="gray" size="xs" weight="300">
                      Address
                    </Text>
                    <Text className="mb-4">{inventoryDetails?.location?.address || 'NA '}</Text>
                    <div className="grid grid-cols-2">
                      <div>
                        <Text color="gray" size="xs" weight="300">
                          City
                        </Text>
                        <Text className="mb-4">{inventoryDetails?.location?.city || 'NA'}</Text>
                      </div>
                      <div>
                        <Text color="gray" size="xs" weight="300">
                          State
                        </Text>
                        <Text className="mb-4">{inventoryDetails?.location?.state || 'NA'}</Text>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div>
                        <Text color="gray" size="xs" weight="300">
                          Pin Code
                        </Text>
                        <Text className="mb-4">{inventoryDetails?.location?.zip || 'NA'}</Text>
                      </div>
                      <div>
                        <Text color="gray" size="xs" weight="300">
                          Tier
                        </Text>
                        <Text className="mb-4">
                          {tierList.map(item =>
                            item.value === inventoryDetails?.location?.tier ? item.label : null,
                          ) || 'NA'}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <MapView
                    latitude={Number(inventoryDetails?.location.latitude)}
                    longitude={Number(inventoryDetails?.location.longitude)}
                  />
                </div>
              ) : (
                <Skeleton className="flex gap-2 p-4" height={292} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
