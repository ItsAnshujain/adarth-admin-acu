import { Image, NativeSelect } from '@mantine/core';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'react-feather';
import GoogleMapReact from 'google-map-react';
import MarkerIcon from '../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../utils/config';

const defaultProps = {
  center: {
    lat: 22.567646,
    lng: 88.370743,
  },
  zoom: 11,
};

const Marker = () => <Image src={MarkerIcon} width={40} height={40} />;

const MapView = ({ lists = [] }) => {
  const [value, setValue] = useState('Billboard');

  const getAllLocations = useMemo(
    () => lists.map(item => <Marker lat={item.latitude} lng={item.longitude} key={item._id} />),
    [lists.length > 0],
  );

  return (
    <div className="relative px-5">
      <div style={{ height: '70vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          yesIWantToUseGoogleMapApiInternals
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {lists.length ? getAllLocations : <Marker />}
        </GoogleMapReact>
      </div>
      <div className="absolute top-5 right-10 w-64">
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Billboard']}
          styles={{
            rightSection: { pointerEvents: 'none' },
          }}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          rightSectionWidth={40}
        />
      </div>
    </div>
  );
};

export default MapView;
