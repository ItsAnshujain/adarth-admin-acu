import { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Drawer,
  NumberInput,
  Radio,
  RangeSlider,
} from '@mantine/core';
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
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};

const Filter = ({ isOpened, setShowFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState({
    owner: '',
    category: '',
    subCategory: '',
    mediaType: '',
    tier: '',
    zone: '',
    footFall: '',
    facing: '',
    tags: [],
    demographic: '',
    audience: '',
  });

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const owner = searchParams.get('owner');
  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const mediaType = searchParams.get('mediaType');
  const tier = searchParams.get('tier');
  const zone = searchParams.get('zone');
  const footFall = searchParams.get('footFall');
  const facing = searchParams.get('facing');
  const tags = searchParams.getAll('tags');
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

  const handleStatusArr = stat => {
    let tempArr = [...filterOptions.tags]; // TODO: use immmer
    if (tempArr.some(item => item === stat)) {
      tempArr = tempArr.filter(item => item !== stat);
    } else {
      tempArr.push(stat);
    }

    setFilterOptions({ ...filterOptions, tags: [...tempArr] });
  };

  const renderStaticOptions = useCallback(
    (filterDataObj, filterKey) =>
      Object.keys(filterDataObj).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Radio
            onChange={event => handleCheckedValues(event.target.value, filterKey)}
            label={filterDataObj[item]}
            defaultValue={item}
            checked={filterOptions[filterKey] === item}
          />
        </div>
      )),
    [filterOptions],
  );

  const renderDynamicOptions = useCallback(
    (data, filterKey) =>
      data?.map(item => (
        <div className="flex gap-2 mb-2" key={item?._id}>
          <Radio
            onChange={event => handleCheckedValues(event.target.value, filterKey)}
            label={item?.name}
            defaultValue={item?._id}
            checked={filterOptions[filterKey] === item._id}
          />
        </div>
      )),
    [filterOptions],
  );

  const renderDynamicOptionsArr = useCallback(
    data =>
      data?.map(item => (
        <div className="flex gap-2 mb-2" key={item?._id}>
          <Checkbox
            onChange={event => handleStatusArr(event.target.value)}
            label={item?.name}
            defaultValue={item?._id}
            checked={filterOptions.tags.includes(item._id)}
          />
        </div>
      )),
    [filterOptions.tags],
  );

  const handleNavigationByFilter = () => {
    searchParams.delete('tags');
    filterOptions.tags.forEach(item => searchParams.append('tags', item));
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
      tags: [],
      demographic: '',
      audience: '',
    });
  };

  const handleMinPrice = e => {
    searchParams.set('minPrice', e);
    searchParams.set('maxPrice', searchParams.get('maxPrice') || 10000);
  };
  const handleMaxPrice = e => {
    searchParams.set('maxPrice', e);
    searchParams.set('minPrice', searchParams.get('minPrice') || 0);
  };
  const handleSliderChange = val => {
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
      tags: tags || [],
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
              <div className="mt-2">{renderStaticOptions(inititalFilterData.owner, 'owner')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="category" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isCategoryLoading}>
              <p className="text-lg">Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptions(categoryData?.docs, 'category')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="subCategory" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isSubCategoryLoading}>
              <p className="text-lg">Sub Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptions(subCategoryData?.docs, 'subCategory')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="mediaType" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isMediaTypeLoading}>
              <p className="text-lg">Media Type</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptions(mediaTypeData?.docs, 'mediaType')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="city" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Cities</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStaticOptions(inititalFilterData.tier, 'tier')}</div>
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
                        value={
                          minPrice && !Number.isNaN(parseInt(minPrice, 10))
                            ? parseInt(minPrice, 10)
                            : 0
                        }
                        onChange={handleMinPrice}
                        label="Min"
                      />
                    </div>
                    <div>
                      <NumberInput
                        value={
                          maxPrice && !Number.isNaN(parseInt(maxPrice, 10))
                            ? parseInt(maxPrice, 10)
                            : 10000
                        }
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
              <div className="mt-2">{renderDynamicOptions(zoneData?.docs, 'zone')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="footFall" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Footfall</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderStaticOptions(inititalFilterData.footFall)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="facing" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isFacingLoading}>
              <p className="text-lg">Facing</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptions(facingData?.docs, 'facing')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tags" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isTagLoading}>
              <p className="text-lg">Tags</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptionsArr(tagData?.docs)}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="demographics" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isDemographicsDataLoading}>
              <p className="text-lg">Demographics</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptions(demographicsData?.docs, 'demographic')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="audience" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isAudienceLoading}>
              <p className="text-lg">Audience</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptions(audienceData?.docs, 'audience')}</div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
