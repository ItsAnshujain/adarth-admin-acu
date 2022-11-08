import { useNavigate } from 'react-router-dom';
import { Badge, Box, Button, Checkbox, Image, Menu, Text } from '@mantine/core';
import { Eye, Edit2, Trash } from 'react-feather';
import { useModals } from '@mantine/modals';
import toIndianCurrency from '../../utils/currencyFormat';
import MenuIcon from '../Menu';
import DeleteConfirmContent from '../DeleteConfirmContent';
import modalConfig from '../../utils/modalConfig';
import { useDeleteInventoryById } from '../../hooks/inventory.hooks';

const Card = ({ data, isSelected = false, onSelect = () => {} }) => {
  const modals = useModals();
  const navigate = useNavigate();
  const { mutate: deleteInventory, isLoading } = useDeleteInventoryById();

  const onSubmit = () => {
    deleteInventory({ inventoryId: data?._id });
    setTimeout(() => modals.closeAll(), 2000);
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
    <Box className="drop-shadow-md w-[273px] cursor-pointer">
      <div>
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
        <div className="flex justify-between items-center mb-2 ">
          <Badge
            className="capitalize"
            variant="filled"
            size="lg"
            color={data?.isUnderMaintenance ? 'yellow' : 'green'}
          >
            {data?.isUnderMaintenance ? 'Under Maintenance' : 'Available'}
          </Badge>
          <Checkbox
            onChange={event => onSelect(event.target.value)}
            label="Select"
            classNames={{ root: 'flex flex-row-reverse', label: 'pr-2' }}
            defaultValue={data?._id}
            checked={isSelected}
          />
        </div>
        <Text size="md" weight="bold" lineClamp={1} className="w-full">
          {data?.basicInformation?.spaceName}
        </Text>
        <Text size="sm" className="mt-2" weight="200" lineClamp={1}>
          {data?.location?.address}
        </Text>
        <div className="grid grid-cols-2 justify-between">
          <div className="mt-2">
            <p className="text-sm text-gray-400">Category</p>
            <Text className="text-sm mt-1" lineClamp={1}>
              {data?.basicInformation?.category?.name}
            </Text>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400">Impressions</p>
            <p className="text-sm mt-1">{data?.specifications?.impressions?.min}+</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text size="lg" className="mt-4 font-bold" color="purple">
            {data?.basicInformation?.price ? toIndianCurrency(data.basicInformation.price) : 'NA'}
          </Text>
          <Menu shadow="md" width={180} className="mt-4" position="top-end">
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
                disabled={isLoading}
              >
                <span className="ml-1">View Details</span>
              </Menu.Item>
              <Menu.Item
                onClick={() => navigate(`edit-details/${data?._id}`)}
                className="cursor-pointer flex items-center gap-1"
                icon={<Edit2 className="h-4" />}
                disabled={isLoading}
              >
                <span className="ml-1">Edit</span>
              </Menu.Item>
              <Menu.Item
                className="cursor-pointer flex items-center gap-1"
                icon={<Trash className="h-4" />}
                onClick={toggleDeleteModal}
                disabled={isLoading}
              >
                <span className="ml-1">Delete</span>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </Box>
  );
};

export default Card;
