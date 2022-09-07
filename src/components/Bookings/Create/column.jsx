import shallow from 'zustand/shallow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NativeSelect } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import classNames from 'classnames';
import Badge from '../../shared/Badge';
import MenuIcon from '../../Menu';
import useCreateBookingSelectSpaceState from '../../../store/createBookingSelectSpace.store';
import upload from '../../../assets/upload.svg';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'SPACE NAME & PHOTO',
    accessor: 'space_name_and_photo',
    Cell: tableProps => {
      const navigate = useNavigate();

      const {
        row: {
          original: { status, photo, space_name, id },
        },
      } = tableProps;

      const color =
        status === 'Available' ? 'green' : status === 'Unavailable' ? 'orange' : 'primary';

      return (
        <div
          aria-hidden
          onClick={() => navigate(`view-details/${id}`)}
          className="grid grid-cols-2 gap-2 items-center cursor-pointer"
        >
          <div className="flex flex-1 gap-2 items-center w-44">
            <div className="bg-white h-8 w-8 border rounded-md">
              <img className="h-8 w-8 mx-auto" src={photo} alt="banner" />
            </div>
            <p>{space_name}</p>
          </div>
          <div className="w-fit">
            <Badge radius="xl" text={status} color={color} variant="filled" size="sm" />
          </div>
        </div>
      );
    },
  },
  {
    Header: 'LANDLORD NAME',
    accessor: 'landlord_name',
    Cell: tableProps => {
      const {
        row: {
          original: { landlord_name },
        },
      } = tableProps;
      return <div className="w-fit">{landlord_name}</div>;
    },
  },
  {
    Header: 'UPLOAD MEDIA',
    accessor: '',
    Cell: tableProps => {
      const {
        row: {
          original: { id },
        },
      } = tableProps;

      const selectedSpace = useCreateBookingSelectSpaceState(state => state.selectedSpace, shallow);

      return selectedSpace.length > 0 ? (
        selectedSpace.map(selected => {
          if (selected.original.id === id) {
            return (
              <button
                type="button"
                className="py-1 px-2 h-[70%] flex items-center gap-2 bg-purple-350 text-white rounded-md cursor-pointer"
              >
                <span>Upload</span>
                <img src={upload} alt="Upload" />
              </button>
            );
          }
          return null;
        })
      ) : (
        <button
          type="button"
          className="py-1 px-2 h-[70%] flex items-center gap-2 bg-purple-200 text-white rounded-md cursor-not-allowed "
        >
          <span>Upload</span>
          <img src={upload} alt="Upload" />
        </button>
      );
    },
  },
  {
    Header: 'SPACE TYPE',
    accessor: 'space_type',
  },
  {
    Header: 'DIMENSION',
    accessor: 'dimension',
  },
  {
    Header: 'IMPRESSION',
    accessor: 'impression',
  },
  {
    Header: 'HEALTH',
    accessor: 'health',
  },
  {
    Header: 'LOCATION',
    accessor: 'location',
  },
  {
    Header: 'MEDIA TYPE',
    accessor: 'media_type',
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
    Cell: tableProps => {
      const {
        row: {
          original: { pricing },
        },
      } = tableProps;

      const [value, setValue] = useState(pricing);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['2000', '4000', '80000', '100000']}
          styles={{
            rightSection: { pointerEvents: 'none' },
          }}
          rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
          rightSectionWidth={40}
        />
      );
    },
  },
  {
    Header: 'ACTION',
    accessor: 'details',
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;
      return (
        <div aria-hidden onClick={() => setShowMenu(!showMenu)}>
          <div className="relative">
            <MenuIcon />
            {/* {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div onClick={() => navigate(`/inventory/view-details/${id}`)} className="bg-white">
                  View Details
                </div>
                <div className="bg-white">Edit</div>
                <div className="bg-white">Delete</div>
              </div>
            )} */}
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;
