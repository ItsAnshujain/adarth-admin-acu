import { Skeleton } from '@mantine/core';

const sidebarText = new Array(10).fill(false);
const height = 24;

const Sidebar = () => (
  <div className="hidden lg:block lg:col-span-2 mt-4 border border-r border-slate-400 w-[16.66%] h-full">
    <div className="flex flex-col items-start gap-4">
      {sidebarText.map(_ => (
        <div className="ml-4 flex w-full">
          <Skeleton
            className="w-full max-w-[210px] lg:max-w-[140px] xl:max-w-[215px]"
            height={height}
          />
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
