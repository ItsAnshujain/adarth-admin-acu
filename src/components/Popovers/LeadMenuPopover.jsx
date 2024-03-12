import { Button, Card, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link, useNavigate } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import DeleteLeadContent from '../modules/leads/DeleteLeadContent';

const LeadMenuPopover = ({ itemId, toggleAddFollowUp, toggleViewLead }) => {
  const modals = useModals();
  const navigate = useNavigate();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      modalId: 'deleteLead',
      innerProps: {
        modalBody: (
          <DeleteLeadContent
            id={itemId}
            classNames="px-8 mt-4"
            onClickCancel={() => modals.closeModal('deleteLead')}
            onConfirm={() => navigate('/leads/leads-dashboard')}
          />
        ),
      },
      ...modalConfig,
    });

  return (
    <Menu shadow="md" width={140}>
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {toggleViewLead ? (
          <Card onClick={toggleViewLead} className="p-0">
            <Menu.Item>View</Menu.Item>
          </Card>
        ) : null}
        <Card onClick={toggleAddFollowUp} className="p-0">
          <Menu.Item>Add Follow Up</Menu.Item>
        </Card>
        <Link to={`/leads/add-lead?id=${itemId}`} className="p-0">
          <Menu.Item>Edit</Menu.Item>
        </Link>
        <Card onClick={toggleDeleteModal} className="p-0">
          <Menu.Item>Delete</Menu.Item>
        </Card>
      </Menu.Dropdown>
    </Menu>
  );
};

export default LeadMenuPopover;