/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Eye, Edit2, Trash } from 'react-feather';
import { NativeSelect } from '@mantine/core';
import MenuIcon from '../../Menu';
import { useClickOutside } from '@mantine/hooks';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
  },
  {
    Header: 'CLIENT',
    accessor: 'client',
  },
  {
    Header: 'ORDER DATE',
    accessor: 'order_date',
  },

  {
    Header: 'CAMPAIGN NAME',
    accessor: 'campaign_name',
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { photo, campaign_name, id },
        },
      } = tableProps;

      return (
        <div
          onClick={() => navigate(`view-details/${id}`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-white border rounded-md">
            <img className="h-6 w-6 mx-auto" src={photo} alt="banner" />
          </div>
          <p className="flex-1">{campaign_name}</p>
        </div>
      );
    },
  },
  {
    Header: 'ORDER TYPE',
    accessor: 'booking_type',
  },
  {
    Header: 'CAMPAIGN STATUS',
    accessor: 'campaign_status',
    Cell: tableProps => {
      const {
        row: {
          original: { campaign_status },
        },
      } = tableProps;

      const [value, setValue] = useState(campaign_status);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Completed', 'Upcoming', 'Ongoing']}
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
    Header: 'PAYMENT STATUS',
    accessor: 'payment_status',
    Cell: tableProps => {
      const {
        row: {
          original: { payment_status },
        },
      } = tableProps;

      const [value, setValue] = useState(payment_status);

      return (
        <NativeSelect
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Paid', 'Due']}
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
    Header: 'PRINTING STATUS',
    accessor: 'printing_status',
    Cell: tableProps => {
      const {
        row: {
          original: { printing_status },
        },
      } = tableProps;

      const [value, setValue] = useState(printing_status);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Completed', 'Pending']}
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
    Header: 'MOUNTING STATUS',
    accessor: 'mounting_status',
    Cell: tableProps => {
      const {
        row: {
          original: { mounting_status },
        },
      } = tableProps;

      const [value, setValue] = useState(mounting_status);

      return (
        <NativeSelect
          className="mr-2"
          value={value}
          onChange={e => setValue(e.target.value)}
          data={['Completed', 'Pending']}
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
    Header: 'CAMPAIGN INCHARGE',
    accessor: 'campaign_incharge',
  },

  {
    Header: 'PAYMENT TYPE',
    accessor: 'payment_type',
  },
  {
    Header: 'SCHEDULE',
    accessor: 'schedule',
    Cell: tableProps => {
      const {
        row: {
          original: { from_date, to_date },
        },
      } = tableProps;
      return (
        <div className="flex items-center text-xs w-max">
          <span className="py-1 px-1 bg-slate-200 mr-2 rounded-md">{from_date}</span>
          &gt;
          <span className="py-1 px-1 bg-slate-200 mx-2 rounded-md">{to_date}</span>
        </div>
      );
    },
  },
  {
    Header: 'TOTAL SPACES',
    accessor: 'total_spaces',
  },
  {
    Header: 'PRICING',
    accessor: 'pricing',
  },
  {
    Header: 'PURCHASE ORDER',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: 'RELEASE ORDER',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: 'INVOICE',
    accessor: '',
    Cell: () => <div className="text-purple-450 cursor-pointer">Download</div>,
  },
  {
    Header: '',
    accessor: 'details',
    Cell: tableProps => {
      const [showMenu, setShowMenu] = useState(false);
      const ref = useClickOutside(() => setShowMenu(false));
      const navigate = useNavigate();
      const { id } = tableProps.row.original;
      return (
        <div ref={ref} onClick={() => setShowMenu(!showMenu)}>
          <div className="relative mx-2">
            <MenuIcon />
            {showMenu && (
              <div className="absolute w-36 shadow-lg text-sm gap-2 flex flex-col border z-10  items-start right-4 top-0 bg-white py-4 px-2">
                <div
                  onClick={() => navigate(`/bookings/view-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  <Eye className="mr-1 text-gray-400 inline h-5" />
                  <span>View Details</span>
                </div>
                <div
                  onClick={() => navigate(`edit-details/${id}`)}
                  className="bg-white cursor-pointer"
                >
                  <Edit2 className="mr-1 text-gray-400 inline h-5" />
                  <span>Edit</span>
                </div>
                <div className="bg-white cursor-pointer">
                  <Trash className="mr-1 text-gray-400 inline h-5" />
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
