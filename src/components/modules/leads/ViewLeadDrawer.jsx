import { ActionIcon, Divider, Drawer, Tabs } from '@mantine/core';
import { IconX } from '@tabler/icons';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'react-feather';
import { useState } from 'react';
import { useModals } from '@mantine/modals';
import { useClickOutside } from '@mantine/hooks';
import Select from '../../shared/FormInputs/Select';
import ViewLeadStepper from './ViewLeadStepper';
import LeadsOverview from './LeadsOverview';
import LeadFollowUps from './LeadFollowUps';
import LeadMenuPopover from '../../Popovers/LeadMenuPopover';
import AddFollowUpContent from './AddFollowUpContent';
import modalConfig from '../../../utils/modalConfig';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'px-4 pt-4',
    body: 'px-8',
    close: 'mr-4',
  },
  size: 800,
};

const ViewLeadDrawer = ({ isOpened, styles, onClose }) => {
  const modals = useModals();
  const ref = useClickOutside(() => onClose());
  const [searchParams, setSearchParams] = useSearchParams({
    leadDetailTab: 'overview',
  });
  const [activeStep, setActiveStep] = useState('In Progress');
  const leadDetailTab = searchParams.get('leadDetailTab');

  const toggleAddFollowUp = () =>
    modals.openModal({
      title: 'Add Follow Up',
      modalId: 'addFollowUpModal',
      children: <AddFollowUpContent onCancel={() => modals.closeModal('addFollowUpModal')} />,
      ...updatedModalConfig,
    });

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
      <div ref={ref}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold">Lead Details</div>
          <div className="flex items-center gap-2">
            <LeadMenuPopover itemId={123} toggleAddFollowUp={toggleAddFollowUp} />
            <ActionIcon onClick={onClose}>
              <IconX />
            </ActionIcon>
          </div>
        </div>
        <Divider />
        <div className="p-2 px-6">
          <Tabs className="w-full" value={leadDetailTab}>
            <Tabs.List className="border-b">
              <div className="flex justify-between w-full pb-0">
                <div className="flex gap-4 mb-0">
                  <Tabs.Tab
                    value="overview"
                    className={classNames(
                      'p-0 border-0 text-lg pb-2 hover:bg-transparent',
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
                      'p-0 border-0 text-lg pb-2 hover:bg-transparent',
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
            <Tabs.Panel value="overview">
              <ViewLeadStepper activeStep={activeStep.replace(' ', '')} />
              <LeadsOverview />
            </Tabs.Panel>
            <Tabs.Panel value="followUps">
              <LeadFollowUps />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </Drawer>
  );
};

export default ViewLeadDrawer;
