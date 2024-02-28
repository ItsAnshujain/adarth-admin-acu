import { ActionIcon, Tabs } from '@mantine/core';
import { IconArrowLeft, IconPencil, IconTrash } from '@tabler/icons';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModals } from '@mantine/modals';
import ViewContact from './ViewContact';
import modalConfig from '../../../utils/modalConfig';
import AddContactContent from './AddContactContent';
import DeleteContactContent from './DeleteContactContent';

const updatedModalConfig = {
  ...modalConfig,
  size: '1000px',
  classNames: {
    title: 'font-dmSans text-2xl font-bold px-4',
    header: 'px-4 py-4 border-b border-gray-450',
    body: '',
    close: 'mr-4',
  },
};

const ViewContactHeader = ({ type }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const modals = useModals();
  const toggleDeleteModal = () =>
    modals.openContextModal('basic', {
      modalId: 'deleteTermsAndConditions',
      innerProps: {
        modalBody: (
          <DeleteContactContent
            classNames="px-8 mt-4"
            onClickCancel={() => modals.closeModal('deleteTermsAndConditions')}
          />
        ),
      },
      ...modalConfig,
    });

  const toggleEditContactModal = () => {
    modals.openModal({
      title: 'Edit Contact',
      modalId: 'editContactModal',
      children: (
        <AddContactContent mode="Edit" onCancel={() => modals.closeModal('editContactModal')} />
      ),
      ...updatedModalConfig,
    });
  };

  return (
    <div className="flex justify-between pb-4 pt-2">
      <Tabs className="w-full" value={activeTab}>
        <Tabs.List className="border-b">
          <div className="flex justify-between w-full pb-0">
            <div className="flex gap-4 mb-0">
              <ActionIcon component={Link} to="/repository/contact">
                <IconArrowLeft color="black" />
              </ActionIcon>
              <Tabs.Tab
                value="overview"
                className={classNames(
                  'p-0 border-0 text-lg pb-2',
                  activeTab === 'overview'
                    ? 'border border-b-2 border-purple-450 text-purple-450'
                    : '',
                )}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Tabs.Tab>
            </div>
            <div className="flex">
              <ActionIcon onClick={toggleEditContactModal}>
                <IconPencil color="black" />
              </ActionIcon>
              <ActionIcon onClick={toggleDeleteModal}>
                <IconTrash className="text-purple-450" />
              </ActionIcon>
            </div>
          </div>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <ViewContact type={type} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ViewContactHeader;
