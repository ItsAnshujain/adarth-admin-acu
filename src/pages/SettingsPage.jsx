import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SubHeader from '../components/Settings/SubHeader';
import NotificationSettings from '../components/Settings/Notification';
import ChangePassword from '../components/Settings/ChangePassword';
import DeleteAccount from '../components/Settings/DeleteAccount';
import SignatureAndLetterhead from '../components/Settings/SignatureAndLetterhead';
import SmtpSetup from '../pageComponents/Settings/SmtpSetup';

const SettingsPage = () => {
  const [tabs, setTabs] = useState(0);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const getTabs = () =>
    tabs === 0 ? (
      <NotificationSettings />
    ) : tabs === 1 ? (
      <ChangePassword />
    ) : tabs === 2 ? (
      <SignatureAndLetterhead />
    ) : tabs === 3 ? (
      <SmtpSetup />
    ) : (
      <DeleteAccount />
    );

  useEffect(() => {
    if (type) setTabs(1);
  }, []);

  return (
    <div className="w-screen">
      <Header title="Settings" />
      <div className="grid grid-cols-12 h-[calc(100vh-60px)]">
        <Sidebar />
        <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto">
          <SubHeader tabs={tabs} setTabs={setTabs} />
          <div className="relative pb-12">{getTabs()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
