import { useNavigate } from 'react-router-dom';
import { Modal, Text, Button } from '@mantine/core';
import check from '../../assets/check.svg';

const SuccessModal = ({ open, setOpenSuccessModal, id }) => {
  const navigate = useNavigate();
  return (
    <Modal opened={open} centered onClose={() => setOpenSuccessModal(false)} /* ...other props */>
      <div className="flex flex-col  justify-center gap-4 text-center">
        <img className="mx-auto" width="40px" height="40px" src={check} alt="check" />
        <Text size="lg" weight="bold">
          Inventory Successfully Added
        </Text>
        <Text className="text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ipsa soluta dolor! Unde.
        </Text>
        <Button
          className="bg-purple-450 text-white mb-2"
          type="button"
          onClick={() => navigate(`/inventory/view-details/${id}`)}
        >
          Go to Inventory
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
