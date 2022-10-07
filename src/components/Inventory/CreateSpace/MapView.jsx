import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Image } from '@mantine/core';
import MarkerIcon from '../../../assets/pin.svg';
import { GOOGLE_MAPS_API_KEY } from '../../../utils/config';

const defaultProps = {
  center: {
    lat: 28.70406,
    lng: 77.102493,
  },
  zoom: 10,
};

const Marker = () => <Image src={MarkerIcon} height={28} width={28} />;

const MapView = ({ latitude, longitude }) => {
  // eslint-disable-next-line no-unused-vars
  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
  };

  return (
    <div className="w-[40%] h-[30vh] border bg-gray-450">
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY, libraries: 'places' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        <Marker lat={latitude} lng={longitude} />
      </GoogleMapReact>
    </div>
  );
};

export default MapView;
