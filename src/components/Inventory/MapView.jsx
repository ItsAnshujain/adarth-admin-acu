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
    data: spaceTypeData,
    isSuccess: isSpaceTypeDataLoaded,
    isLoading: isSpaceTypeDataLoading,
  } = useFetchMasters(serialize({ type: 'space_type', parentId: null, limit: 100 }));
  const [value, setValue] = useState('');

  const getAllLocations = useMemo(
    () =>
      lists.map(item => {
        if (item?.basicInformation?.spaceType?._id === value) {
          return (
            <Marker lat={item?.location?.latitude} lng={item?.location?.longitude} key={item._id} />
          );
        }
        return null;
      }),
    [lists, value],
  );

  useEffect(() => {
    setValue(spaceTypeData?.docs?.[0]._id || '');
  }, [spaceTypeData]);

  return (
    <div className="relative px-5">
      <div className="h-[70vh] w-full">
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          yesIWantToUseGoogleMapApiInternals
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
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
            isSpaceTypeDataLoaded
              ? spaceTypeData?.docs?.map(item => ({ label: item?.name, value: item?._id }))
              : []
          }
          styles={styles}
          disabled={isSpaceTypeDataLoading}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          rightSectionWidth={40}
        />
      </div>
    </div>
  );
};

export default MapView;
