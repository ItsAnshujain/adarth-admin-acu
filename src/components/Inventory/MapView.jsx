import { Image, NativeSelect } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'react-feather';
import GoogleMapReact from 'google-map-react';
import MarkerIcon from '../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../utils/config';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils';

const styles = {
  rightSection: { pointerEvents: 'none' },
};

const defaultProps = {
  center: {
    lat: 22.567646,
    lng: 88.370743,
  },
  zoom: 11,
};

const Marker = () => <Image src={MarkerIcon} width={40} height={40} />;

const MapView = ({ lists = [] }) => {
  const {
    data: categoryData,
    isSuccess: isCategoryDataLoaded,
    isLoading: isCategoryDataLoading,
  } = useFetchMasters(serialize({ type: 'category', parentId: null, limit: 100, page: 1 }));
  const [value, setValue] = useState('');
  const [mapInstance, setMapInstance] = useState(null);

  const getAllLocations = useMemo(
    () =>
      lists.map(item => {
        if (item?.basicInformation?.category?._id === value) {
          return (
            <Marker lat={item?.location?.latitude} lng={item?.location?.longitude} key={item._id} />
          );
        }
        return null;
      }),
    [lists, value],
  );

  useEffect(() => {
    setValue(categoryData?.docs?.[0]._id || '');
  }, [categoryData]);

  useEffect(() => {
    if (mapInstance && lists?.length) {
      const bounds = new mapInstance.maps.LatLngBounds();

      lists?.forEach(item => {
        bounds.extend({
          lat: +(item.location?.latitude || 0),
          lng: +(item.location?.longitude || 0),
        });
      });

      mapInstance.map.fitBounds(bounds);
      mapInstance.map.setCenter(bounds.getCenter());
      mapInstance.map.setZoom(Math.min(10, mapInstance.map.getZoom()));
    }
  }, [lists?.length, mapInstance]);

  return (
    <div className="relative px-5">
      <div className="h-[70vh] w-full">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
          yesIWantToUseGoogleMapApiInternals
          defaultZoom={defaultProps.zoom}
          center={{
            lat: lists?.[0]?.location?.latitude
              ? +lists[0].location.latitude
              : defaultProps.center.lat,
            lng: lists?.[0]?.location?.longitude
              ? +lists[0].location.longitude
              : defaultProps.center.lng,
          }}
          onGoogleApiLoaded={({ map, maps }) => setMapInstance({ map, maps })}
        >
          {lists.length ? getAllLocations : null}
        </GoogleMapReact>
      </div>
      <div className="absolute top-5 right-10 w-64">
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={
            isCategoryDataLoaded
              ? categoryData?.docs?.map(item => ({ label: item?.name, value: item?._id }))
              : []
          }
          styles={styles}
          disabled={isCategoryDataLoading}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          rightSectionWidth={40}
        />
      </div>
    </div>
  );
};

export default MapView;
