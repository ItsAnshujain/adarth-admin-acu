import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { Mail } from 'react-feather';
import unsplash from '../../assets/unsplash.png';
import Badge from '../shared/Badge';
import toIndianCurrency from '../../utils/currencyFormat';
import useOutsideClick from '../../hooks/useOutsideClick';
import MenuIcon from '../Menu';

const Card = ({
  data: { title, category, impression, cost, status, subtitle },
  handleCheckbox,
  checkbox,
  id,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useOutsideClick(setShowMenu);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col drop-shadow-md bg-white">
      <div className="flex-1 w-full">
        <img className="w-full" src={unsplash} alt="card" />
      </div>
      <div className="flex-1 p-4 pt-4 pb-7">
        <div className="flex justify-between mb-2">
          <Badge radius="md" color="green" variant="filled" text={status} size="md" />
          <div className="flex gap-1 items-center">
            <span>Select</span>
            <input checked={checkbox} onChange={() => handleCheckbox()} type="checkbox" />
          </div>
        </div>
        <Text size="md" weight="bold">
          {title}
        </Text>
        <Text size="sm" className="mt-2" weight="200">
          {subtitle}
        </Text>
        <div className="grid grid-cols-2 justify-between">
          <div className="mt-2">
            <p className="text-sm text-gray-400" weight="200">
              Category
            </p>
            <p className="text-sm mt-1">{category}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-400" weight="200">
              Impressions
            </p>
            <p className="text-sm mt-1">{impression}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text size="lg" className="mt-4" color="purple">
            {toIndianCurrency(cost)}
          </Text>
          <div ref={menuRef} className="mt-4">
            <div aria-hidden onClick={() => setShowMenu(!showMenu)}>
              <MenuIcon />
              {showMenu && (
                <div className="absolute top-[70%] right-7 w-36 shadow-lg text-sm gap-2 flex flex-col border overflow-visible  items-start  bg-white py-4 px-2">
                  <div
                    aria-hidden
                    onClick={() => navigate(`view-details/${id}`)}
                    className="bg-white cursor-pointer flex items-center gap-1"
                  >
                    <Mail className="h-4" />
                    <span className="ml-1">View Details</span>
                  </div>
                  <div
                    aria-hidden
                    onClick={() => navigate(`edit-details/${id}`)}
                    className="bg-white cursor-pointer flex items-center gap-1"
                  >
                    <Mail className="h-4" />
                    <span className="ml-1">Edit</span>
                  </div>
                  <div className="bg-white cursor-pointer flex items-center gap-1">
                    <Mail className="h-4" />
                    <span className="ml-1">Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
