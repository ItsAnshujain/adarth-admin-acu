import { Button, Pagination } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { useModals } from '@mantine/modals';
import ImagesList from '../../components/modules/gallery/ImagesList';
import Header from '../../components/modules/gallery/Header';
import ImagesPerPage from '../../components/modules/gallery/ImagesPerPage';
import ConfirmContent from '../../components/shared/ConfirmContent';
import modalConfig from '../../utils/modalConfig';

const GalleryImagesDashboardPage = () => {
  const modals = useModals();
  const toggleDelete = () => {
    modals.openModal({
      modalId: 'deleteVersionModal',
      title: 'Delete Images',
      children: (
        <ConfirmContent
          onConfirm={() => {}}
          onCancel={() => modals.closeModal('deleteVersionModal')}
          loading={false} // query isLoading
          classNames="px-6"
        />
      ),
      ...modalConfig,
      size: 'md',
    });
  };
  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
      <Header />
      <div className="w-full px-5">
        <div className="flex items-center gap-3 text-sm text-gray-6 font-medium text-gray-500 justify-between w-full">
          <div className="flex items-center gap-3">
            <ImagesPerPage count="10" />
            <Button
              variant="default"
              className="text-purple-450 p-0 border-none"
              onClick={toggleDelete}
            >
              <IconTrash size={24} />
            </Button>
            <Button variant="filled" className="bg-black">
              Copy link
            </Button>
          </div>
          <div className="flex justify-end my-4">
            <Pagination
              styles={theme => ({
                item: {
                  color: theme.colors.gray[5],
                  fontWeight: 700,
                },
              })}
              page={1}
              onChange={() => {}}
              total={10}
            />
          </div>
        </div>
        <ImagesList />
      </div>
    </div>
  );
};

export default GalleryImagesDashboardPage;
