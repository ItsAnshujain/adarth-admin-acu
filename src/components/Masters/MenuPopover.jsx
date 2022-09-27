import { Menu } from '@mantine/core';
import React from 'react';
import { Edit2, Trash } from 'react-feather';
import { useModals } from '@mantine/modals';
import InputModal from './InputModal';
import MenuIcon from '../Menu';
import modalConfig from '../../utils/modalConfig';
import DeleteConfirmContent from '../DeleteConfirmContent';
import { useDeleteMaster } from '../../hooks/masters.hooks';

const MenuPopover = ({ row }) => {
  const [opened, setOpened] = React.useState(false);
  const modals = useModals();
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const { mutate: deleteItem, isLoading, isSuccess } = useDeleteMaster();

  const toggletDeleteModal = () =>
    modals.openContextModal('basic', {
      title: '',
      innerProps: {
        modalBody: (
          <DeleteConfirmContent
            onClickCancel={id => modals.closeModal(id)}
            setIsConfirmed={setIsConfirmed}
          />
        ),
      },
      ...modalConfig,
    });

  const onSubmit = () => {
    deleteItem({ masterId: row?.values?._id });
    if (isSuccess) {
      setIsConfirmed(false);
    }
  };

  // trigger delete func if status is true
  React.useEffect(() => {
    if (isConfirmed) {
      onSubmit();
    }
  }, [isConfirmed]);

  return (
    <>
      <Menu shadow="md" width={150}>
        <Menu.Target>
          <button type="button">
            <MenuIcon />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => setOpened(true)}
            icon={<Edit2 className="h-4" />}
            disabled={isLoading}
          >
            <span className="text-base">Edit</span>
          </Menu.Item>
          <Menu.Item
            icon={<Trash className="h-4" />}
            onClick={() => toggletDeleteModal()}
            disabled={isLoading}
          >
            <span className="text-base">Delete</span>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <InputModal opened={opened} setOpened={setOpened} isEdit masterData={row?.values} />
    </>
  );
};

export default MenuPopover;
