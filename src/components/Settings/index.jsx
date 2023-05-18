import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NotificationSettings from './Notification';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import Header from './Header';
import SignatureAndLetterhead from './SignatureAndLetterhead';
import SmtpSetup from '../../pageComponents/Settings/SmtpSetup';

const View = () => {
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
    <>
      <Header tabs={tabs} setTabs={setTabs} />
      <div className="relative pb-12">{getTabs()}</div>
    </>
  );
};

export default View;
