import { useState } from 'react';
import SidebarButton from './Button/SidebarButton';

const sidebarText = [
  'Inventory',
  'Bookings',
  'Proposals',
  'Users',
  'Masters',
  'Campaigns',
  'Reports',
  'Finance',
  'Landlords',
];
const initialValues = new Array(9).fill(false);
const Sidebar = () => {
  const [color, setColor] = useState(initialValues);
  const clickHandler = index => {
    setColor(prevColor => {
      const newColor = [...prevColor];
      newColor.fill(false);
      newColor[index] = true;
      return newColor;
    });
  };

  return (
    <div className="h-screen col-span-2 mt-4">
      <div className="flex flex-col items-start gap-2">
        {sidebarText.map((text, index) => (
          <SidebarButton
            key={text}
            color={color}
            clickHandler={clickHandler}
            index={index}
            text={text}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
