import React, { useMemo, useEffect, useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import {
  BackgroundImage,
  Badge,
  Button,
  Center,
  Image,
  Pagination,
  Skeleton,
  Text,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import toIndianCurrency from '../../../utils/currencyFormat';
import MarkerIcon from '../../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../../utils/config';
import Places from './UI/Places';
import NoData from '../../shared/NoData';

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const SkeletonTopWrapper = () => (
  <div className="flex flex-col gap-2">
    <Skeleton height={300} width={400} mb="md" />
    <div className="flex flex-row">
      <Skeleton height={96} width={112} mr="md" />
      <Skeleton height={96} width={112} mr="md" />
      <Skeleton height={96} width={122} mr="md" />
    </div>
  </div>
);

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const Overview = ({ campaignData = {}, spacesData = {}, isCampaignDataLoading }) => {
  const [readMore, toggle] = useToggle();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapInstance, setMapInstance] = useState(null);
  const [updatedPlace, setUpdatedPlace] = useState();
  const [previewSpacesPhotos, setPreviewSpacesPhotos] = useState([]);

  const getAllSpacePhotos = useCallback(
    () => () => {
      const tempPics = [];
      const tempArr = spacesData;
      tempArr?.docs?.map(item => {
        if (item?.basicInformation?.spacePhoto) tempPics.push(item.basicInformation.spacePhoto);
        if (item?.basicInformation?.otherPhotos)
          tempPics.push(...item.basicInformation.otherPhotos);
        return tempPics;
      });

      return tempPics;
    },
    [spacesData],
  );

  const handlePagination = currentPage => {
    searchParams.set('page', currentPage);
    setSearchParams(searchParams);
  };

  const updatePriceAndDates = useMemo(
    () => () => {
      const tempArr = spacesData?.docs?.map(item => {
        const matchedPlace = campaignData?.place?.find(item1 => item._id === item1.id);
        return { ...item, ...matchedPlace };
      });
      setUpdatedPlace(tempArr);
    },
    [campaignData, spacesData],
  );

  useEffect(() => {
    if (mapInstance && spacesData?.docs?.length) {
      const bounds = new mapInstance.maps.LatLngBounds();

      spacesData?.docs?.forEach(item => {
        bounds.extend({
          lat: +(item.location?.latitude || 0),
          lng: +(item.location?.longitude || 0),
        });
      });

      mapInstance.map.fitBounds(bounds);
      mapInstance.map.setCenter(bounds.getCenter());
      mapInstance.map.setZoom(Math.min(10, mapInstance.map.getZoom()));
    }
  }, [spacesData?.docs?.length, mapInstance]);

  useEffect(() => {
    updatePriceAndDates();
  }, [campaignData, spacesData]);

  useEffect(() => {
    const result = getAllSpacePhotos();
    setPreviewSpacesPhotos(result);
  }, [spacesData]);

  return (
    <div className="grid grid-cols-2 gap-x-8 pl-5 pr-7 pt-4">
      <div className="flex flex-col">
        {isCampaignDataLoading ? (
          <SkeletonTopWrapper />
        ) : (
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
        )}
      </div>
      <div>
        <div className="flex-1 pr-7 max-w-1/2">
          <p className="text-lg font-bold">{campaignData.name || 'NA'}</p>
          <div>
            <p className="text-slate-400 font-light text-[14px]">
              {campaignData?.description?.split(' ')?.length > 4
                ? readMore
                  ? `${campaignData?.description?.split(' ')?.slice(0, 3).join(' ')}...`
                  : campaignData?.description
                : campaignData.description || <NoData type="na" />}
              {campaignData?.description?.split(' ')?.length > 4 ? (
                <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                  {readMore ? 'Read more' : 'Read less'}
                </Button>
              ) : null}
            </p>
            <div className="flex gap-3 items-center">
              <p className="font-bold my-2">{toIndianCurrency(+(campaignData?.price || 0))}</p>

              <Badge
                className="text-purple-450 bg-purple-100 capitalize"
                size="lg"
                variant="filled"
                radius="md"
              >
                {`${campaignData?.maxImpression || 0} + Total Impressions`}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 my-5">
        <div className="pr-7">
          <Text size="lg" weight="bold">
            Location Details
          </Text>
          <Text size="sm" weight="lighter">
            All the places been covered by this campaign
          </Text>
        </div>
        <div className="mt-1 mb-8 h-[30vh]">
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => setMapInstance({ map, maps })}
          >
            {spacesData?.docs?.map(item => (
              <Marker key={item._id} lat={item.location?.latitude} lng={item.location?.longitude} />
            ))}
          </GoogleMapReact>
        </div>

        <div className="relative pb-10">
          <Text size="lg" weight="bolder">
            Places In The Campaign
          </Text>
          <Text text="sm" weight="lighter">
            All the places been cover by this campaign
          </Text>
          <div>
            {updatedPlace?.map(item => (
              <Places
                key={item._id}
                data={{
                  img: item?.basicInformation?.spacePhoto,
                  name: item?.basicInformation?.spaceName,
                  spaceStatus: item?.spaceStatus?.name || 'Available',
                  address: item.location?.address,
                  price: item?.price,
                  dimensions: `${item?.specifications?.size?.height || 0}ft x ${
                    item?.specifications?.size?.width || 0
                  }ft`,
                  supportedMedia: item?.basicInformation?.supportedMedia,
                  mediaType: item?.mediaType?.name,
                  resolution: item?.specifications?.resolutions,
                  illumination: item.illuminations?.name,
                  unit: item?.specifications?.unit,
                }}
              />
            ))}
            {updatedPlace?.length === 0 ? (
              <div className="w-full min-h-[100px] flex justify-center items-center">
                <p className="text-xl">No records found</p>
              </div>
            ) : null}
          </div>
          {spacesData?.totalDocs > spacesData?.limit ? (
            <Pagination
              className="absolute bottom-0 right-10 gap-0"
              page={searchParams.get('page')}
              onChange={handlePagination}
              total={spacesData?.totalPages || 1}
              color="dark"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Overview;
