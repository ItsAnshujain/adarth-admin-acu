import { useState } from 'react';
import { ChevronDown, Plus } from 'react-feather';
import { Tabs, Button, Image } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import RowsPerPage from '../../RowsPerPage';
import Search from '../../Search';
import calendar from '../../../assets/data-table.svg';
import DateRange from '../../DateRange';
import Filter from '../../Filter';
// import pdf from '../../../assets/pdf.svg';
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
import { useFetchUsersById } from '../../../hooks/users.hooks';
import PreviewCard from '../Create/UI/PreviewCard';
import UserImage from '../../../assets/placeholders/user.png';

const Header = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [activeTable, setActiveTable] = useState('campaign');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState('20');
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { data: userDetails } = useFetchUsersById(userId);
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
          onClick={() => navigate(`/users/edit-details/${userId}`)}
        >
          Edit
        </button>
      </Tabs.List>
      <Tabs.Panel value="first">
        <div className="pl-5 flex justify-between mt-8 mb-8">
          <div className="grid grid-cols-4 gap-8">
            <div className="flex flex-col col-span-1 gap-8">
              <div className="flex gap-4">
                <div>
                  <Image
                    src={userDetails?.image || UserImage}
                    alt="profile pic"
                    height={120}
                    width={120}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl font-bold">{userDetails?.name || 'NA'}</p>
                  <p className="text-[#914EFB] capitalize">{userDetails?.role || 'NA'}</p>
                  <p>{userDetails?.company || 'NA'}</p>
                </div>
              </div>
              <div>
                <p>{userDetails?.about || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">Email</p>
                <p className="font-semibold">{userDetails?.email || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">Phone</p>
                <p className="font-semibold">+91 {userDetails?.number || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">Address</p>
                <p className="font-semibold">{userDetails?.address || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">City</p>
                <p className="font-semibold">{userDetails?.city || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">Pincode</p>
                <p className="font-semibold">{userDetails?.pincode || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">Pan</p>
                <p className="font-semibold">{userDetails?.pan || 'NA'}</p>
              </div>
              <div>
                <p className="text-slate-400">Aadhar</p>
                <p className="font-semibold">{userDetails?.aadhaar || 'NA'}</p>
              </div>
            </div>
            {userDetails?.docs?.map(doc => (
              <div className="flex flex-col col-span-1">
                <PreviewCard
                  filename={doc}
                  cardText={doc}
                  cardSubtext={doc}
                  showTrashBtn={false}
                  preview
                />
              </div>
            ))}
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
            <div className="flex gap-3  flex-wrap">
              <div className="border rounded p-8  pr-20">
                <img src={purplefolder} alt="folder" />
                <p className="my-2 text-slate-400 text-sm">Ongoing Orders</p>
                <p>325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={orangefolder} alt="folder" />
                <p className="my-2 text-slate-400 text-sm">Upcoming Orders</p>
                <p>325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={bluefolder} alt="folder" />
                <p className="my-2 text-slate-400 text-sm">Completed Orders</p>
                <p>325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={redfolder} alt="folder" />
                <p className="my-2 text-slate-400 text-sm">Total Proposal</p>
                <p>325</p>
              </div>
              <div className="border rounded p-8 pr-20">
                <img src={greenfolder} alt="folder" />
                <p className="my-2 text-slate-400 text-sm">Total Campaign</p>
                <p>325</p>
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
