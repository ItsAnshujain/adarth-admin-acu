import { Modal } from '@mantine/core';

const InputModal = ({ opened, setOpened }) => (
  <Modal
    styles={{
      title: {
        fontWeight: 700,
        fontSize: '20px',
      },
    }}
    size="lg"
    title="Add Brand"
    opened={opened}
    withCloseButton={false}
    centered
  >
    <form className="border-t">
      <div className="flex flex-col gap-4 relative py-3 ">
        <p>Category Name</p>
        <input className="w-full border p-2" type="text" placeholder="Brand" />
        <div className="flex gap-2  justify-end">
          <button
            onClick={() => setOpened(false)}
            type="button"
            className="bg-black text-white p-1 rounded-md text-sm"
          >
            Cancel
          </button>
          <button type="button" className="bg-purple-450 text-white p-1 rounded-md text-sm">
            Save
          </button>
        </div>
      </div>
    </form>
  </Modal>
);

export default InputModal;
