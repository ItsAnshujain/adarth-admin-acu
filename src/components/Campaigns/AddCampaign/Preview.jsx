import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Badge, Button, Image, Pagination, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import toIndianCurrency from '../../../utils/currencyFormat';
import MarkerIcon from '../../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../../utils/config';
import Places from '../ViewCampaigns/UI/Places';

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const Preview = ({ data = {}, place = {} }) => {
  const [readMore, toggle] = useToggle();
  const [searchParams, setSearchParams] = useSearchParams();

  const [mapInstance, setMapInstance] = useState(null);

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

  return (
    <div className="grid grid-cols-2 gap-x-8 pl-5 pr-7 pt-4">
      <div className="flex flex-col">
        <div className="h-96">
          {data?.thumbnail ? (
            <Image
              height={384}
              src={data.thumbnail}
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
      </div>
      <div>
        <div className="flex-1 pr-7 max-w-1/2">
          <p className="text-lg font-bold">{data.name || 'NA'}</p>
          <div>
            <p className="font-light text-slate-400 whitespace-pre">
              {readMore
                ? `${data?.description?.split('\n')?.slice(0, 3).join('\n')}...`
                : data?.description}{' '}
              {data?.description?.split('\n')?.length > 4 ? (
                <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                  {readMore ? 'Read more' : 'Read less'}
                </Button>
              ) : null}
            </p>
            <div className="flex gap-3 items-center">
              <p className="font-bold my-2">{toIndianCurrency(+(data?.price || 0))}</p>

              <Badge
                className="text-purple-450 bg-purple-100 capitalize"
                size="lg"
                variant="filled"
                radius="md"
              >
                {`${data?.maxImpression || 0} + Total Impressions`}
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
                data={{
                  img: item.photo,
                  status: item.spaceStatus || 'Available',
                  name: item.space_name,
                  address: item.location?.address,
                  cost: item.price,
                  impression: item.impression?.min || 0,
                  dimensions: `${item.dimension?.height || 0}ft x ${item.dimension?.width || 0}ft`, //
                  format: item.supportedMedia,
                  lighting: item.media_type,
                  from_date: item.startDate,
                  to_date: item.endDate,
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
