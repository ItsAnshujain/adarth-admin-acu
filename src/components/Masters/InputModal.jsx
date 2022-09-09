import { Modal } from '@mantine/core';
import { useLocation } from 'react-router-dom';

const InputModal = ({ opened, setOpened, isEdit = false }) => {
  const { pathname } = useLocation();

  return (
    <Modal
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '20px',
        },
      }}
      size="lg"
      title={`${isEdit ? 'Edit' : 'Add'} ${pathname.includes('brand') ? 'Brand' : 'Category'}`}
      opened={opened}
      withCloseButton={false}
      centered
    >
      <form className="border-t">
        <div className="flex flex-col gap-4 relative py-3 ">
          <p>{pathname.includes('brand') ? 'Brand' : 'Category'} Name</p>

          <input
            className="w-full border p-2 focus:outline-none py-3"
            type="text"
            placeholder="Write"
          />
          <div className="flex gap-2  justify-end">
            <button
              onClick={() => setOpened(false)}
              type="button"
              className="bg-black text-white  rounded-md text-sm p-2"
            >
              Cancel
            </button>
            <button type="button" className="bg-purple-450 text-white rounded-md text-sm p-2">
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default InputModal;
