import { Skeleton } from '@mantine/core';

const page = new Array(10).fill(true);

const Loader = () => (
  <div className="h-full">
    <div className="grid grid-cols-12 gap-6 h-screen">
      <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto ">
        <div className="h-20 border-b border-gray-450 flex justify-between items-center">
          <div className="pl-5">
            <Skeleton className="w-16 lg:w-24" height={8} radius="xl" />
          </div>
          <div className="flex justify-around mr-7">
            <div className="mr-2 flex ">
              <Skeleton className="w-16 lg:w-24" height={8} radius="xl" />
              <Skeleton className="w-16 lg:w-24" height={8} radius="xl" />
              <Skeleton className="w-16 lg:w-24" height={8} radius="xl" />
            </div>
            <div className="mr-2 relative">
              <Skeleton className="w-16 lg:w-24" height={8} radius="xl" />
            </div>
            <div className="mr-2">
              <Skeleton className="w-16 lg:w-24" height={8} radius="xl" />
            </div>
          </div>
        </div>
        <div className="mr-7 max-w-screen overflow-x-scroll absolute top-20 h-screen">
          <table className="w-screen overflow-y-visible relative z-10">
            <thead className="bg-gray-100">
              <tr>
                {page.map(_ => (
                  <th className="text-sm">
                    <div className="w-max flex align-center text-left pl-2 text-gray-400 hover:text-black py-2 text-xs font-medium">
                      <Skeleton height={8} radius="xl" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.map(_ => (
                <tr className="text-left border border-l-0 overflow-visible">
                  <td className="pl-2 py-2">
                    <Skeleton height={8} radius="xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
