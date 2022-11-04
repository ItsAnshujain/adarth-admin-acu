import { useState, useEffect } from 'react';
import { Accordion, Button, Checkbox, Drawer, RangeSlider, TextInput } from '@mantine/core';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchMasters } from '../../hooks/masters.hooks';
import { serialize } from '../../utils/index';

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

const styles = { title: { fontWeight: 'bold' } };

const marks = [
  { value: 200, label: '20%' },
  { value: 800, label: '80%' },
];

const Filter = ({ isOpened, setShowFilter }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState({ minPrice: 200, maxPrice: 800 });
  const [searchParam] = useSearchParams();

  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', limit: 100 }),
  );
  const { data: paymentStatus } = useFetchMasters(
    serialize({ type: 'payment_status', limit: 100 }),
  );
  const { data: printingStatus } = useFetchMasters(
    serialize({ type: 'printing_status', limit: 100 }),
  );
  const { data: mountingStatus } = useFetchMasters(
    serialize({ type: 'mounting_status', limit: 100 }),
  );

  const handleApplyFilters = () => {
    let query = '';
    for (const key of Object.keys(filterData)) {
      if (Array.isArray(filterData[key])) {
        for (const item of filterData[key]) {
          if (query) {
            query += `&${key}=${item}`;
          } else {
            query += `${key}=${item}`;
          }
        }
      } else if (query) {
        query += `&${key}=${filterData[key]}`;
      } else {
        query += `${key}=${filterData[key]}`;
      }
    }
    navigate(`${pathname}?${query}`);
  };

  useEffect(() => {
    const data = {};

    data.paymentType = searchParam.get('paymentType') || '';
    data.printingStatus = searchParam.get('printingStatus') || '';
    data.mountingStatus = searchParam.get('mountingStatus') || '';
    data.paymentStatus = searchParam.get('paymentStatus') || '';
    data.campaignStatus = searchParam.get('campaignStatus') || '';
    data.bookingType = searchParam.get('bookingType') || '';
    data.minPrice = Number(searchParam.get('minPrice')) || 200;
    data.maxPrice = Number(searchParam.get('maxPrice')) || 800;
    setFilterData({ ...data });
  }, [searchParam]);

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
          onClick={handleApplyFilters}
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
                      <TextInput
                        value={`${filterData.minPrice}k`}
                        onChange={e =>
                          setFilterData(prev => ({ ...prev, minPrice: e.target.value }))
                        }
                        label="Min"
                      />
                    </div>
                    <div>
                      <TextInput
                        value={`${filterData.maxPrice}k`}
                        onChange={e =>
                          setFilterData(prev => ({ ...prev, maxPrice: e.target.value }))
                        }
                        label="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <RangeSlider
                      onChange={val => {
                        setFilterData(prev => ({ ...prev, minPrice: val[0], maxPrice: val[1] }));
                      }}
                      styles={sliderStyle}
                      min={100}
                      max={1000}
                      value={[filterData.minPrice, filterData.maxPrice]}
                      defaultValue={[200, 1000]}
                      marks={marks}
                    />
                  </div>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          {/* PaymentType */}
          <Accordion.Item value="paymentType" className="border-solid border-2 rounded-xl mb-2 p-1">
            <Accordion.Control className="hover:bg-white">Payment Type</Accordion.Control>
            <Accordion.Panel>
              {['NEFT', 'RTGS', 'Cheque'].map(item => (
                <div className="flex gap-2 mb-2" key={item}>
                  <Checkbox
                    label={item}
                    className="mb-2"
                    checked={filterData.paymentType === item}
                    onChange={e => {
                      if (e.target.checked) {
                        setFilterData(prev => ({
                          ...prev,
                          paymentType: e.target.value,
                        }));
                      } else {
                        setFilterData(prev => ({ ...prev, paymentStatus: '' }));
                      }
                    }}
                    defaultValue={item}
                  />
                </div>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item className="border-solid border-2 rounded-xl mb-2 p-1" value="bookingType">
            <Accordion.Control className="hover:bg-white">Booking Type</Accordion.Control>
            <Accordion.Panel>
              {['Online', 'Offline'].map(item => (
                <div className="flex gap-2 mb-2" key={item}>
                  <Checkbox
                    label={item}
                    className="mb-2"
                    defaultValue={item}
                    checked={filterData.bookingType === item}
                    onChange={e => {
                      if (e.target.checked) {
                        setFilterData(prev => ({
                          ...prev,
                          bookingType: e.target.value,
                        }));
                      } else {
                        setFilterData(prev => ({ ...prev, bookingType: '' }));
                      }
                    }}
                  />
                </div>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="campaignStatus"
          >
            <Accordion.Control className="hover:bg-white">Campaign Status</Accordion.Control>
            <Accordion.Panel>
              {campaignStatus?.docs.map(item => (
                <Checkbox
                  key={item._id}
                  label={item.name}
                  className="mb-2"
                  defaultValue={item._id}
                  checked={filterData.campaignStatus === item._id}
                  onChange={e => {
                    if (e.target.checked) {
                      setFilterData(prev => ({
                        ...prev,
                        campaignStatus: e.target.value,
                      }));
                    } else {
                      setFilterData(prev => ({ ...prev, campaignStatus: '' }));
                    }
                  }}
                />
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="mountingStatus"
          >
            <Accordion.Control className="hover:bg-white">Mounting Status</Accordion.Control>
            <Accordion.Panel>
              {mountingStatus?.docs.map(item => (
                <Checkbox
                  key={item._id}
                  label={item.name}
                  className="mb-2"
                  defaultValue={item._id}
                  checked={filterData.mountingStatus === item._id}
                  onChange={e => {
                    if (e.target.checked) {
                      setFilterData(prev => ({
                        ...prev,
                        mountingStatus: e.target.value,
                      }));
                    } else {
                      setFilterData(prev => ({ ...prev, mountingStatus: '' }));
                    }
                  }}
                />
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="printingStatus"
          >
            <Accordion.Control className="hover:bg-white">Printing Status</Accordion.Control>
            <Accordion.Panel>
              {printingStatus?.docs.map(item => (
                <Checkbox
                  key={item._id}
                  label={item.name}
                  className="mb-2"
                  checked={filterData.printingStatus === item._id}
                  defaultValue={item._id}
                  onChange={e => {
                    if (e.target.checked) {
                      setFilterData(prev => ({
                        ...prev,
                        printingStatus: e.target.value,
                      }));
                    } else {
                      setFilterData(prev => ({ ...prev, printingStatus: '' }));
                    }
                  }}
                />
              ))}
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item
            className="border-solid border-2 rounded-xl mb-2 p-1"
            value="paymentStatus"
          >
            <Accordion.Control className="hover:bg-white">Payment Status</Accordion.Control>
            <Accordion.Panel>
              {paymentStatus?.docs.map(item => (
                <Checkbox
                  key={item._id}
                  label={item.name}
                  className="mb-2"
                  defaultValue={item._id}
                  checked={filterData.paymentStatus === item._id}
                  onChange={e => {
                    if (e.target.checked) {
                      setFilterData(prev => ({
                        ...prev,
                        paymentStatus: e.target.value,
                      }));
                    } else {
                      setFilterData(prev => ({ ...prev, paymentStatus: '' }));
                    }
                  }}
                />
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
