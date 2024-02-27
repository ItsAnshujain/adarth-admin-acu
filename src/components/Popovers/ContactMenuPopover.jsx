import { Button, Card, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import DeleteCompanyContent from '../modules/company/DeleteCompanyContent';

const ContactMenuPopover = ({ itemId, toggleEdit }) => {
  const modals = useModals();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      modalId: 'deleteContactContent',
      innerProps: {
        modalBody: (
          <DeleteCompanyContent
            bookingId={itemId}
            classNames="px-8 mt-4"
            onClickCancel={() => modals.closeModal('deleteContactContent')}
          />
        ),
      },
      ...modalConfig,
    });

  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Link to={`/repository/contact/${123}`} className="p-0">
          <Menu.Item>View</Menu.Item>
        </Link>
        <Card onClick={() => toggleEdit('Edit')} className="p-0">
          <Menu.Item>Edit</Menu.Item>
        </Card>
        <Card onClick={toggleDeleteModal} className="p-0">
          <Menu.Item>Delete</Menu.Item>
        </Card>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ContactMenuPopover;
