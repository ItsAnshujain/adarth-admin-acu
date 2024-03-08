import { Avatar, Badge } from '@mantine/core';

const LeadHistoryCard = () => (
  <div className="flex flex-col border border-gray-200 rounded-md w-full p-4 gap-3">
    <Badge className="bg-purple-450 text-white font-normal w-fit capitalize">In Progress</Badge>
    <div className="text-sm">
      Lorem ipsum dolor sit amet consectetur. Egestas tellus donec id ac erat sit pellentesque fames
      a. Diam faucibus sem pretium duis lectus tincidunt duis. Orci nunc neque feugiat ultricies.
      Pretium tellus viverra convallis arcu quam. Purus dolor diam platea rutrum ullamcorper rhoncus
      egestas. Tempor nisl nunc magna orci vulputate eu. Aliquam eros semper penatibus turpis. Felis
      tincidunt nulla aliquam tempor neque.-
    </div>
    <div className="text-purple-450">Over the phone communication</div>
    <div className="flex">
      <div className="w-1/3">
        <div className="text-sm text-gray-500">Primary Incharge</div>
        <div className="flex items-center">
          <Avatar />
          <div className="text-sm">Rohan Agarwal</div>
        </div>
      </div>
      <div className="w-1/3">
        <div className="text-sm text-gray-500">Secondary Incharge</div>
        <div className="flex items-center">
          <Avatar />
          <div className="text-sm">None</div>
        </div>
      </div>
    </div>
    <div className="w-1/3">
      <div className="text-sm text-gray-500">Next Follow Up</div>
      <div className="flex items-center">
        <div className="text-sm">20 Oct 2023</div>
      </div>
    </div>
  </div>
);

export default LeadHistoryCard;
