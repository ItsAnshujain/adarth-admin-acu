import { Skeleton } from '@mantine/core';

const HeaderLoader = () => (
  <header className="grid grid-cols-12 h-20  border-b border-gray-450 relative">
    <div className="flex items-center col-span-2 pl-2 lg:pl-7 self-center">
      <Skeleton className="mr-2 h-6 w-6 inline-block lg:hidden" />
      <Skeleton className="w-16 lg:w-24" />
    </div>
    <div className="flex justify-between items-center col-span-10 border-l border-gray-450">
      <div className="pl-5">
        <Skeleton className="text-2xl font-bold" />
      </div>
      <div className="flex items-center mr-7">
        <Skeleton className="text-2xl font-bold" />
        <Skeleton className="text-2xl font-bold" />
        <Skeleton className="text-2xl font-bold" />
      </div>
    </div>
  </header>
);

export default HeaderLoader;
