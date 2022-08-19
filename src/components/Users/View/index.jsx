import { useState } from 'react';
import { ChevronDown, Plus } from 'react-feather';
import { Tabs, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import Filter from '../../Filter';
import pdf from '../../../assets/pdf.svg';
import image1 from '../../../assets/image1.png';
import greenfolder from '../../../assets/ongoing.svg';
import purplefolder from '../../../assets/completed.svg';
import orangefolder from '../../../assets/upcoming.svg';
import redfolder from '../../../assets/redfolder.svg';
import bluefolder from '../../../assets/bluefolder.svg';
import dummy from '../../../Dummydata/ORDER_DATA.json';
import dummy2 from '../../../Dummydata/USER_PROPOSAL.json';
import column from './column';
import columns from './columns';
import Table from '../../Table/Table';

const Header = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [activeTable, setActiveTable] = useState('campaign');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(20);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const id = pathname.split('/')[3];

  const openDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <Tabs value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List className="h-20 relative">
        <Tabs.Tab className="text-base hover:bg-transparent" value="first">
          Overview
        </Tabs.Tab>
        <Tabs.Tab className="text-base hover:bg-transparent" value="second">
          Managing
        </Tabs.Tab>
        <button
          className="absolute right-7 top-7 bg-purple-450 text-white px-4 py-2 rounded-md"
          type="button"
          onClick={() => navigate(`/users/edit-details/${id}`)}
        >
          Edit
        </button>
      </Tabs.List>
      <Tabs.Panel value="first">
        <div className="pl-5 pr-7 flex justify-between mt-8 mb-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                <div>
                  <img src={image1} alt="profile pic" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Peter Williams</p>
                  <p className="text-[#914EFB]">Management</p>
                  <p>Adarth</p>
                </div>
              </div>
              <div>
                <p>
                  But I must explain to you how all this mistaken idea of denouncing pleasure and
                  praising pain was born and I will give you a complete account of the system, and
                  expound the actual teachings of the great explorer of the truth, the
                  master-builder of human happiness.{' '}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Email</p>
                <p className="font-semibold">peter@adarthgmail.com</p>
              </div>
              <div>
                <p className="text-slate-400">Phone</p>
                <p className="font-semibold">+91 987542134</p>
              </div>
              <div>
                <p className="text-slate-400">Address</p>
                <p className="font-semibold">
                  Hedy Greene Ap #696-3279 Viverra. Avenue Latrobe DE{' '}
                </p>
              </div>
              <div>
                <p className="text-slate-400">City</p>
                <p className="font-semibold">Madrid</p>
              </div>
              <div>
                <p className="text-slate-400">Pincode</p>
                <p className="font-semibold">43455513</p>
              </div>
              <div>
                <p className="text-slate-400">Pin</p>
                <p className="font-semibold">ABCD1234561</p>
              </div>
              <div>
                <p className="text-slate-400">Aadhar</p>
                <p className="font-semibold">4441-4221-3561-0548</p>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col">
                    <img src={pdf} alt="" className="h-8" />
                    <p className="text-sm font-medium">license.pdf</p>
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Landlord License</p>
                  <p className="text-slate-400">Your landlord license photocopy</p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col">
                    <img src={pdf} alt="" className="h-8" />
                    <p className="text-sm font-medium">license.pdf</p>
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Landlord License</p>
                  <p className="text-slate-400">Your landlord license photocopy</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col ">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col">
                    <img src={pdf} alt="" className="h-8" />
                    <p className="text-sm font-medium">license.pdf</p>
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Landlord License</p>
                  <p className="text-slate-400">Your landlord license photocopy</p>
                </div>
              </div>
              <div className="flex flex-col ">
                <div className="border border-dashed border-slate-400 flex items-center justify-center relative w-92 h-36 bg-slate-100">
                  <div className="flex justify-center flex-col">
                    <img src={pdf} alt="" className="h-8" />
                    <p className="text-sm font-medium">license.pdf</p>
                  </div>
                </div>
                <div className="text-sm mt-2">
                  <p className="font-medium">Landlord License</p>
                  <p className="text-slate-400">Your landlord license photocopy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="second">
        <div>
          <div className="h-20 border-b flex justify-between items-center pl-5 pr-7">
            <p className="font-bold">Managing Campaign</p>
            <div className="flex">
              <div className="mr-2 relative">
                <Button onClick={openDatePicker} variant="default" type="button">
                  <img src={calendar} className="h-5" alt="calendar" />
                </Button>
                {showDatePicker && (
                  <div className="absolute z-20 -translate-x-1/2 bg-white -top-0.3">
                    <DateRange handleClose={openDatePicker} />
                  </div>
                )}
              </div>
              <div className="mr-2">
                <Button
                  onClick={() => setShowFilter(!showFilter)}
                  variant="default"
                  type="button"
                  className="font-medium"
                >
                  <ChevronDown size={16} className="mt-[1px] mr-1" /> Filter
                </Button>
                {showFilter && <Filter isOpened={showFilter} setShowFilter={setShowFilter} />}
              </div>
              {!(activeTable === 'campaign') && (
                <div className="mr-2">
                  <Button
                    variant="default"
                    type="button"
                    className="font-medium bg-purple-450 text-white"
                  >
                    <Plus className="h-4" />
                    Add Proposal
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="pl-5 pr-7 flex justify-between mt-8 mb-8">
            <div className="flex gap-8 justify-between flex-wrap">
              <div className="border rounded p-8  pr-20">
                <img src={purplefolder} alt="folder" />
                <p className="my-2 text-slate-400 text-xs">Ongoing Orders</p>
                <p weight="bold">325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={orangefolder} alt="folder" />
                <p className="my-2 text-slate-400 text-xs">Upcoming Orders</p>
                <p weight="bold">325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={bluefolder} alt="folder" />
                <p className="my-2 text-slate-400 text-xs">Completed Orders</p>
                <p weight="bold">325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={redfolder} alt="folder" />
                <p className="my-2 text-slate-400 text-xs">Total Proposal</p>
                <p weight="bold">325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={greenfolder} alt="folder" />
                <p className="my-2 text-slate-400 text-xs">Total Campaign</p>
                <p weight="bold">325</p>
              </div>
            </div>
          </div>
          <Tabs value={activeTable} onTabChange={setActiveTable}>
            <Tabs.List className="h-16">
              <Tabs.Tab className="hover:bg-transparent text-base" value="campaign">
                Campaign
              </Tabs.Tab>
              <Tabs.Tab className="hover:bg-transparent text-base" value="proposal">
                Proposals
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="campaign">
              <div className="pr-7">
                <div className="flex justify-between h-20 items-center">
                  <RowsPerPage setCount={setCount} count={count} />
                  <Search search={search} setSearch={setSearch} />
                </div>
                <Table dummy={dummy} COLUMNS={column} />
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="proposal" className="mr-5">
              <div className="mt-8">
                <Table dummy={dummy2} COLUMNS={columns} />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default Header;
