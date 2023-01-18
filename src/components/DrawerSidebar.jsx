import { Drawer } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import useSideBarState from '../store/sidebar.store';
import SidebarButton from './Button/SidebarButton';

const sidebarText = [
  'Home',
  'Inventory',
  'Bookings',
  'Proposals',
  'Users',
  'Masters',
  'Campaigns',
  'Reports',
  'Finance',
];

const DrawerSidebar = ({ opened, setOpened }) => {
  const { color, setColor } = useSideBarState(state => ({
    color: state.color,
    setColor: state.setColor,
  }));

  return (
    <Drawer
      className="hidden sm:inline-block"
      opened={opened}
      onClose={() => setOpened(false)}
      padding="xl"
      size="md"
    >
      <div className="">
        <div className="flex flex-col items-start gap-2">
          {sidebarText.map((text, index) => (
            <SidebarButton
              key={uuidv4()}
              color={color}
              clickHandler={setColor}
              index={index}
              text={text}
              setOpened={setOpened}
            />
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerSidebar;
