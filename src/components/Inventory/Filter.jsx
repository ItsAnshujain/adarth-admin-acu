import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Checkbox, Drawer, RangeSlider, TextInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

const inititalFilterData = {
  'inventoryOwner': {
    'all': 'All',
    'own': 'Own',
    'peers': 'Peers',
  },
  'category': {
    'billboards': 'Billboards',
    'digital_screens': 'Digital Screens',
    'transit_media': 'Transit Media',
    'street_furniture': 'Street Furniture',
  },
  'subCategory': {
    'billboards': 'Billboards',
    'unipoles': 'Unipoles',
    'car_wraps': 'Car Wraps',
    'bus_wraps': 'Bus Wraps',
    'digital_screens': 'Digital Screens',
  },
  'mediaType': {
    'premium': 'Premium',
    'economical': 'Economical',
  },
  'cities': {
    'tier_1': 'Tier 1',
    'tier_2': 'Tier 2',
    'tier_3': 'Tier 3',
  },
  'zone': {
    'north_east': 'North East',
    'west': 'West',
    'south_east': 'South East',
    'south': 'South',
    'north': 'North',
  },
  'footFall': {
    '5000+': '5000+',
    '10000+': '10000+',
  },
  'facing': {
    'single': 'Single',
    'double': 'Double',
    'four_facing': 'Four Facing',
  },
  'tags': {
    'value_for_money': 'Value for money',
    'high_visibility': 'High Visibility',
    'premium': 'Premium',
  },
  'demographics': {
    'commercial': 'Commercial',
    'highway': 'Highway',
  },
  'audience': {
    'young': 'Young',
    'middle_class': 'Middle Class',
    'elite': 'Elite',
    'urban': 'Urban',
    'female_focused': 'Female Focused',
    'male_focused': 'Male Focused',
  },
};
const styles = { title: { fontWeight: 'bold' } };
const sliderStyle = {
  label: {
    // '&::after': { content: '"k"' },
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
  const [tierCity, setTierCity] = useState();

  const handleCheckedValues = (filterValues, filterKey) => {
    searchParams.set(filterKey, filterValues);
    setTierCity(filterValues);
    // const urlParam = new URLSearchParams();
    // urlParam.append(filterKey, filterValues);
    // setParams(prevState => `${prevState}&${urlParam.toString()}`);
  };

  const renderStatus = useCallback(
    (filterDataObj, filterKey) =>
      Object.keys(filterDataObj).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
            onChange={event => handleCheckedValues(event.target.value, filterKey)}
            label={filterDataObj[item]}
            defaultValue={item}
            checked={item === tierCity}
          />
        </div>
      )),
    [tierCity],
  );

  const handleNavigationByFilter = () => {
    setSearchParams(searchParams);
    // const urlParam = new URLSearchParams();
    // urlParam.append('city', item.status);
    // searchParams.delete('status');
    // searchParams.set('priceMin', minPrice || 1);
    // searchParams.set('priceMax', maxPrice);
    // searchParams.set('totalPlacesMin', minPlace || 1);
    // searchParams.set('totalPlacesMax', maxPlace);
    // navigate({
    //   pathname: '/inventory',
    //   search: `${params}`,
    // });
  };

  const handleResetParams = () => {
    searchParams.delete('status');
    searchParams.delete('priceMin');
    searchParams.delete('priceMax');
    searchParams.delete('totalPlacesMin');
    searchParams.delete('totalPlacesMax');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setTierCity(searchParams.get('city'));
    // setMinPrice(searchParams.get('priceMin') ?? 0);
    // setMaxPrice(searchParams.get('priceMax') ?? 100000);
    // setMinPlace(searchParams.get('totalPlacesMin') ?? 0);
    // setMaxPlace(searchParams.get('totalPlacesMax') ?? 100000);
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
        <Accordion defaultValue="inventoryOwner">
          <Accordion.Item value="inventoryOwner" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Inventory Owner</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderStatus(inititalFilterData.inventoryOwner, 'landlord')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="category" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.category, 'category')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="subCategory" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Sub Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderStatus(inititalFilterData.subCategory, 'subCategory')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="mediaType" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Media Type</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.mediaType, 'mediaType')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="cities" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Cities</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.cities, 'city')}</div>
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

          <Accordion.Item value="zone" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Zone</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.zone)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="footFall" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Footfall</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.footFall)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="facing" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Facing</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.facing)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tags" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Tags</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.tags)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="demographics" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Demographics</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.demographics)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="audience" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Audience</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStatus(inititalFilterData.audience)}</div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
