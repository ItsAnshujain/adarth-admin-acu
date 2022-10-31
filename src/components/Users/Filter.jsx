import { useMemo, useState, useEffect } from 'react';
import { Accordion, Button, Drawer, Radio } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';

const inititalFilterData = {
  'Role': {
    'media_owner': 'Media Owner',
    'manager': 'Manager',
    'supervisor': 'Supervisor',
    'associate': 'Associate',
  },
};
const styles = { title: { fontWeight: 'bold' } };

const Filter = ({ isOpened, setShowFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [roles, setRoles] = useState('');
  const role = searchParams.get('role');

  const handleRoleChange = userRole => {
    setRoles(userRole);
    if (userRole === roles) {
      setRoles('');
    }
  };

  const renderRoles = useMemo(
    () =>
      Object.keys(inititalFilterData.Role).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Radio
            onChange={event => handleRoleChange(event.currentTarget.value)}
            label={inititalFilterData.Role[item]}
            defaultValue={item}
            checked={roles === item}
          />
        </div>
      )),
    [roles],
  );

  const handleNavigationByRoles = () => {
    searchParams.set('role', roles);
    setSearchParams(searchParams);
  };
  const handleResetParams = () => {
    searchParams.delete('role');
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setRoles(role ?? '');
  }, [searchParams]);

  return (
    <Drawer
      className="overflow-auto"
      overlayOpacity={0.1}
      overlayBlur={0}
      size="lg"
      transition="slide-down"
      transitionDuration={1350}
      transitionTimingFunction="ease-in-out"
      padding="xl"
      position="right"
      opened={isOpened}
      styles={styles}
      title="Filters"
      onClose={() => setShowFilter(false)}
    >
      <div className="w-full flex justify-end mb-3">
        <Button onClick={handleResetParams} className="border-black text-black radius-md mr-3">
          Reset
        </Button>
        <Button
          variant="default"
          className=" bg-purple-450 text-white"
          onClick={handleNavigationByRoles}
        >
          Apply Filters
        </Button>
      </div>
      <div className="flex text-gray-400 flex-col gap-4">
        <Accordion defaultValue="roles">
          <Accordion.Item value="roles" className="mb-4 rounded-xl border">
            <Accordion.Control>
              <p className="text-lg">Roles</p>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="mt-2">{renderRoles}</div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default Filter;
