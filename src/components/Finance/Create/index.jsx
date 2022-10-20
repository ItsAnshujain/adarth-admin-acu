import { useLocation, useNavigate } from 'react-router-dom';
import { TextInput, NativeSelect } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Calendar, ChevronDown } from 'react-feather';
import { useState } from 'react';
import Table from '../../Table/Table';
import column from './ColumnCreateOrder';
import data from './Data.json';
import dataColumnTotal from './DataColumTotal.json';
import columnTotal from './columnTotal';

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
    padding: 8,
  },
};

const Create = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [orderId, setOrderId] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="pb-12">
      <form>
        <header className="h-[60px] border-b flex items-center justify-between pl-5 pr-7">
          <p className="font-bold text-lg">{`Create ${
            pathname.includes('purchase')
              ? 'Purchase Order'
              : pathname.includes('release')
              ? 'Release Order'
              : 'Invoice'
          }`}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} type="button" className="border rounded-md p-2">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="border rounded-md p-2 bg-purple-450 text-white"
            >
              Create
            </button>
          </div>
        </header>
        <div className="flex justify-between pl-5 pr-7 h-28 border-b items-center">
          <TextInput className="w-1/4" styles={styles} label="Voucher No" />
          <DatePicker
            className="w-1/4"
            clearable={false}
            onChange={setDate}
            value={date}
            label="Date"
            styles={styles}
            icon={<Calendar className="text-black absolute left-[700%]" />}
          />
        </div>
        <div className="pl-5 pr-7 py-8 border-b">
          <div className="grid grid-cols-3 gap-4">
            <TextInput styles={styles} label="Supplier Name" />
            <TextInput styles={styles} label="Ref No" />
            <TextInput styles={styles} label="GST" />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-7">
            <TextInput className="col-span-2" styles={styles} label="Street Address" />
            <TextInput className="col-span-1" styles={styles} label="City" />
            <TextInput className="col-span-1" styles={styles} label="Pin" />
          </div>
        </div>
        <div className="pl-5 pr-7 py-4  mb-10">
          <NativeSelect
            className="mr-2 w-1/4 my-4"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            data={['Completed', 'Upcoming', 'Ongoing']}
            styles={{
              rightSection: { pointerEvents: 'none' },
              label: {
                fontWeight: 'bold',
                marginBottom: 8,
                fontSize: 16,
                letterSpacing: '0.5px',
              },
            }}
            label="Select Order Id"
            rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
            rightSectionWidth={40}
          />
          <div className="border-dashed border-0 border-black border-b-2 pb-4">
            <Table COLUMNS={column} data={data} isCreateOrder />
          </div>
          <Table COLUMNS={columnTotal} data={dataColumnTotal} isCreateOrder />
        </div>
        <div className="pl-5 pr-7 flex flex-col gap-4">
          <TextInput styles={styles} label="Amount Chargeable (in words)" />
          <TextInput styles={styles} label="Declaration" />
        </div>
      </form>
    </div>
  );
};

export default Create;
