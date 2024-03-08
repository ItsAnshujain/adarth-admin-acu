import { Button, Card, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link, useNavigate } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import DeleteCompanyContent from '../modules/company/DeleteCompanyContent';

const LeadMenuPopover = ({ itemId, toggleAddFollowUp, toggleViewLead, tab, type }) => {
  const modals = useModals();
  const navigate = useNavigate();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      modalId: 'deleteCompany',
      innerProps: {
        modalBody: (
          <DeleteCompanyContent
            id={itemId}
            classNames="px-8 mt-4"
            onClickCancel={() => modals.closeModal('deleteCompany')}
            onConfirm={() => navigate(`/repository/${type}?tab=${tab}`)}
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
        <Card onClick={toggleViewLead} className="p-0">
          <Menu.Item>View</Menu.Item>
        </Card>
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
