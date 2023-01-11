import { Button, Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import { useQueryClient } from '@tanstack/react-query';
import MenuIcon from '../../Menu';
import modalConfig from '../../../utils/modalConfig';
import DeleteConfirmContent from '../../DeleteConfirmContent';
import { useUpdateProposal } from '../../../hooks/proposal.hooks';

const MenuPopover = ({ itemId, spacesData }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { mutate: deleteItem, isLoading } = useUpdateProposal();
  const { id: proposalId } = useParams();
  const queryClient = useQueryClient();

  const onSubmit = () => {
    const data = {};
    data.spaces = spacesData
      ?.filter(item => item._id !== itemId)
      .map(item => ({
        id: item._id,
        price: +item.price,
        startDate: item.startDate,
        endDate: item.endDate,
      }));

    deleteItem(
      { proposalId, data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['proposals-by-id']);
          setTimeout(() => modals.closeModal(), 2000);
        },
      },
    );
  };

  const checkConfirmation = isConfirmed => {
    if (isConfirmed) {
      onSubmit();
    }
  };

  const toggleDeleteModal = () =>
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
        <Button className="py-0" onClick={e => e.stopPropagation()}>
          <MenuIcon />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => navigate(`/inventory/view-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
        >
          <span className="ml-1">View</span>
        </Menu.Item>
        <Menu.Item
          onClick={() => navigate(`/inventory/edit-details/${itemId}`)}
          icon={<Edit2 className="h-4" />}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Edit</span>
        </Menu.Item>
        <Menu.Item
          icon={<Trash className="h-4" />}
          onClick={toggleDeleteModal}
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
