import { useEffect } from 'react';
import classNames from 'classnames';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import user from '../assets/user.png';
import useSideBarState from '../store/sidebar.store';

const notification = new Array(5).fill(false);

const Notifications = () => {
  const setColor = useSideBarState(state => state.setColor);

  useEffect(() => {
    setColor(3);
  }, []);

  return (
    <div className="absolute top-0 w-screen ">
      <Header title="Notification" />
      <div className="grid grid-cols-12">
        <Sidebar />
        <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
          <div className="flex flex-col gap-4 pl-5 pr-7 mt-4 mb-10">
            {notification.map((item, index) => (
              <div
                key={Math.random()}
                className={classNames(
                  `border p-4 ${
                    index === 2 || index === 3 ? 'text-purple-450 bg-[#4B0DAF1A]' : ''
                  }`,
                )}
              >
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <img className="h-5" src={user} alt="User" />
                    <p className="font-bold">Emilia Clarke</p>
                  </div>
                  <p className="text-slate-400 text-sm">2 hours ago</p>
                </div>
                <p className="mt-2 text-sm">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur cumque
                  ratione at aperiam adipisci blanditiis.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
