/* eslint-disable */
import { useState } from 'react';
import Badge from '../../shared/Badge';
import MenuIcon from '../../Menu';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '@mantine/hooks';
import { Edit2, Trash, Eye } from 'react-feather';
import { Image } from '@mantine/core';
import toIndianCurrency from '../../../utils/currencyFormat';
import { useDeleteInventoryById } from '../../../hooks/inventory.hooks';

const COLUMNS = [
  {
    Header: '#',
    accessor: '_id',
    Cell: ({ row: { index } }) => index + 1,
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const navigate = useNavigate();
      const { spaceStatus, spacePhotos, name, _id } = tableProps.row.original;
      const color =
        spaceStatus === 'Available'
          ? 'green'
          : spaceStatus === 'Unavailable'
          ? 'orange'
          : 'primary';
      return (
        <div
          onClick={() => navigate(`/inventory/view-details/${_id}`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-white border ">
            <Image
              withPlaceholder
              src={spacePhotos}
              width={30}
              height={30}
              className="rounded-md"
            />
          </div>
          <p className="flex-1">{name}</p>
          <div className="flex-1">
            <Badge radius="xl" text={spaceStatus} color={color} variant="filled" size="sm" />
          </div>
        </div>
      );
    },
  },
  {
    Header: 'SPACE TYPE',
    accessor: 'spaceType',
  },
  {
    Header: 'LANDLORD NAME',
    accessor: 'landlord_name',
    Cell: ({
      row: {
        original: { landlord },
      },
    }) => landlord,
  },
  {
    Header: 'IMPRESSION',
    accessor: 'impression',
    Cell: ({
      row: {
        original: { impression },
      },
    }) => impression?.min || 0,
  },
  {
    Header: 'MEDIA TYPE',
    accessor: 'mediaType',
  },
  {
    Header: 'PRICING',
    accessor: 'price',
    Cell: ({
      row: {
        original: { price = 0 },
      },
    }) => toIndianCurrency(price),
  },
  {
    Header: '',
    accessor: 'details',
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const ref = useClickOutside(() => setShowMenu(false));
      const navigate = useNavigate();
      const { _id } = tableProps.row.original;

      const { mutate, isLoading } = useDeleteInventoryById();
      return (
        <div ref={ref} onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`/inventory/view-details/${_id}`)}
                  className="bg-white cursor-pointer flex items-center"
                >
                  <Eye className="h-4 mr-2" />
                  <span>View Details</span>
                </div>
                <div
                  onClick={() => navigate(`/inventory/edit-details/${_id}`)}
                  className="bg-white cursor-pointer flex items-center"
                >
                  <Edit2 className="h-4 mr-2" />
                  <span>Edit</span>
                </div>
                <div
                  className="bg-white cursor-pointer flex items-center"
                  onClick={() => {
                    if (!isLoading) mutate({ inventoryId: _id });
                  }}
                >
                  <Trash className="h-4 mr-2" />
                  <span>Delete</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;
