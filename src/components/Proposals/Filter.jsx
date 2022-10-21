import { useCallback, useEffect, useState } from 'react';
import { Accordion, Checkbox, Button, Drawer, RangeSlider, TextInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';

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

const Filter = ({ isOpened, setShowFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minPlace, setMinPlace] = useState(0);
  const [maxPlace, setMaxPlace] = useState(10000);
  const [statusArr, setStatusArr] = useState([]);

  const { data: proposalStatusData, isLoading: isProposalStatusLoading } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 10 }),
  );

  const handleStatusArr = stat => {
    let tempArr = [...statusArr]; // TODO: use immmer
    if (tempArr.some(item => item === stat)) {
      tempArr = tempArr.filter(item => item !== stat);
    } else {
      tempArr.push(stat);
    }

    setStatusArr(tempArr);
  };

  const renderStatus = useCallback(
    data =>
      data?.map(item => (
        <div className="flex gap-2 mb-2" key={item?._id}>
          <Checkbox
            onChange={event => handleStatusArr(event.target.value)}
            label={item?.name}
            defaultValue={item?._id}
            checked={statusArr.includes(item._id)}
          />
        </div>
      )),
    [statusArr],
  );

  const handleNavigationByFilter = () => {
    searchParams.delete('status');
    statusArr.forEach(item => {
      searchParams.append('status', item);
    });

    setSearchParams(searchParams);
    setShowFilter(false);
  };

  const handleResetParams = () => {
    searchParams.delete('status');
    searchParams.delete('priceMin');
    searchParams.delete('priceMax');
    searchParams.delete('totalPlacesMin');
    searchParams.delete('totalPlacesMax');
    setSearchParams(searchParams);
    setStatusArr([]);
  };

  useEffect(() => {
    setStatusArr(searchParams.getAll('status'));
    setMinPrice(searchParams.get('priceMin') ?? 0);
    setMaxPrice(searchParams.get('priceMax') ?? 100000);
    setMinPlace(searchParams.get('totalPlacesMin') ?? 0);
    setMaxPlace(searchParams.get('totalPlacesMax') ?? 100000);
  }, [searchParams]);

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
        <Button onClick={handleResetParams} className="border-black text-black radius-md mr-3">
          Reset
        </Button>
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
            <Accordion.Control disabled={isProposalStatusLoading}>
              <p className="text-lg">Status</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(proposalStatusData?.docs)}</div>
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
                        onChange={e => {
                          setMinPrice(e.target.value);
                          searchParams.set('priceMin', e.target.value);
                        }}
                        label="Min"
                      />
                    </div>
                    <div>
                      <TextInput
                        value={maxPrice}
                        onChange={e => {
                          setMaxPrice(e.target.value);
                          searchParams.set('priceMax', e.target.value);
                        }}
                        label="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <RangeSlider
                      onChange={val => {
                        setMinPrice(val[0], setMaxPrice(val[1]));
                        searchParams.set('priceMin', val[0]);
                        searchParams.set('priceMax', val[1]);
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
                        onChange={e => {
                          setMinPlace(e.target.value);
                          searchParams.set('totalPlacesMin', e.target.value);
                        }}
                        label="Min"
                      />
                    </div>
                    <div>
                      <TextInput
                        value={maxPlace}
                        onChange={e => {
                          setMaxPlace(e.target.value);
                          searchParams.set('totalPlacesMax', e.target.value);
                        }}
                        label="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <RangeSlider
                      onChange={val => {
                        setMinPlace(val[0], setMaxPlace(val[1]));
                        searchParams.set('totalPlacesMin', val[0]);
                        searchParams.set('totalPlacesMax', val[1]);
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
