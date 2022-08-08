import { useState } from 'react';
import { Drawer, Text, RangeSlider, TextInput } from '@mantine/core';

const inititalFilterData = {
  'Cities': {
    'Tier 1': false,
    'Tier 2': false,
    'Tier 3': false,
  },
  'Zone': {
    'North East': false,
    'West': false,
    'South East': false,
    'South': false,
    'North': false,
  },
  'Footfall': {
    'Footfall': false,
    '5000+': false,
    '10000+': false,
  },
  'Facing': {
    'Single': false,
    'Double': false,
    'Four Facing': false,
  },
  'Tags': {
    'Value fot money': false,
    'High Visibility': false,
    'Premium': false,
  },
  'Demographics': {
    'Commercial': false,
    'Highway': false,
  },
  'Audience': {
    'Young': false,
    'Middle Class': false,
    'Elite': false,
    'Urban': false,
    'Female Focused': false,
    'Male Focused': false,
  },
};
const Filter = ({ isOpened, setShowFilter }) => {
  const [filterData, setFilterData] = useState(inititalFilterData);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(800);
  const marks = [
    { value: 200, label: '20%' },
    { value: 800, label: '80%' },
  ];

  return (
    <Drawer
      className="overflow-auto"
      overlayOpacity={0.1}
      overlayBlur={0}
      size="lg"
      transition="slide-down"
      transitionDuration={1350}
      transitionTimingFunction="ease-in-out"
      padding="xl"
      position="right"
      opened={isOpened}
      title="Filters"
      onClose={() => setShowFilter(false)}
    >
      <div className="flex text-gray-400 flex-col gap-4">
        <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl ">
          <div className="border-b py-2">
            <Text size="lg">Price</Text>
          </div>
          <div className="mt-2">
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex justify-between gap-8">
                <div>
                  <TextInput
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    label="Min"
                  />
                </div>
                <div>
                  <TextInput
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    label="Max"
                  />
                </div>
              </div>

              <div>
                <RangeSlider
                  onChangeEnd={val => {
                    setMinPrice(val[0], setMaxPrice(val[1]));
                  }}
                  min={100}
                  max={1000}
                  value={[minPrice, maxPrice]}
                  defaultValue={[200, 1000]}
                  marks={marks}
                />
              </div>
            </div>
          </div>
        </div>
        {Object.keys(filterData).map(data => (
          <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl ">
            <div className="border-b py-2">
              <Text size="lg">{data}</Text>
            </div>
            <div className="mt-2">
              {Object.entries(filterData[data]).map(items => (
                <div className="flex gap-2 mb-2">
                  <input
                    className="w-4 border-gray-400"
                    type="checkbox"
                    checked={items[1]}
                    onChange={() =>
                      setFilterData(prevData => {
                        const newData = { ...prevData };
                        newData[data][items[0]] = !items[1];
                        return newData;
                      })
                    }
                  />
                  <Text size="md">{items[0]}</Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default Filter;
