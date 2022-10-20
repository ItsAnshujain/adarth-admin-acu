import { useState, useEffect } from 'react';
import { Button, Text, Image, Skeleton, Badge } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useToggle } from '@mantine/hooks';
import layers from '../../../assets/layers.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useFetchInventoryById } from '../../../hooks/inventory.hooks';
import MapView from '../CreateSpace/MapView';

const badgeData = ['School', 'Youth', 'Student', 'College Students'];

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

  useEffect(() => {
    setPosterImage(inventoryDetails?.basicInformation?.spacePhotos);

    if (inventoryDetails?.basicInformation?.otherPhotos) {
      setOtherImages([...inventoryDetails.basicInformation.otherPhotos]);
    }
  }, [
    inventoryDetails?.basicInformation?.spacePhotos,
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
                  Billboard
                </Text>
                <Text weight="bolder" size="xs">
                  Premium Site
                </Text>
              </div>
              <Text weight="300" color="gray">
                {inventoryDetails?.basicInformation?.description}
                <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                  {readMore ? 'Read less' : 'Read more'}
                </Button>
              </Text>
              <Badge className="capitalize" variant="filled" color="green" size="lg" mt="xs">
                Available
              </Badge>
              <Text weight="bold" className="my-2">
                {toIndianCurrency(inventoryDetails?.basicInformation?.price || 0)}
              </Text>
              <div className="flex gap-2 mb-8">
                {badgeData.map(data => (
                  <Badge
                    key={data}
                    className="text-purple-450 bg-purple-100 capitalize"
                    size="lg"
                    variant="filled"
                    radius="md"
                  >
                    {data}
                  </Badge>
                ))}
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
                    <Text className="mb-4">W X H</Text>
                    <Text color="gray" size="xs" weight="300">
                      Impression
                    </Text>
                    <Text className="mb-4">
                      {inventoryDetails?.specifications?.impressions?.min || 0}
                    </Text>
                    <Text color="gray" size="xs" weight="300">
                      Resolution
                    </Text>
                    <Text>
                      {inventoryDetails?.specifications?.resolutions?.height || 0}px X{' '}
                      {inventoryDetails?.specifications?.resolutions?.width || 0}px
                    </Text>
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
                    <Text>{'{illumination}'}</Text>
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
                          District
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
                    <Text color="gray" size="xs" weight="300">
                      Pin Code
                    </Text>
                    <Text className="mb-4">{inventoryDetails?.location?.zip || 'NA'}</Text>
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
