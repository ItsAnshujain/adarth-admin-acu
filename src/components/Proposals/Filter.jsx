import { useMemo, useState } from 'react';
import { Accordion, Checkbox, Button, Drawer, RangeSlider, TextInput } from '@mantine/core';

const inititalFilterData = {
  'Status': {
    'created': 'Created',
    'draft': 'Draft',
    'awaiting_response': 'Awaiting Response',
    'shared_with_client': 'Shared With Client',
    'iteration_in_progress': 'Iteration In Progress',
  },
};
const styles = {
  title: { fontWeight: 'bold' },
};
const sliderStyle = {
  label: {
    '&::after': { content: '"k"' },
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};
const totalPlacesSlider = {
  label: {
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};

const Filter = ({ isOpened, setShowFilter }) => {
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(800);
  const [minPlace, setMinPlace] = useState(200);
  const [maxPlace, setMaxPlace] = useState(800);
  const marks = [{ value: 200 }, { value: 800 }];

  const [_, setCheckedValue] = useState(false);

  const renderStatus = useMemo(
    () =>
      Object.keys(inititalFilterData.Status).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
            onChange={event => setCheckedValue(event.currentTarget.value)}
            label={inititalFilterData.Status[item]}
            value={item}
          />
        </div>
      )),
    [],
  );

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
        <Accordion defaultValue="status">
          <Accordion.Item value="status" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Status</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="price" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Price</p>
            </Accordion.Control>
            <Accordion.Panel>
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
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="total-places" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Total Places</p>
            </Accordion.Control>
            <Accordion.Panel>
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
                      styles={totalPlacesSlider}
                      value={[minPlace, maxPlace]}
                      defaultValue={[200, 1000]}
                      marks={marks}
                    />
                  </div>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
