import { useNavigate } from 'react-router-dom';
import { Share2, Mail, Link } from 'react-feather';
import { Menu } from '@mantine/core';
import MenuIcon from '../../Menu';
import toIndianCurrency from '../../../utils/currencyFormat';
import whatsapp from '../../../assets/whatsapp.svg';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'id',
    hideHeader: true,
    Cell: () => <div className="hidden">hidden</div>,
  },
  {
    Header: 'ORDER ID',
    accessor: 'order_id',
    Cell: () => <div>1</div>,
  },
  {
    Header: 'VOUCHER NO',
    accessor: 'voucher_no',
    Cell: () => <div>1</div>,
  },
  {
    Header: 'INVOICE TO',
    accessor: 'invoice_to',
    Cell: () => <div>Adarth</div>,
  },

  {
    Header: 'SUPPLIER',
    accessor: 'supplier',
    Cell: () => <div>MK ADD Communication Services</div>,
  },
  {
    Header: 'STATUS',
    accessor: 'status',
    Cell: () => <div className="text-green-400">Approved</div>,
  },
  {
    Header: 'DATE',
    accessor: 'date',
    Cell: () => <div>2 Sep,2022</div>,
  },
  {
    Header: 'TOTAL AMOUNT',
    accessor: 'total_amount',
    Cell: () => <div>{toIndianCurrency(29834)}</div>,
  },
  {
    Header: 'PAYMENT METHOD',
    accessor: 'payment_method',
    Cell: () => <div>BANK</div>,
  },

  {
    Header: 'Action',
    accessor: '',
    disableSortBy: true,
    Cell: tableProps => {
      const navigate = useNavigate();
      const {
        row: {
          original: { id },
        },
      } = tableProps;

      return (
        <div className="flex gap-2 items-center">
          <div>
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <Share2 size="20" />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <button
                    type="button"
                    onClick={() => navigate(`view-details/${id}`)}
                    className="cursor-pointer flex items-center gap-1 w-full"
                  >
                    <img src={whatsapp} alt="whatsapp-icon" className="h-4" />
                    <span className="ml-1">Whatsapp</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    type="button"
                    onClick={() => navigate(`edit-details/${id}`)}
                    className="cursor-pointer flex items-center gap-1 w-full"
                  >
                    <Mail className="h-4" />
                    <span className="ml-1">Send Email</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <div className="cursor-pointer flex items-center gap-1 border w-full rounded-md">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link className="h-4" />
                    <span className="ml-1">Copy Link</span>
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <div>
            <Menu shadow="md" width={150}>
              <Menu.Target>
                <button type="button">
                  <MenuIcon />
                </button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <button type="button" className="cursor-pointer flex items-center gap-1 w-full">
                    <span className="ml-1">Download</span>
                  </button>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      );
    },
  },
];

export default COLUMNS;
