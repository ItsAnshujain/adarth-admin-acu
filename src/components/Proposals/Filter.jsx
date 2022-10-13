import { useMemo, useState } from 'react';
import { Accordion, Checkbox, Button, Drawer, RangeSlider, TextInput } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';

const styles = {
  title: { fontWeight: 'bold' },
};
const sliderStyle = {
  label: {
    // '&::after': { content: '"k"' },
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

const statusObj = {
  'created': 'Created',
  'draft': 'Draft',
  'awaiting_response': 'Awaiting Response',
  'shared_with_client': 'Shared With Client',
  'iteration_in_progress': 'Iteration In Progress',
  'booked': 'Booked',
};

const Filter = ({ isOpened, setShowFilter }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minPlace, setMinPlace] = useState(0);
  const [maxPlace, setMaxPlace] = useState(10000);
  const [statusArr, setStatusArr] = useState([]);

  const handleStatusArr = stat => {
    let tempArr = [...statusArr];
    if (tempArr.some(item => item?.status === stat)) {
      tempArr = tempArr.filter(item => item?.status !== stat);
    } else {
      tempArr.push({ status: stat });
    }
    setStatusArr(tempArr);
  };

  const renderStatus = useMemo(
    () =>
      Object.keys(statusObj).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
            onChange={event => handleStatusArr(event.target.value)}
            label={statusObj[item]}
            defaultValue={item}
          />
        </div>
      )),
    [statusArr],
  );

  const handleNavigationByFilter = () => {
    const urlParam = new URLSearchParams();
    statusArr.forEach(item => {
      urlParam.append('status', item.status);
    });

    searchParams.delete('status');
    searchParams.set('priceMin', minPrice || 1);
    searchParams.set('priceMax', maxPrice);
    searchParams.set('totalPlacesMin', minPlace || 1);
    searchParams.set('totalPlacesMax', maxPlace);

    navigate({
      pathname: '/proposals',
      search: `${searchParams.toString()}&${urlParam.toString()}`,
    });
  };
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
        <Button
          variant="default"
          className="mb-3 bg-purple-450 text-white"
          onClick={handleNavigationByFilter}
        >
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
                      onChange={val => {
                        setMinPrice(val[0], setMaxPrice(val[1]));
                      }}
                      min={0}
                      max={10000}
                      styles={sliderStyle}
                      value={[minPrice, maxPrice]}
                      defaultValue={[0, 10000]}
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
                        value={minPlace}
                        onChange={e => setMinPlace(e.target.value)}
                        label="Min"
                      />
                    </div>
                    <div>
                      <TextInput
                        value={maxPlace}
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
                      min={0}
                      max={10000}
                      styles={totalPlacesSlider}
                      value={[minPlace, maxPlace]}
                      defaultValue={[0, 10000]}
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
