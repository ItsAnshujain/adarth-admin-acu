import { useEffect, useState } from 'react';
import { Accordion, Button, Drawer, NumberInput, Radio, RangeSlider } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { serialize } from '../../utils';
import { useFetchMasters } from '../../hooks/masters.hooks';

const styles = { title: { fontWeight: 'bold' } };
const sliderStyle = {
  label: {
    backgroundColor: '#4B0DAF',
  },
  markLabel: {
    display: 'none',
  },
};

const defaultValue = {
  status: '',
  type: '',
  priceMin: 0,
  priceMax: 0,
  healthMin: 0,
  healthMax: 0,
  totalSpacesMin: 0,
  totalSpacesMax: 0,
};

const MinMaxField = ({ state, minKey, maxKey, setState, label }) => (
  <Accordion.Item value="price" className="mb-4 rounded-xl border">
    <Accordion.Control>
      <p className="text-lg">{label}</p>
    </Accordion.Control>
    <Accordion.Panel>
      <div className="mt-2">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex justify-between gap-8">
            <div>
              <NumberInput
                value={state[minKey]}
                onChange={val => setState(p => ({ ...p, [minKey]: val }))}
                label="Min"
              />
            </div>
            <div>
              <NumberInput
                value={state.priceMax}
                onChange={val => setState(p => ({ ...p, [maxKey]: val }))}
                label="Max"
              />
            </div>
          </div>
          <div>
            <RangeSlider
              onChange={val => setState(p => ({ ...p, [minKey]: val[0], [maxKey]: val[1] }))}
              min={0}
              max={10000}
              styles={sliderStyle}
              value={[state[minKey], state[maxKey]]}
              defaultValue={[0, 10000]}
            />
          </div>
        </div>
      </div>
    </Accordion.Panel>
  </Accordion.Item>
);

const CampaignFilter = ({
  isOpened,
  onApply = () => {},
  onReset = () => {},
  onClose = () => {},
}) => {
  const [searchParams] = useSearchParams();

  const [state, setState] = useState(defaultValue);
  const { data: campaignStatus } = useFetchMasters(
    serialize({ type: 'campaign_status', limit: 10 }),
  );

  const { data: campaignTypes } = useFetchMasters(serialize({ type: 'campaign_type', limit: 10 }));

  const handleApply = () => {
    onApply(state);
    onClose();
  };

  const handleReset = () => {
    setState(defaultValue);
    onReset();
  };

  useEffect(() => {
    const obj = {};

    Object.keys(defaultValue).forEach(item => {
      const val = searchParams.get(item);

      if (val !== undefined) {
        if (typeof defaultValue[item] === 'number') {
          obj[item] = Number(val) || 0;
        } else {
          obj[item] = val || '';
        }
      }
    });

    setState(obj);
  }, []);

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
      onClose={onClose}
    >
      <div className="w-full flex justify-end">
        <Button onClick={handleReset} className="border-black text-black radius-md mr-3">
          Reset
        </Button>
        <Button variant="default" className="mb-3 bg-purple-450 text-white" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
      <div className="flex text-gray-400 flex-col gap-4">
        <Accordion>
          <Accordion.Item value="Status" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Status</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {campaignStatus?.docs?.map(item => (
                  <div className="flex gap-2 mb-2" key={item.name}>
                    <Radio
                      onChange={() => setState(p => ({ ...p, status: item.name }))}
                      label={item.name}
                      defaultValue={item}
                      checked={state.status === item.name}
                    />
                  </div>
                ))}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Type" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Type</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {campaignTypes?.docs?.map(item => (
                  <div className="flex gap-2 mb-2" key={item.name}>
                    <Radio
                      onChange={() => setState(p => ({ ...p, status: item.name }))}
                      label={item.name}
                      defaultValue={item}
                      checked={state.status === item.name}
                    />
                  </div>
                ))}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <MinMaxField
            label="Price"
            minKey="priceMin"
            maxKey="priceMax"
            state={state}
            setState={setState}
          />
          <MinMaxField
            label="Health"
            minKey="healthMin"
            maxKey="healthMax"
            state={state}
            setState={setState}
          />
          <MinMaxField
            label="Total Spaces"
            minKey="totalSpacesMin"
            maxKey="totalSpacesMax"
            state={state}
            setState={setState}
          />
        </Accordion>
      </div>
    </Drawer>
  );
};

export default CampaignFilter;
