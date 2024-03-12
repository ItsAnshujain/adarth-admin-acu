import { Button, Stepper } from '@mantine/core';
import { useModals } from '@mantine/modals';
import LeadHistoryCard from './LeadHistoryCard';
import AddFollowUpContent from './AddFollowUpContent';
import modalConfig from '../../../utils/modalConfig';

const updatedModalConfig = {
  ...modalConfig,
  classNames: {
    title: 'font-dmSans text-xl px-4',
    header: 'p-4 border-b border-gray-450',
    body: 'px-8',
    close: 'mr-4',
  },
  size: 800,
};

const LeadFollowUps = () => {
  const modals = useModals();

  const toggleAddFollowUp = () =>
    modals.openModal({
      title: 'Add Follow Up',
      modalId: 'addFollowUpModal',
      children: <AddFollowUpContent onCancel={() => modals.closeModal('addFollowUpModal')} />,
      ...updatedModalConfig,
    });
  return (
    <div>
      <div className="flex justify-between py-6">
        <div className="text-xl">Follow Ups History</div>
        <Button className="bg-purple-450" onClick={toggleAddFollowUp}>
          Add Follow Up
        </Button>
      </div>
      <Stepper orientation="vertical" classNames={{ stepIcon: 'bg-transparent p-1' }} iconSize={64}>
        <Stepper.Step
          label={<LeadHistoryCard />}
          icon={<div className="text-purple-450 text-sm text-center">17 Oct 2023</div>}
        />
        <Stepper.Step
          label={<LeadHistoryCard />}
          icon={<div className="text-purple-450 text-sm text-center">17 Oct 2023</div>}
        />
        <Stepper.Step
          label={<LeadHistoryCard />}
          icon={<div className="text-purple-450 text-sm text-center">17 Oct 2023</div>}
        />
      </Stepper>
    </div>
  );
};

export default LeadFollowUps;
