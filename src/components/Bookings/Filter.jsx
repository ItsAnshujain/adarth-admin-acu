import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Button, Drawer, RangeSlider, TextInput } from '@mantine/core';

// TODO: Campaign Incharge in filter
const sliderStyle = {
  label: {
    '&::after': { content: '"k"' },
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};

const inititalFilterData = {
  'Booking Type': { 'Online': false, 'Offline': false },
  'Campaign Status': { 'Upcoming': false, 'Ongoing': false, 'Completed': false },
  'Payment Status': { 'Paid': false, 'Unpaid': false },
  'Printing Status': { 'Upcoming': false, 'Inprogress': false, 'Completed': false },
  'Mounting Status': { 'Upcoming': false, 'Inprogress': false, 'Completed': false },
  'Payment Type': { 'Cash': false },
};
const styles = { title: { fontWeight: 'bold' } };

const Filter = ({ isOpened, setShowFilter }) => {
  const [filterData, setFilterData] = useState(inititalFilterData);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(800);
  const [minPlace, setMinPlace] = useState(200);
  const [maxPlace, setMaxPlace] = useState(800);
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
      <div className="w-full flex justify-end">
        <Button variant="default" className="mb-3 bg-purple-450 text-white">
          Apply Filters
        </Button>
      </div>
      <div className="flex text-gray-400 flex-col gap-4">
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
                  styles={sliderStyle}
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
        ))}
        <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl">
          <div className="border-b py-2 flex justify-between items-center">
            <p className="text-lg">Total Places</p>
            <ChevronDown className="h-4" />
          </div>
          <div className="mt-2">
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex justify-between gap-8">
                <div>
                  <TextInput
                    value={`${minPlace}`}
                    onChange={e => setMinPlace(e.target.value)}
                    label="Min"
                  />
                </div>
                <div>
                  <TextInput
                    value={`${maxPlace}`}
                    onChange={e => setMaxPlace(e.target.value)}
                    label="Max"
                  />
                </div>
              </div>

              <div>
                <RangeSlider
                  onChange={val => {
                    setMinPlace(val[0], setMaxPlace(val[1]));
                  }}
                  min={100}
                  max={1000}
                  value={[minPlace, maxPlace]}
                  defaultValue={[200, 1000]}
                  marks={marks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Filter;
