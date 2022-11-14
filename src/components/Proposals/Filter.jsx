import { useCallback, useEffect, useState } from 'react';
import { Accordion, Checkbox, Button, Drawer, RangeSlider, NumberInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';

const styles = {
  title: { fontWeight: 'bold' },
};
const sliderStyle = {
  label: {
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};

const Filter = ({ isOpened, setShowFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({ priceMin: 0, priceMax: 10000 });
  const [placeRange, setPlaceRange] = useState({ totalPlacesMin: 0, totalPlacesMax: 10000 });
  const [statusArr, setStatusArr] = useState([]);

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const totalPlacesMin = searchParams.get('totalPlacesMin');
  const totalPlacesMax = searchParams.get('totalPlacesMax');

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
    statusArr.forEach(item => searchParams.append('status', item));
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

  const handleMinPrice = e => {
    setPriceRange(prevState => ({ ...prevState, priceMin: e }));
    searchParams.set('priceMin', e);
  };
  const handleMaxPrice = e => {
    setPriceRange(prevState => ({ ...prevState, priceMax: e }));
    searchParams.set('priceMax', e);
  };
  const handleSliderChange = val => {
    setPriceRange({ priceMin: val[0], priceMax: val[1] });
    searchParams.set('priceMin', val[0]);
    searchParams.set('priceMax', val[1]);
  };

  const handleMinPlace = e => {
    setPlaceRange(prevState => ({ ...prevState, totalPlacesMin: e }));
    searchParams.set('totalPlacesMin', e);
  };
  const handleMaxPlace = e => {
    setPlaceRange(prevState => ({ ...prevState, totalPlacesMax: e }));
    searchParams.set('totalPlacesMax', e);
  };
  const handlePlacesSliderChange = val => {
    setPlaceRange({ totalPlacesMin: val[0], totalPlacesMax: val[1] });
    searchParams.set('totalPlacesMin', val[0]);
    searchParams.set('totalPlacesMax', val[1]);
  };

  useEffect(() => {
    setStatusArr(searchParams.getAll('status'));
    setPriceRange(prevState => ({
      ...prevState,
      priceMin: Number(priceMin) ?? 0,
      priceMax: Number(priceMax) ?? 10000,
    }));

    setPlaceRange(prevState => ({
      ...prevState,
      totalPlacesMin: Number(totalPlacesMin) ?? 0,
      totalPlacesMax: Number(totalPlacesMax) ?? 10000,
    }));
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
        <Accordion>
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
                      <NumberInput
                        value={priceRange.priceMin}
                        onChange={handleMinPrice}
                        label="Min"
                      />
                    </div>
                    <div>
                      <NumberInput
                        value={priceRange.priceMax}
                        onChange={handleMaxPrice}
                        label="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <RangeSlider
                      onChange={handleSliderChange}
                      min={0}
                      max={10000}
                      styles={sliderStyle}
                      defaultValue={[priceRange.priceMin, priceRange.priceMax]}
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
                      <NumberInput
                        value={placeRange.totalPlacesMin}
                        onChange={handleMinPlace}
                        label="Min"
                      />
                    </div>
                    <div>
                      <NumberInput
                        value={placeRange.totalPlacesMax}
                        onChange={handleMaxPlace}
                        label="Max"
                      />
                    </div>
                  </div>
                  <div>
                    <RangeSlider
                      onChange={handlePlacesSliderChange}
                      min={0}
                      max={10000}
                      styles={sliderStyle}
                      defaultValue={[placeRange.totalPlacesMin, placeRange.totalPlacesMax]}
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
