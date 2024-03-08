import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Checkbox, Drawer } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

const styles = { title: { fontWeight: 'bold' } };

const defaultValue = {
  leadSource: [],
  priority: [],
  companyRepresenting: [],
  leadStage: [],
  addedBy: [],
  clientCompanyType: [],
};

const leadSourceOptions = [];
const priorityOptions = ['High', 'Medium', 'Low'];
const companyRepresentingOptions = [];
const leadStageOptions = [];
const addedByOptions = [];
const clientCompanyTypeOptions = [
  'National Agency',
  'Local Agency',
  'Direct Client',
  'Government',
  'Printer',
  'Mounter',
  'Others',
];

const Filter = ({ isOpened, setShowFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState(defaultValue);
  const leadSource = searchParams.get('leadSource') || [];
  const priority = searchParams.get('priority') || [];
  const companyRepresenting = searchParams.get('companyRepresenting') || [];
  const leadStage = searchParams.get('leadStage') || [];
  const addedBy = searchParams.get('addedBy') || [];
  const clientCompanyType = searchParams.get('clientCompanyType') || [];

  const handleStatusArr = (stat, key) => {
    let tempArr = [...filterOptions[`${key}`]]; // TODO: use immmer
    if (tempArr.some(item => item === stat)) {
      tempArr = tempArr.filter(item => item !== stat);
    } else {
      tempArr.push(stat);
    }
    setFilterOptions({ ...filterOptions, [`${key}`]: [...tempArr] });
  };

  const renderOptions = useCallback(
    (data, filterKey) =>
      data?.map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
            onChange={event => handleStatusArr(event.target.value, filterKey)}
            label={item}
            defaultValue={item}
            checked={filterOptions[filterKey]?.includes(item)}
          />
        </div>
      )),
    [filterOptions],
  );
  const handleNavigationByFilter = () => {
    Object.keys(filterOptions).forEach(item => {
      searchParams.delete(item);
    });

    searchParams.set('page', 1);
    Object.keys(filterOptions).forEach(key => {
      if (filterOptions[`${key}`].length && Array.isArray(filterOptions[`${key}`])) {
        searchParams.append(key, filterOptions[`${key}`].join(','));
      }
    });
    setSearchParams(searchParams);
    setShowFilter(false);
  };

  const handleResetParams = () => {
    Object.keys(defaultValue).forEach(item => {
      searchParams.delete(item);
    });
    setSearchParams(searchParams);
    setFilterOptions(defaultValue);
  };

  useEffect(() => {
    setFilterOptions(prevState => ({
      ...prevState,
      leadSource,
      priority,
      companyRepresenting,
      leadStage,
      addedBy,
      clientCompanyType,
    }));
  }, [searchParams]);

  return (
    <Drawer
      className="overflow-auto"
      overlayOpacity={0.1}
      overlayBlur={0}
      size="sm"
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
          <Accordion.Item value="leadSource" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Lead Source</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderOptions(leadSourceOptions, 'leadSource')}</div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="priority" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Priority</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderOptions(priorityOptions, 'priority')}</div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="companyRepresenting" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Company Representing</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderOptions(companyRepresentingOptions, 'companyRepresenting')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="leadStage" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Lead Stage</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderOptions(leadStageOptions, 'leadStage')}</div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="addedBy" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Added By</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderOptions(addedByOptions, 'addedBy')}</div>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="clientCompanyType" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Client Company Type</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">
                {renderOptions(clientCompanyTypeOptions, 'clientCompanyType')}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
