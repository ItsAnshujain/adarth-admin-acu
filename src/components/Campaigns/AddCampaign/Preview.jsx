import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Badge, Button, Image, Pagination, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
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

const Preview = ({ data = {} }) => {
  const [readMore, toggle] = useToggle();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    totalPages: 1,
  });

  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (mapInstance && data?.place?.length) {
      const bounds = new mapInstance.maps.LatLngBounds();

      data.place.forEach(item => {
        bounds.extend({
          lat: +(item.location?.latitude || 0),
          lng: +(item.location?.longitude || 0),
        });
      });

      mapInstance.map.fitBounds(bounds);
      mapInstance.map.setCenter(bounds.getCenter());
      mapInstance.map.setZoom(Math.min(10, mapInstance.map.getZoom()));
    }
  }, [data?.place?.length, mapInstance]);

  useEffect(() => {
    setPagination(p => ({ ...p, totalPages: (data?.space?.length || 0) / pagination.limit }));
  }, [data.place]);

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
            <div className="flex gap-2">
              <p className="font-bold text-xs text-purple-450">{'{category}'}</p>
            </div>
            <p className="font-light text-slate-400 whitespace-pre">
              {readMore ? `${data?.description?.substring(0, 100)}...` : data?.description}{' '}
              <Button onClick={() => toggle()} className="text-purple-450 font-medium p-0">
                {readMore ? 'Read more' : 'Read less'}
              </Button>
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
            {data?.place?.map(item => (
              <Marker key={item.id} lat={item.location?.latitude} lng={item.location?.longitude} />
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
            {data?.place
              ?.slice(pagination.limit * (pagination.page - 1), pagination.limit * pagination.page)
              .map(item => (
                <Places
                  data={{
                    img: item.photo,
                    status: 'Available',
                    name: item.space_name,
                    address: item.location?.address,
                    cost: item.price,
                    impression: item.impression,
                    dimensions: `${item.dimension?.height || 0}ft x ${
                      item.dimension?.width || 0
                    }ft`,
                    format: item.supportedMedia,
                    lighting: item.media_type,
                    from_date: '02/12/2022',
                    to_date: '02/12/2022',
                    resolution: item.resolutions,
                    illumination: item.illuminations,
                    unit: item.unit,
                  }}
                />
              ))}
          </div>
          {pagination.totalPages > pagination.limit ? (
            <Pagination
              className="absolute bottom-0 right-10 gap-0"
              page={pagination.page}
              onChange={page => setPagination(p => ({ ...p, page }))}
              total={pagination.totalPages}
              color="dark"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Preview;
