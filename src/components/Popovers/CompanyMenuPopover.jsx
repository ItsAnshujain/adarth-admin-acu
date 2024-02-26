import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import modalConfig from '../../utils/modalConfig';
import MenuIcon from '../Menu';
import useBookingStore from '../../store/booking.store';
import ConfirmContent from '../shared/ConfirmContent';

const CompanyMenuPopover = ({ itemId }) => {
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
          <Menu.Item>View</Menu.Item>
        </Link>
        <Link to={`/bookings/edit-details/${itemId}`} onClick={() => setBookingData([])}>
          <Menu.Item>Edit</Menu.Item>
        </Link>
        <Link to={`/bookings/edit-details/${itemId}`} onClick={() => toggleDeleteModal()}>
          <Menu.Item>Delete</Menu.Item>
        </Link>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CompanyMenuPopover;
