/* eslint-disable */
import { useState } from 'react';
import { Button, Text, Image } from '@mantine/core';
import dummy0 from '../../../assets/unsplash.png';
import dummy1 from '../../../assets/dummy1.png';
import dummy2 from '../../../assets/dummy2.png';
import dummy3 from '../../../assets/dummy3.png';
import layers from '../../../assets/layers.svg';
import toIndianCurrency from '../../../utils/currencyFormat';
import Badge from '../../shared/Badge';
import { useToggle } from '@mantine/hooks';
import { useFetchInventoryById } from '../../../hooks/inventory.hooks';
import { useParams } from 'react-router-dom';
import MapView from '../CreateSpace/MapView';
import { Skeleton } from '@mantine/core';

const badgeData = ['School', 'Youth', 'Student', 'College Students'];
const imageUrl = [dummy1, dummy2, dummy0, dummy2, dummy1, dummy0];

const BasicInfo = () => {
  const { id: inventoryId } = useParams();
  const [readMore, toggle] = useToggle();
  const [scrollImage, setScrollImage] = useState(imageUrl);
  const [posterImage, setPosterImage] = useState(dummy3);

  const { data: inventoryDetails, isLoading: isInventoryDetailsLoading } = useFetchInventoryById(
    inventoryId,
    !!inventoryId,
  );

  const exchangeImages = index => {
    const temp = posterImage;
    setPosterImage(scrollImage[index]);
    setScrollImage(prev => {
      const newImgs = [...prev];
      newImgs[index] = temp;
      return newImgs;
    });
  };

  return (
    <div className="flex gap-8 pt-4">
      <div className="flex-1 pl-5 max-w-1/2">
        <div className="flex flex-col">
          {!isInventoryDetailsLoading ? (
            <div className="h-96">
              {inventoryDetails?.basicInformation?.spacePhotos ? (
                <Image
                  height={384}
                  src={inventoryDetails?.basicInformation?.spacePhotos}
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
                {scrollImage.map((src, index) => (
                  <img
                    onClick={() => exchangeImages(index)}
                    className="h-24 w-28 cursor-pointer"
                    src={src}
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
                  <img src={layers} alt="poster" />
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
                  <img src={layers} alt="poster" />
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
                  <img src={layers} alt="poster" />
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
                  <img src={layers} alt="poster" />
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
                {inventoryDetails?.basicInformation?.description} {readMore && <></>}
                <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                  {readMore ? 'Read less' : 'Read more'}
                </Button>
              </Text>
              <Text weight="bold" className="my-2">
                {toIndianCurrency(inventoryDetails?.basicInformation?.price || 0)}
              </Text>
              <div className="flex gap-2 mb-8">
                {badgeData.map(data => (
                  <Badge
                    className="text-purple-450 bg-purple-100 capitalize"
                    text={data}
                    size="lg"
                    variant="filled"
                    radius="md"
                  />
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
                      {inventoryDetails?.specifications?.impressions?.max || 0}
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
