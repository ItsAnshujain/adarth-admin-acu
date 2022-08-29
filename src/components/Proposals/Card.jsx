import { useClickOutside } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash } from 'react-feather';
import toIndianCurrency from '../../utils/currencyFormat';
import MenuIcon from '../Menu';

const Card = ({ id }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useClickOutside(setShowMenu);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col px-4 py-8 shadow-md gap-4 max-w-72 bg-white">
      <p className="font-bold">Amazon Christmas Marketing Special</p>
      <p className="text-purple-450 text-sm">Shared with client</p>
      <div className="flex justify-between">
        <div>
          <p className="text-slate-400 text-sm">Client</p>
          <p>Amazon</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total Places</p>
          <p>251</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-purple-450 font-bold">{toIndianCurrency(32687)}</p>
        <div ref={menuRef} className="mt-4 relative">
          <div aria-hidden onClick={() => setShowMenu(!showMenu)}>
            <MenuIcon />
            {showMenu && (
              <div className="absolute top-[50%] right-4 w-36 shadow-lg text-sm gap-2 flex flex-col border overflow-visible  items-start  bg-white py-4 px-2">
                <div
                  aria-hidden
                  onClick={() => navigate(`view-details/${id}`)}
                  className="bg-white cursor-pointer flex items-center gap-1"
                >
                  <Eye className="h-4" />
                  <span className="ml-1">View Details</span>
                </div>
                <div
                  aria-hidden
                  onClick={() => navigate(`edit-details/${id}`)}
                  className="bg-white cursor-pointer flex items-center gap-1"
                >
                  <Edit2 className="h-4" />
                  <span className="ml-1">Edit</span>
                </div>
                <div className="bg-white cursor-pointer flex items-center gap-1">
                  <Trash className="h-4" />
                  <span className="ml-1">Delete</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
