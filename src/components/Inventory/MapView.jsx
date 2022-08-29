import { NativeSelect } from '@mantine/core';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import Map from '../../assets/MapInventory.png';

const MapView = () => {
  const [value, setValue] = useState('Billboard');

  return (
    <div className="pl-5 mb-10 relative pr-7">
      <img src={Map} alt="map" />
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
