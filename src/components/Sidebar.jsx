import shallow from 'zustand/shallow';
import useSideBarState from '../store/sidebar.store';
import SidebarButton from './Button/SidebarButton';

const sidebarText = [
  'Inventory',
  'Bookings',
  'Proposals',
  'Users',
  'Masters',
  'Campaigns',
  'Reports',
  'Landlords',
];

const Sidebar = () => {
  const { color, setColor } = useSideBarState(
    state => ({
      color: state.color,
      setColor: state.setColor,
    }),
    shallow,
  );

  return (
    <div className="hidden lg:block lg:col-span-2 mt-4">
      <div className="flex flex-col items-start gap-2">
        {sidebarText.map((text, index) => (
          <SidebarButton
            key={text}
            color={color}
            clickHandler={setColor}
            index={index}
            text={text}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
