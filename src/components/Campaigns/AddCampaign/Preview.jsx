import React, { useEffect, useMemo, useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import { BackgroundImage, Badge, Center, Image, Pagination, Spoiler, Text } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import toIndianCurrency from '../../../utils/currencyFormat';
import MarkerIcon from '../../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../../utils/config';
import Places from './UI/Places';

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const Preview = ({ data = {}, place = {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapInstance, setMapInstance] = useState(null);
  const [previewSpacesPhotos, setPreviewSpacesPhotos] = useState([]);

  const getAllSpacePhotos = useCallback(() => {
    const tempPics = [];
    const tempArr = place;
    tempArr?.docs?.filter(item => {
      if (item?.photo) tempPics.push(item.photo);
      if (item?.otherPhotos) tempPics.push(...item.otherPhotos);

      return tempPics;
    });

    return tempPics;
  }, [place]);

  const getTotalPrice = useMemo(() => {
    const totalPrice = place.docs.reduce((acc, item) => acc + +(item.price || 0), 0);
    return totalPrice;
  }, [place]);

  const getTotalImpressions = useMemo(() => {
    const totalImpressions = place.docs.reduce((acc, item) => acc + +(item.impression || 0), 0);
    return totalImpressions;
  }, [place]);

  useEffect(() => {
    if (mapInstance && place?.docs?.length) {
      const bounds = new mapInstance.maps.LatLngBounds();

      place?.docs?.forEach(item => {
        bounds.extend({
          lat: +(item.location?.latitude || 0),
          lng: +(item.location?.longitude || 0),
        });
      });

      mapInstance.map.fitBounds(bounds);
      mapInstance.map.setCenter(bounds.getCenter());
      mapInstance.map.setZoom(Math.min(10, mapInstance.map.getZoom()));
    }
  }, [place?.docs?.length, mapInstance]);

  useEffect(() => {
    const result = getAllSpacePhotos();
    setPreviewSpacesPhotos(result);
  }, [place]);

  return (
    <div className="grid grid-cols-2 gap-x-8 pl-5 pr-7 pt-4">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-1 flex-col w-full">
            <div className="flex flex-row flex-wrap justify-start">
              {previewSpacesPhotos?.map(
                (src, index) =>
                  index < 4 && (
                    <Image
                      key={uuidv4()}
                      className="mr-2 mb-4 border-[1px] border-gray bg-slate-100"
                      height={index === 0 ? 300 : 96}
                      width={index === 0 ? '100%' : 112}
                      src={index === 0 ? data?.thumbnail : src}
                      fit="cover"
                      alt="poster"
                    />
                  ),
              )}

              {previewSpacesPhotos?.length > 4 && (
                <div className="border-[1px] border-gray mr-2 mb-4">
                  <BackgroundImage src={previewSpacesPhotos[4]} className="w-[112px] h-[96px]">
                    <Center className="h-full transparent-black">
                      <Text weight="bold" color="white">
                        +{previewSpacesPhotos.length - 4} more
                      </Text>
                    </Center>
                  </BackgroundImage>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex-1 pr-7 max-w-1/2">
          <p className="text-lg font-bold">{data.name || 'NA'}</p>
          <div>
            <Spoiler
              maxHeight={45}
              showLabel="Read more"
              hideLabel="Read less"
              className="text-purple-450 font-medium text-[14px]"
              classNames={{ content: 'text-slate-400 font-light text-[14px]' }}
            >
              {data?.description}
            </Spoiler>
            <div className="flex gap-3 items-center">
              <p className="font-bold my-2">{toIndianCurrency(+(getTotalPrice || 0))}</p>

              <Badge
                className="text-purple-450 bg-purple-100 capitalize"
                size="lg"
                variant="filled"
                radius="md"
              >
                {`${getTotalImpressions || 0} + Total Impressions`}
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
        <div className="mt-1 mb-8 h-[40vh]">
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => setMapInstance({ map, maps })}
          >
            {place?.docs?.map(item => (
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
            {place?.docs?.map(item => (
              <Places
                key={uuidv4()}
                data={{
                  img: item.photo,
                  name: item.spaceName,
                  address: item.location?.address,
                  cost: item.price,
                  dimensions: `${item.dimension?.height || 0}ft x ${item.dimension?.width || 0}ft`, //
                  format: item.supportedMedia,
                  lighting: item.mediaType,
                  resolution: item.resolutions,
                  illumination: item.illuminations,
                  unit: item.unit,
                }}
              />
            ))}
          </div>
          {place?.totalDocs > place?.limit ? (
            <Pagination
              className="absolute bottom-0 right-10 gap-0"
              page={searchParams.get('page')}
              onChange={page => {
                searchParams.setPage(page);
                setSearchParams(searchParams);
              }}
              total={place?.totalPages || 1}
              color="dark"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Preview;
