import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Image, Menu, Text } from '@mantine/core';
import { Eye, Edit2, Trash } from 'react-feather';
import { useModals } from '@mantine/modals';
import unsplash from '../../assets/unsplash.png';
import Badge from '../shared/Badge';
import toIndianCurrency from '../../utils/currencyFormat';
import MenuIcon from '../Menu';
import DeleteConfirmContent from '../DeleteConfirmContent';
import modalConfig from '../../utils/modalConfig';

const Card = ({ data }) => {
  const modals = useModals();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit = () => {};

  // trigger delete func if status is true
  useEffect(() => {
    if (isConfirmed) {
      onSubmit();
    }
  }, [isConfirmed]);

  return (
    <div className="drop-shadow-md">
      <div className="w-full">
        <Image className="w-full" src={unsplash} alt="card" />
      </div>
      <div className="p-4 pt-4 pb-7 bg-white">
        <div className="mb-2">
          <Badge radius="md" color="green" variant="filled" text={data?.status} size="md" />
        </div>
        <Text size="md" weight="bold">
          {data?.basicInformation?.spaceName}
        </Text>
        <Text size="sm" className="mt-2" weight="200">
          {data?.location?.address}
        </Text>
        <div className="grid grid-cols-2 justify-between">
          <div className="mt-2">
            <p className="text-sm text-gray-400">Category</p>
            <p className="text-sm mt-1">{data?.category}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400">Impressions</p>
            <p className="text-sm mt-1">{data?.specifications?.impressions?.max}+</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text size="lg" className="mt-4 font-bold" color="purple">
            {data?.basicInformation?.price ? toIndianCurrency(data.basicInformation.price) : 'NA'}
          </Text>
          <Menu shadow="md" width={180} className="mt-4" position="bottom-end">
            <Menu.Target>
              <Button>
                <MenuIcon />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => navigate(`view-details/${data?._id}`)}
                className="cursor-pointer flex items-center gap-1"
                icon={<Eye className="h-4" />}
              >
                <span className="ml-1">View Details</span>
              </Menu.Item>
              <Menu.Item
                onClick={() => navigate(`edit-details/${data?._id}`)}
                className="cursor-pointer flex items-center gap-1"
                icon={<Edit2 className="h-4" />}
              >
                <span className="ml-1">Edit</span>
              </Menu.Item>
              <Menu.Item
                className="cursor-pointer flex items-center gap-1"
                icon={<Trash className="h-4" />}
                onClick={toggletDeleteModal}
              >
                <span className="ml-1">Delete</span>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Card;
