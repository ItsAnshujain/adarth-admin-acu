import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Drawer, RangeSlider, TextInput } from '@mantine/core';

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
const styles = { title: { fontWeight: 'bold' } };
const sliderStyle = {
  label: {
    '&::after': { content: '"k"' },
  },
  markLabel: {
    display: 'none',
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
      styles={styles}
      title="Filters"
      onClose={() => setShowFilter(false)}
    >
      <div className="flex text-gray-400 flex-col gap-4">
        <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl">
          <div className="border-b py-2 flex justify-between items-center">
            <p className="text-lg">Cities</p>
            <ChevronDown className="h-4" />
          </div>
          <div className="mt-2">
            {Object.entries(filterData.Cities).map(items => (
              <div className="flex gap-2 mb-2">
                <input
                  className="w-4 border-gray-400"
                  type="checkbox"
                  checked={items[1]}
                  onChange={() =>
                    setFilterData(prevData => {
                      const newData = { ...prevData };
                      newData.Cities[items[0]] = !items[1];
                      return newData;
                    })
                  }
                />
                <p>{items[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(filterData).map(data =>
          data === 'Cities' ? (
            <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl">
              <div className="border-b py-2 flex justify-between items-center">
                <p className="text-lg">Price</p>
                <ChevronDown className="h-4" />
              </div>
              <div className="mt-2">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex justify-between gap-8">
                    <div>
                      <TextInput
                        value={`${minPrice}k`}
                        onChange={e => setMinPrice(e.target.value)}
                        label="Min"
                      />
                    </div>
                    <div>
                      <TextInput
                        value={`${maxPrice}k`}
                        onChange={e => setMaxPrice(e.target.value)}
                        label="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <RangeSlider
                      onChange={val => {
                        setMinPrice(val[0], setMaxPrice(val[1]));
                      }}
                      min={100}
                      max={1000}
                      styles={sliderStyle}
                      value={[minPrice, maxPrice]}
                      defaultValue={[200, 1000]}
                      marks={marks}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl">
              <div className="border-b py-2 flex justify-between items-center">
                <p className="text-lg">{data}</p>
                <ChevronDown className="h-4" />
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
                    <p>{items[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </Drawer>
  );
};

export default Filter;
