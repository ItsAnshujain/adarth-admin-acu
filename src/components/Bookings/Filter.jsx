import { useState, useEffect, useCallback } from 'react';
import { Accordion, Button, Drawer, NumberInput, Radio, RangeSlider } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils/index';

const inititalFilterData = {
  'bookingType': {
    'online': 'Online',
    'offline': 'Offline',
  },
  'paymentType': {
    'neft': 'NEFT',
    'rtgs': 'RTGS',
    'cheque': 'Cheque',
  },
};

const sliderStyle = {
  label: {
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};
const styles = { title: { fontWeight: 'bold' } };

const Filter = ({ isOpened, setShowFilter }) => {
  const [filterOptions, setFilterOptions] = useState({
    paymentType: '',
    campaignStatus: '',
    printingStatus: '',
    mountingStatus: '',
    paymentStatus: '',
    bookingType: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const paymentType = searchParams.get('paymentType');
  const campaignStatus = searchParams.get('campaignStatus');
  const printingStatus = searchParams.get('printingStatus');
  const mountingStatus = searchParams.get('mountingStatus');
  const paymentStatus = searchParams.get('paymentStatus');
  const bookingType = searchParams.get('bookingType');

  const { data: campaignStatusData } = useFetchMasters(
    serialize({ type: 'campaign_status', limit: 100 }),
  );
  const { data: paymentStatusData } = useFetchMasters(
    serialize({ type: 'payment_status', limit: 100 }),
  );
  const { data: printingStatusData } = useFetchMasters(
    serialize({ type: 'printing_status', limit: 100 }),
  );
  const { data: mountingStatusData } = useFetchMasters(
    serialize({ type: 'mounting_status', limit: 100 }),
  );

  const handleCheckedValues = (filterValues, filterKey) => {
    setFilterOptions(prevState => ({ ...prevState, [filterKey]: filterValues }));
    searchParams.set(filterKey, filterValues);
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

  const handleNavigationByFilter = () => {
    setSearchParams(searchParams);
    setShowFilter(false);
  };

  const handleResetParams = () => {
    searchParams.delete('paymentType');
    searchParams.delete('campaignStatus');
    searchParams.delete('printingStatus');
    searchParams.delete('mountingStatus');
    searchParams.delete('paymentStatus');
    searchParams.delete('bookingType');
    searchParams.delete('minPrice');
    searchParams.delete('maxPrice');
    setSearchParams(searchParams);
    setFilterOptions({
      paymentType: '',
      printingStatus: '',
      mountingStatus: '',
      paymentStatus: '',
      bookingType: '',
    });
  };

  const handleMinPrice = e => searchParams.set('minPrice', e);
  const handleMaxPrice = e => searchParams.set('maxPrice', e);
  const handleSliderChange = val => {
    searchParams.set('minPrice', val[0]);
    searchParams.set('maxPrice', val[1]);
  };

  useEffect(() => {
    setFilterOptions(prevState => ({
      ...prevState,
      paymentType: paymentType || '',
      campaignStatus: campaignStatus || '',
      printingStatus: printingStatus || '',
      mountingStatus: mountingStatus || '',
      paymentStatus: paymentStatus || '',
      bookingType: bookingType || '',
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
          <Accordion.Item value="price" className="border-solid border-2 rounded-xl mb-2 p-1">
            <Accordion.Control className="hover:bg-white">Price</Accordion.Control>
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
                      defaultValue={[minPrice, maxPrice]}
                    />
                  </div>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="paymentType" className="border-solid border-2 rounded-xl mb-2 p-1">
            <Accordion.Control className="hover:bg-white">Payment Type</Accordion.Control>
            <Accordion.Panel>
              {renderStaticOptions(inititalFilterData.paymentType, 'paymentType')}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className="border-solid border-2 rounded-xl mb-2 p-1" value="bookingType">
            <Accordion.Control className="hover:bg-white">Booking Type</Accordion.Control>
            <Accordion.Panel>
              {renderStaticOptions(inititalFilterData.bookingType, 'bookingType')}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="campaignStatus"
          >
            <Accordion.Control className="hover:bg-white">Campaign Status</Accordion.Control>
            <Accordion.Panel>
              {renderDynamicOptions(campaignStatusData?.docs, 'campaignStatus')}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="mountingStatus"
          >
            <Accordion.Control className="hover:bg-white">Mounting Status</Accordion.Control>
            <Accordion.Panel>
              {renderDynamicOptions(mountingStatusData?.docs, 'mountingStatus')}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="printingStatus"
          >
            <Accordion.Control className="hover:bg-white">Printing Status</Accordion.Control>
            <Accordion.Panel>
              {renderDynamicOptions(printingStatusData?.docs, 'printingStatus')}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="paymentStatus"
          >
            <Accordion.Control className="hover:bg-white">Payment Status</Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderDynamicOptions(paymentStatusData?.docs, 'paymentStatus')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
