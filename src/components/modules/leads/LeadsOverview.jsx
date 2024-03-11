import { Badge, Divider, Select } from '@mantine/core';
import { ChevronDown } from 'react-feather';
import { indianCurrencyInDecimals } from '../../../utils';

const LeadsOverview = () => (
  <div>
    <div className="flex gap-2">
      <div className="border border-gray-200 flex items-center text-gray-400 text-sm rounded-md px-2 w-fit">
        <div className="text-sm">Primary Incharge - </div>
        <Select
          clearable
          searchable
          placeholder="Select..."
          name="primaryIncharge"
          data={[]}
          withAsterisk
          classNames={{
            input: 'border-none',
          }}
          rightSection={<ChevronDown size={20} />}
          className="w-28"
        />
      </div>
      <div className="border border-gray-200 flex items-center text-gray-400 text-md rounded-md px-2 w-fit">
        <div className="text-sm">Secondary Incharge - </div>
        <Select
          clearable
          searchable
          placeholder="Select..."
          name="secondaryIncharge"
          data={[]}
          withAsterisk
          classNames={{
            input: 'border-none',
          }}
          rightSection={<ChevronDown size={20} />}
          className="w-28"
        />
      </div>
    </div>
    <div className="flex flex-col gap-2 py-4">
      <div className="text-xl font-bold">Swiggy</div>
      <div className="text-sm text-black/80">asb asdb campaign in noida and new delhi region</div>
      <div className="text-lg font-bold">Basic information</div>
      <div className="flex">
        <div className="flex flex-col w-1/4">
          <div className="text-sm text-gray-500 pb-1">Start Date</div>
          <div className="text-sm">10 Nov 2023</div>
        </div>
        <div className="flex flex-col w-1/4">
          <div className="text-sm text-gray-500 pb-1">End Date</div>
          <div className="text-sm">10 Nov 2023</div>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col  w-1/4">
          <div className="text-sm text-gray-500 pb-1">Contact Person</div>
          <div className="text-sm">Ansumna</div>
        </div>
        <div className="flex flex-col  w-1/4">
          <div className="text-sm text-gray-500 pb-1">Contact Number</div>
          <div className="text-sm">+95 356898789</div>
        </div>
      </div>
      <div className="flex flex-col  w-1/4">
        <div className="text-sm text-gray-500 pb-1">Display Brand</div>
        <div className="text-sm">-</div>
      </div>
      <div className="flex flex-col  w-1/4">
        <div className="text-sm text-gray-500 pb-1">Company Representing</div>
        <div className="text-sm">Adarth Kolkata</div>
      </div>
      <Divider className="my-6" />
      <div className="text-base font-bold">Other information</div>
      <div className="flex">
        <div className="flex flex-col  w-1/4">
          <div className="text-sm text-gray-500 pb-1">Overall Budget</div>
          <div className="text-sm">{indianCurrencyInDecimals(50)}</div>
        </div>
        <div className="flex flex-col  w-1/4">
          <div className="text-sm text-gray-500 pb-1">Lead Close Date</div>
          <div className="text-sm">10 Nov 2023</div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 pb-1">Target Audience</div>
        <Badge size="xs" className="bg-purple-450 text-white w-fit p-3 my-1">
          College Students
        </Badge>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 pb-1">Campaign Theme</div>
        <Badge size="xs" className="bg-purple-450 text-white w-fit p-3 my-1">
          College Students
        </Badge>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 pb-1">Brand Competitor</div>
        <Badge size="xs" className="bg-purple-450 text-white w-fit p-3 my-1">
          College Students
        </Badge>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 pb-1">Prospect</div>
        <div className="text-sm">-</div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 pb-1">Lead Source</div>
        <div className="text-sm">-</div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 pb-1">Remarks</div>
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Egestas tellus donec id ac erat sit pellentesque
          fames a. Diam faucibus sem pretium duis lectus tincidunt duis. Orci nunc neque feugiat
          ultricies. Pretium tellus viverra convallis arcu quam. Purus dolor diam platea rutrum
          ullamcorper rhoncus egestas. Tempor nisl nunc magna orci vulputate eu. Aliquam eros semper
          penatibus turpis. Felis tincidunt nulla aliquam tempor neque.-
        </div>
      </div>
    </div>
  </div>
);

export default LeadsOverview;
