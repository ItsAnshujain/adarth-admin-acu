import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import { Edit2, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import RoleBased from '../RoleBased';
import { ROLES } from '../../utils';
import useBookingStore from '../../store/booking.store';
import ConfirmContent from '../shared/ConfirmContent';

const TermsAndConditionsMenuPopover = ({ itemId }) => {
  const modals = useModals();

  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      title: 'Delete Terms and Conditions',
      modalId: 'deleteTermsAndConditions',
      innerProps: {
        modalBody: (
          <ConfirmContent
            onCancel={() => modals.closeModal('deleteTermsAndConditions')}
            bookingId={itemId}
            classNames="px-8 mt-4"
          />
        ),
      },
      ...modalConfig,
    });

  const setBookingData = useBookingStore(state => state.setBookingData);

  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <Button>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Link to={`/bookings/edit-details/${itemId}`} onClick={() => setBookingData([])}>
          <Menu.Item icon={<Edit2 className="h-4" />}>Edit</Menu.Item>
        </Link>
        <RoleBased acceptedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.MANAGEMENT]}>
          <Menu.Item icon={<Trash className="h-4" />} onClick={toggleDeleteModal}>
            Delete
          </Menu.Item>
        </RoleBased>
      </Menu.Dropdown>
    </Menu>
  );
};

export default TermsAndConditionsMenuPopover;
