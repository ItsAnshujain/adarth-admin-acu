import { useNavigate } from 'react-router-dom';
import { Badge, Button, Image, Menu, Text } from '@mantine/core';
import { Eye, Edit2, Trash } from 'react-feather';
import { useModals } from '@mantine/modals';
import toIndianCurrency from '../../utils/currencyFormat';
import MenuIcon from '../Menu';
import DeleteConfirmContent from '../DeleteConfirmContent';
import modalConfig from '../../utils/modalConfig';

const Card = ({ data }) => {
  const modals = useModals();
  const navigate = useNavigate();

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('hello');
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
    <div className="drop-shadow-md">
      <div className="min-w-[273px]">
        {data?.basicInformation?.spacePhotos ? (
          <Image
            className="w-full"
            height={176}
            src={data?.basicInformation?.spacePhotos}
            alt="card"
            withPlaceholder
            placeholder={
              <Text align="center">Unexpected error occured. Image cannot be loaded</Text>
            }
          />
        ) : (
          <Image height={176} src={null} alt="card" fit="contain" withPlaceholder />
        )}
      </div>
      <div className="p-4 px-4 bg-white">
        <div className="mb-2">
          <Badge className="capitalize" variant="filled" color="green" size="lg">
            Available
          </Badge>
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
              <Button className="px-0">
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
                onClick={toggleDeleteModal}
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
