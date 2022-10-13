import { useModals } from '@mantine/modals';
import { Menu } from '@mantine/core';
import { Eye, Trash } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../DeleteConfirmContent';
import MenuIcon from '../Menu';
import { useUpdateProposal } from '../../hooks/proposal.hooks';

const MenuPopover = ({ itemId, proposalData }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { id: proposalId } = useParams();
  const queryClient = useQueryClient();

  const { mutate: update, isLoading: isUpdateProposalLoading } = useUpdateProposal();

  const onSubmit = () => {
    const spaces = [];
    if (proposalData?.spaces) {
      proposalData?.spaces.map(item => {
        let element;
        if (item._id !== itemId) {
          element = {
            id: item._id,
            price: item.price,
          };
          spaces.push(element);
        }
        return spaces;
      });
    }

    const data = { ...proposalData, spaces };
    if (proposalId) {
      update({ proposalId, data });
    }

    setTimeout(() => modals.closeModal(), 2000);
  };

  const checkConfirmation = isConfirmed => {
    if (isConfirmed) {
      onSubmit();
    }
    queryClient.invalidateQueries(['proposals-by-id', proposalId]);
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
    <Menu shadow="md" width={180}>
      <Menu.Target>
        <button type="button">
          <MenuIcon />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => navigate(`/inventory/view-details/${itemId}`)}
          className="cursor-pointer flex items-center gap-1"
          icon={<Eye className="h-4" />}
        >
          <span className="ml-1">View Details</span>
        </Menu.Item>
        <Menu.Item
          icon={<Trash className="h-4" />}
          onClick={() => toggletDeleteModal()}
          disabled={isUpdateProposalLoading}
          className="cursor-pointer flex items-center gap-1"
        >
          <span className="ml-1">Remove</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuPopover;
