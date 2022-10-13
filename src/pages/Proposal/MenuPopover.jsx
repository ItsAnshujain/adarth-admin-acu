import { Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../../components/DeleteConfirmContent';
import MenuIcon from '../../components/Menu';
import { useDeleteProposal } from '../../hooks/proposal.hooks';

const MenuPopover = ({ itemId }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { mutate: deleteItem, isLoading } = useDeleteProposal();

  const onSubmit = () => {
    deleteItem({ proposalId: itemId });
  };

  const checkConfirmation = isConfirmed => {
    if (isConfirmed) {
      onSubmit();
    }
  };

  const toggletDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteConfirmContent
            onClickCancel={id => modals.closeModal(id)}
            setIsConfirmed={checkConfirmation}
          />
        ),
      },
      ...modalConfig,
    });

  return (
    <Menu shadow="md" width={150}>
      <Menu.Target>
        <button type="button">
          <MenuIcon />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => navigate(`/proposals/view-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
        >
          <span className="ml-1">View</span>
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate(`/proposals/edit-details/${itemId}`)}
          icon={<Edit2 className="h-4" />}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Edit</span>
        </Menu.Item>
        <Menu.Item
          icon={<Trash className="h-4" />}
          onClick={() => toggletDeleteModal()}
          disabled={isLoading}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Delete</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuPopover;
