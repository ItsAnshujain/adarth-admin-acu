import { useState, useEffect, useCallback } from 'react';
import { Button, Text, Image, Skeleton, Badge } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import layers from '../../../assets/layers.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFetchInventoryById } from '../../../hooks/inventory.hooks';
import MapView from '../CreateSpace/MapView';
import { tierList } from '../../../utils';

const BasicInfo = () => {
  const { id: inventoryId } = useParams();
  const [readMore, toggle] = useToggle();
  const [otherImages, setOtherImages] = useState([]);
  const [posterImage, setPosterImage] = useState(null);

  const { data: inventoryDetails, isLoading: isInventoryDetailsLoading } = useFetchInventoryById(
    inventoryId,
    !!inventoryId,
  );

  const exchangeImages = index => {
    const temp = posterImage;
    setPosterImage(otherImages[index]);
    setOtherImages(prev => {
      const newImgs = [...prev];
      newImgs[index] = temp;
      return newImgs;
    });
  };

  const renderBadges = useCallback(
    list =>
      list?.map(item => (
        <p key={item?._id} className="pr-1 text-black">
          {item?.name},
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
    setPosterImage(inventoryDetails?.basicInformation?.spacePhoto);

    if (inventoryDetails?.basicInformation?.otherPhotos) {
      setOtherImages([...inventoryDetails.basicInformation.otherPhotos]);
    }
  }, [
    inventoryDetails?.basicInformation?.spacePhoto,
    inventoryDetails?.basicInformation?.otherPhotos,
  ]);

  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5 max-w-1/2">
        <div className="flex flex-col">
          {!isInventoryDetailsLoading ? (
            <div className="h-96">
              {posterImage ? (
                <Image
                  height={384}
                  src={posterImage}
                  alt="poster"
                  fit="contain"
                  withPlaceholder
                  placeholder={
                    <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
                  }
                />
              ) : (
                <Image height={384} src={null} alt="poster" fit="contain" withPlaceholder />
              )}
            </div>
          ) : (
            <Skeleton className="flex flex-col w-full h-96 max-w-1/2" />
          )}
          <div className="flex overflow-scroll pt-4 gap-4 items-center">
            {!isInventoryDetailsLoading ? (
              <>
                {otherImages.map((src, index) => (
                  <Image
                    key={src}
                    onClick={() => exchangeImages(index)}
                    className="cursor-pointer bg-slate-300"
                    height={96}
                    width={112}
                    src={src}
                    fit="contain"
                    alt="poster"
                  />
                ))}
              </>
            ) : (
              <>
                <Skeleton className="h-24 w-28" />
                <Skeleton className="h-24 w-28" />
                <Skeleton className="h-24 w-28" />
                <Skeleton className="h-24 w-28" />
              </>
            )}
          </div>
        </div>
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
                    : null}
                </div>
              </div>
              <div className="mb-2">
                <p className="text-slate-400">Previously advertised tags</p>
                <div className="flex w-full flex-wrap">
                  {inventoryDetails?.specifications?.tags
                    ? renderBadges(inventoryDetails?.specifications?.tags)
                    : null}
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
                      {inventoryDetails?.specifications?.impressions?.min || 0}
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
                    latitude={inventoryDetails?.location.latitude}
                    longitude={inventoryDetails?.location.longitude}
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
