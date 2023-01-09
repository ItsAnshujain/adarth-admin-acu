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
  'tier': [
    {
      name: 'Tier 1',
      _id: 'tier_1',
    },
    {
      name: 'Tier 2',
      _id: 'tier_2',
    },
    {
      name: 'Tier 3',
      _id: 'tier_3',
    },
  ],
  'footFall': [
    {
      name: '5000+',
      _id: '5000',
    },
    {
      name: '10000+',
      _id: '10000',
    },
  ],
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
    category: [],
    subCategory: [],
    mediaType: [],
    tier: [],
    zone: [],
    footFall: [],
    facing: [],
    tags: [],
    demographic: [],
    audience: [],
  });
  const [_, setDynamicNumInput] = useState({
    min: 0,
    max: 10000,
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
  const tags = searchParams.get('tags');
  const demographic = searchParams.get('demographic');
  const audience = searchParams.get('audience');

  const { data: categoryData, isLoading: isCategoryLoading } = useFetchMasters(
    serialize({ type: 'category', parentId: null, limit: 100, page: 1 }),
  );
  const { data: subCategoryData, isLoading: isSubCategoryLoading } = useFetchMasters(
    serialize({ parentId: filterOptions.category?.join(','), limit: 100, page: 1 }),
    !!filterOptions.category,
  );
  const { data: mediaTypeData, isLoading: isMediaTypeLoading } = useFetchMasters(
    serialize({ type: 'media_type', parentId: null, limit: 100, page: 1 }),
  );
  const { data: zoneData, isLoading: isZoneLoading } = useFetchMasters(
    serialize({ type: 'zone', parentId: null, limit: 100, page: 1 }),
  );
  const { data: tagData, isLoading: isTagLoading } = useFetchMasters(
    serialize({ type: 'tag', parentId: null, limit: 100, page: 1 }),
  );
  const { data: facingData, isLoading: isFacingLoading } = useFetchMasters(
    serialize({ type: 'facing', parentId: null, limit: 100, page: 1 }),
  );
  const { data: demographicsData, isLoading: isDemographicsDataLoading } = useFetchMasters(
    serialize({ type: 'demographic', parentId: null, limit: 100, page: 1 }),
  );
  const { data: audienceData, isLoading: isAudienceLoading } = useFetchMasters(
    serialize({ type: 'audience', parentId: null, limit: 100, page: 1 }),
  );

  const handleCheckedValues = (filterValues, filterKey) => {
    setFilterOptions(prevState => ({ ...prevState, [filterKey]: filterValues }));
    searchParams.set(filterKey, filterValues);
  };

  const handleStatusArr = (stat, key) => {
    let tempArr = [...filterOptions[key]]; // TODO: use immmer
    if (tempArr.some(item => item === stat)) {
      tempArr = tempArr.filter(item => item !== stat);
    } else {
      tempArr.push(stat);
    }

    setFilterOptions({ ...filterOptions, [key]: [...tempArr] });
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

  const renderDynamicOptionsArr = useCallback(
    (data, filterKey) =>
      data?.map(item => (
        <div className="flex gap-2 mb-2" key={item?._id}>
          <Checkbox
            onChange={event => handleStatusArr(event.target.value, filterKey)}
            label={item?.name}
            defaultValue={item?._id}
            checked={filterOptions[filterKey].includes(item._id)}
          />
        </div>
      )),
    [
      filterOptions.category,
      filterOptions.subCategory,
      filterOptions.mediaType,
      filterOptions.tier,
      filterOptions.zone,
      filterOptions.footFall,
      filterOptions.facing,
      filterOptions.tags,
      filterOptions.demographic,
      filterOptions.audience,
    ],
  );

  const handleNavigationByFilter = () => {
    searchParams.delete('category');
    searchParams.delete('subCategory');
    searchParams.delete('mediaType');
    searchParams.delete('zone');
    searchParams.delete('footFall');
    searchParams.delete('tier');
    searchParams.delete('facing');
    searchParams.delete('tags');
    searchParams.delete('demographic');
    searchParams.delete('audience');
    if (filterOptions.category.length)
      searchParams.append('category', filterOptions.category.join(','));
    if (filterOptions.subCategory.length)
      searchParams.append('subCategory', filterOptions.subCategory.join(','));
    if (filterOptions.mediaType.length)
      searchParams.append('mediaType', filterOptions.mediaType.join(','));
    if (filterOptions.tier.length) searchParams.append('tier', filterOptions.tier.join(','));
    if (filterOptions.zone.length) searchParams.append('zone', filterOptions.zone.join(','));
    if (filterOptions.footFall.length)
      searchParams.append('footFall', filterOptions.footFall.join(','));
    if (filterOptions.facing.length) searchParams.append('facing', filterOptions.facing.join(','));
    if (filterOptions.tags.length) searchParams.append('tags', filterOptions.tags.join(','));
    if (filterOptions.demographic.length)
      searchParams.append('demographic', filterOptions.demographic.join(','));
    if (filterOptions.audience.length)
      searchParams.append('audience', filterOptions.audience.join(','));
    searchParams.set('page', 1);
    setSearchParams(searchParams);
    setShowFilter(false);
  };

  const handleResetParams = () => {
    searchParams.delete('owner');
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
      owner: '',
      category: [],
      subCategory: [],
      mediaType: [],
      tier: '',
      zone: [],
      footFall: '',
      facing: [],
      tags: [],
      demographic: [],
      audience: [],
    });
  };

  const handleMinPrice = e => {
    setDynamicNumInput(prevState => ({ ...prevState, min: e }));
    searchParams.set('minPrice', e);
    searchParams.set('maxPrice', searchParams.get('maxPrice') || 10000);
  };
  const handleMaxPrice = e => {
    setDynamicNumInput(prevState => ({ ...prevState, max: e }));
    searchParams.set('maxPrice', e);
    searchParams.set('minPrice', searchParams.get('minPrice') || 0);
  };
  const handleSliderChange = val => {
    setDynamicNumInput(prevState => ({ ...prevState, min: val[0] }));
    setDynamicNumInput(prevState => ({ ...prevState, max: val[1] }));
    searchParams.set('minPrice', val[0]);
    searchParams.set('maxPrice', val[1]);
  };

  useEffect(() => {
    setFilterOptions(prevState => ({
      ...prevState,
      owner: owner || '',
      category: category?.split(',') || [],
      subCategory: subCategory?.split(',') || [],
      mediaType: mediaType?.split(',') || [],
      tier: tier?.split(',') || [],
      zone: zone?.split(',') || [],
      footFall: footFall?.split(',') || [],
      facing: facing?.split(',') || [],
      tags: tags?.split(',') || [],
      demographic: demographic?.split(',') || [],
      audience: audience?.split(',') || [],
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
              <div className="mt-2">{renderDynamicOptionsArr(categoryData?.docs, 'category')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="subCategory" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isSubCategoryLoading}>
              <p className="text-lg">Sub Category</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptionsArr(subCategoryData?.docs, 'subCategory')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="mediaType" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isMediaTypeLoading}>
              <p className="text-lg">Media Type</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptionsArr(mediaTypeData?.docs, 'mediaType')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="city" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Cities</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptionsArr(inititalFilterData.tier, 'tier')}</div>
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
                      value={[
                        minPrice && !Number.isNaN(parseInt(minPrice, 10))
                          ? parseInt(minPrice, 10)
                          : 0,
                        maxPrice && !Number.isNaN(parseInt(maxPrice, 10))
                          ? parseInt(maxPrice, 10)
                          : 10000,
                      ]}
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
              <div className="mt-2">{renderDynamicOptionsArr(zoneData?.docs, 'zone')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="footFall" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Footfall</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptionsArr(inititalFilterData.footFall, 'footFall')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="facing" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isFacingLoading}>
              <p className="text-lg">Facing</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptionsArr(facingData?.docs, 'facing')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tags" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isTagLoading}>
              <p className="text-lg">Tags</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptionsArr(tagData?.docs, 'tags')}</div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="demographics" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isDemographicsDataLoading}>
              <p className="text-lg">Demographics</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptionsArr(demographicsData?.docs, 'demographic')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="audience" className="mb-4 rounded-xl border">
            <Accordion.Control disabled={isAudienceLoading}>
              <p className="text-lg">Audience</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderDynamicOptionsArr(audienceData?.docs, 'audience')}</div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
