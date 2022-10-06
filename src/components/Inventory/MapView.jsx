import { Image, NativeSelect } from '@mantine/core';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import GoogleMapReact from 'google-map-react';
import MarkerIcon from '../../assets/pin.png';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

const Marker = () => (
  <div>
    <Image src={MarkerIcon} width={40} height={40} />
  </div>
);

const MapView = () => {
  const [value, setValue] = useState('Billboard');

  return (
    <div className="relative px-5">
      <div style={{ height: '70vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
          yesIWantToUseGoogleMapApiInternals
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <Marker />
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
