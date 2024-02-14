import { ActionIcon, Button, Checkbox, Image, Menu } from '@mantine/core';
import MenuIcon from '../../Menu';

const ImageCard = ({ image }) => (
  <div className="rounded-lg border border-gray-200">
    <Image src={image.link} classNames={{ image: 'rounded-t-lg' }} />
    <div className="p-4 flex justify-between items-center">
      <Checkbox label="image.png" />
      <div className="relative">
        <Menu>
          <Menu.Target>
            <ActionIcon>
              <MenuIcon />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown className="rounded-none -left-20">
            <div className="flex flex-col gap-1">
              <Button
                variant="default"
                className="border-none text-left font-normal"
                classNames={{ inner: 'float-left' }}
              >
                Copy link
              </Button>
              <Button
                variant="default"
                className="border-none text-left font-normal"
                classNames={{ inner: 'float-left' }}
              >
                Delete
              </Button>
            </div>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  </div>
);

export default ImageCard;
