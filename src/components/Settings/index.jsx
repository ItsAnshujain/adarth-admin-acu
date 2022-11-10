import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NotificationSettings from './Notification';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import Header from './Header';

const View = () => {
  const [tabs, setTabs] = useState(0);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const getTabs = () =>
    tabs === 0 ? <NotificationSettings /> : tabs === 1 ? <ChangePassword /> : <DeleteAccount />;

  useEffect(() => {
    if (type) setTabs(1);
  }, []);

  return (
    <>
      <Header tabs={tabs} setTabs={setTabs} />
      <div className="relative pb-12 mb-16">{getTabs()}</div>
    </>
  );
};

export default View;
