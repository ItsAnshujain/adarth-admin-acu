import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Checkbox, Drawer, RangeSlider, TextInput } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';

const inititalFilterData = {
  'owner': {
    'all': 'All',
    'own': 'Own',
    'peer': 'Peers',
  },
  'tier': {
    'tier_1': 'Tier 1',
    'tier_2': 'Tier 2',
    'tier_3': 'Tier 3',
  },
  'footFall': {
    '5000+': '5000+',
    '10000+': '10000+',
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
  const [filterOptions, setFilterOptions] = useState({
    owner: '',
    category: '',
    subCategory: '',
    mediaType: '',
    tier: '',
    zone: '',
    footFall: '',
    facing: '',
    tags: '',
    demographic: '',
    audience: '',
  });

  const owner = searchParams.get('owner');
  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const mediaType = searchParams.get('mediaType');
  const tier = searchParams.get('tier');
  const zone = searchParams.get('zone');
  const footFall = searchParams.get('footFall');
  const facing = searchParams.get('facing');
  const tags = searchParams.get('tags');
  const demographic = searchParams.get('demographic');
  const audience = searchParams.get('audience');

  const { data: categoryData, isLoading: isCategoryLoading } = useFetchMasters(
    serialize({ type: 'category', parentId: null, limit: 10 }),
  );
  const { data: subCategoryData, isLoading: isSubCategoryLoading } = useFetchMasters(
    serialize({ parentId: category, limit: 10 }),
    !!category,
  );
  const { data: mediaTypeData, isLoading: isMediaTypeLoading } = useFetchMasters(
    serialize({ type: 'media_type', parentId: null, limit: 10 }),
  );
  const { data: zoneData, isLoading: isZoneLoading } = useFetchMasters(
    serialize({ type: 'facing', parentId: null, limit: 10 }),
  );
  const { data: tagData, isLoading: isTagLoading } = useFetchMasters(
    serialize({ type: 'tag', parentId: null, limit: 10 }),
  );
  const { data: facingData, isLoading: isFacingLoading } = useFetchMasters(
    serialize({ type: 'facing', parentId: null, limit: 10 }),
  );
  const { data: demographicsData, isLoading: isDemographicsDataLoading } = useFetchMasters(
    serialize({ type: 'demographic', parentId: null, limit: 10 }),
  );
  const { data: audienceData, isLoading: isAudienceLoading } = useFetchMasters(
    serialize({ type: 'audience', parentId: null, limit: 10 }),
  );

  const handleCheckedValues = (filterValues, filterKey) => {
    setFilterOptions(prevState => ({ ...prevState, [filterKey]: filterValues }));
    searchParams.set(filterKey, filterValues);
  };

  const renderStaticStatus = useCallback(
    (filterDataObj, filterKey) =>
      Object.keys(filterDataObj).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
            onChange={event => handleCheckedValues(event.target.value, filterKey)}
            label={filterDataObj[item]}
            defaultValue={item}
            checked={filterOptions[filterKey] === item}
          />
        </div>
      )),
    [filterOptions],
  );

  const renderDynamicStatus = useCallback(
    (data, filterKey) =>
      data?.map(item => (
        <div className="flex gap-2 mb-2" key={item?._id}>
          <Checkbox
            onChange={event => handleCheckedValues(event.target.value, filterKey)}
            label={item?.name}
            defaultValue={item?._id}
            checked={filterOptions[filterKey] === item._id}
          />
        </div>
      )),
    [filterOptions],
  );

  const handleNavigationByFilter = () => {
    setSearchParams(searchParams);
    setShowFilter(false);
  };

  const handleResetParams = () => {
    searchParams.delete('category');
    searchParams.delete('subCategory');
    searchParams.delete('mediaType');
    searchParams.delete('tier');
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    searchParams.delete('zone');
    searchParams.delete('footFall');
    searchParams.delete('facing');
    searchParams.delete('tags');
    searchParams.delete('demographic');
    searchParams.delete('audience');
    setSearchParams(searchParams);
    setFilterOptions({
      category: '',
      subCategory: '',
      mediaType: '',
      tier: '',
      zone: '',
      footFall: '',
      facing: '',
      tags: '',
      demographic: '',
      audience: '',
    });
  };

  const handleMinPrice = e => {
    setMinPrice(e.target.value);
    searchParams.set('minPrice', e.target.value);
  };
  const handleMaxPrice = e => {
    setMinPrice(e.target.value);
    searchParams.set('maxPrice', e.target.value);
  };
  const handleSliderChange = val => {
    setMinPrice(val[0], setMaxPrice(val[1]));
    searchParams.set('minPrice', val[0]);
    searchParams.set('maxPrice', val[1]);
  };

  useEffect(() => {
    setFilterOptions(prevState => ({
      ...prevState,
      owner: owner || '',
      category: category || '',
      subCategory: subCategory || '',
      mediaType: mediaType || '',
      tier: tier || '',
      zone: zone || '',
      footFall: footFall || '',
      facing: facing || '',
      tags: tags || '',
      demographic: demographic || '',
      audience: audience || '',
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
          <Accordion.Item value="owner" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Inventory Owner</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStaticStatus(inititalFilterData.owner, 'owner')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="category" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isCategoryLoading}>
              <p className="text-lg">Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicStatus(categoryData?.docs, 'category')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="subCategory" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isSubCategoryLoading}>
              <p className="text-lg">Sub Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicStatus(subCategoryData?.docs, 'subCategory')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="mediaType" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isMediaTypeLoading}>
              <p className="text-lg">Media Type</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicStatus(mediaTypeData?.docs, 'mediaType')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="city" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Cities</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStaticStatus(inititalFilterData.tier, 'tier')}</div>
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
                      <TextInput value={minPrice} onChange={handleMinPrice} label="Min" />
                    </div>
                    <div>
                      <TextInput value={maxPrice} onChange={handleMaxPrice} label="Max" />
                    </div>
                  </div>
                  <div>
                    <RangeSlider
                      onChange={handleSliderChange}
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
            <Accordion.Control disabled={isZoneLoading}>
              <p className="text-lg">Zone</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicStatus(zoneData?.docs, 'zone')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="footFall" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Footfall</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStaticStatus(inititalFilterData.footFall)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="facing" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isFacingLoading}>
              <p className="text-lg">Facing</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicStatus(facingData?.docs, 'facing')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tags" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isTagLoading}>
              <p className="text-lg">Tags</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicStatus(tagData?.docs, 'tags')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="demographics" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isDemographicsDataLoading}>
              <p className="text-lg">Demographics</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicStatus(demographicsData?.docs, 'demographic')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="audience" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isAudienceLoading}>
              <p className="text-lg">Audience</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicStatus(audienceData?.docs, 'audience')}</div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
