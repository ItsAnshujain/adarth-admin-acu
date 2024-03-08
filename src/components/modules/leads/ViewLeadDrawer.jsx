import { ActionIcon, Divider, Drawer, Stepper, Tabs } from '@mantine/core';
import { Icon123, IconX } from '@tabler/icons';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { useState } from 'react';
import MenuIcon from '../../Menu';
import Select from '../../shared/FormInputs/Select';

const ViewLeadDrawer = ({ isOpened, styles, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    leadDetailTab: 'overview',
  });

  const [active, setActive] = useState(1);

  const leadDetailTab = searchParams.get('leadDetailTab');
  return (
    <Drawer
      className="overflow-auto"
      overlayOpacity={0.1}
      overlayBlur={0}
      size="xl"
      position="right"
      opened={isOpened}
      styles={styles}
      withCloseButton={false}
      classNames={{
        title: 'text-xl font-semibold',
        header: 'px-6 mb-0 z-20 h-16 sticky top-0 bg-white',
        closeButton: 'text-black',
        body: 'p-0',
      }}
      closeOnClickOutside
    >
      {/* View Lead Drawer Header */}
      <div className="flex justify-between p-4">
        <div className="text-xl font-bold">Lead Details</div>
        <div className="flex gap-2">
          <ActionIcon>
            <MenuIcon />
          </ActionIcon>
          <ActionIcon onClick={onClose}>
            <IconX />
          </ActionIcon>
        </div>
      </div>
      <Divider />
      <div className="p-2">
        <Tabs className="w-full" value={leadDetailTab}>
          <Tabs.List className="border-b">
            <div className="flex justify-between w-full pb-0">
              <div className="flex gap-4 mb-0">
                <Tabs.Tab
                  value="overview"
                  className={classNames(
                    'p-0 border-0 text-lg pb-2',
                    leadDetailTab === 'overview'
                      ? 'border border-b-2 border-purple-450 text-purple-450'
                      : '',
                  )}
                  onClick={() => {
                    searchParams.set('leadDetailTab', 'overview');
                    searchParams.set('page', 1);
                    setSearchParams(searchParams, { replace: true });
                  }}
                >
                  Overview
                </Tabs.Tab>
                <Tabs.Tab
                  value="followUps"
                  className={classNames(
                    'p-0 border-0 text-lg pb-2',
                    leadDetailTab === 'followUps'
                      ? 'border border-b-2 border-purple-450 text-purple-450'
                      : '',
                  )}
                  onClick={() => {
                    searchParams.set('leadDetailTab', 'followUps');
                    searchParams.set('page', 1);
                    setSearchParams(searchParams, { replace: true });
                  }}
                >
                  Follow Ups
                </Tabs.Tab>
              </div>
              <div className="mb-2 flex gap-3">
                <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
                  <div>Stage - </div>
                  <Select
                    clearable
                    searchable
                    placeholder="Select..."
                    name="stage"
                    data={[]}
                    withAsterisk
                    classNames={{
                      input: 'border-none',
                    }}
                    rightSection={<ChevronDown size={20} />}
                    className="w-28"
                  />
                </div>
                <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
                  <div>Priority - </div>
                  <Select
                    clearable
                    searchable
                    placeholder="Select..."
                    name="priority"
                    data={[]}
                    withAsterisk
                    classNames={{
                      input: 'border-none',
                    }}
                    rightSection={<ChevronDown size={20} />}
                    className="w-28"
                  />
                </div>
              </div>
            </div>
          </Tabs.List>
        </Tabs>
        <Stepper
          active={active}
          onStepClick={setActive}
          className="py-6 leadStepper"
          classNames={{
            separator: 'hidden',
            steps: 'gap-0',
            stepIcon: 'hidden',
          }}
        >
          <div className="flex w-full">
            <div className="flex w-full">
              <Stepper.Step
                label="Initiate Discussion"
                className="bg-orange-350 w-full p-2 pl-4 text-white stepperItem"
                classNames={{ stepWrapper: 'hidden' }}
              />
              <Stepper.Step
                label="In Progress"
                className="bg-purple-350 w-full p-2 pl-4 text-white stepperItem"
                classNames={{ stepWrapper: 'hidden' }}
              />

              <Stepper.Step
                label="Converted"
                className="bg-gray-200 text-gray-400 w-full p-2 pl-4 stepperItem"
                classNames={{ stepWrapper: 'hidden' }}
              />
            </div>
            <Stepper.Step
              label="Lost"
              className="bg-gray-200 text-gray-400 w-full p-2 pl-4 stepperItem"
              classNames={{ stepWrapper: 'hidden' }}
            />
          </div>
        </Stepper>
      </div>
    </Drawer>
  );
};

export default ViewLeadDrawer;
