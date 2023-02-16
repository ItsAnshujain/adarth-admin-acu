import { Skeleton } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

const sidebarText = new Array(10).fill(false);

const Sidebar = () => (
  <div className="hidden lg:block lg:col-span-2 pt-4  border-r border-slate-300 w-[16.70%] h-[calc(100vh-80px)]">
    <div className="flex flex-col items-start">
      {sidebarText.map(_ => (
        <div className="w-full px-5 mb-2" key={uuidv4()}>
          <Skeleton className="w-full" height={40} />
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
