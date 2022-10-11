import { useMemo, useState } from 'react';
import { Accordion, Button, Checkbox, Drawer } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [roles, setRoles] = useState('');

  const handleRoleChange = role => {
    setRoles(role);
    if (role === roles) {
      setRoles('');
    }
  };

  const renderRoles = useMemo(
    () =>
      Object.keys(inititalFilterData.Role).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
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
    navigate({
      pathname: '/users',
      search: `role=${roles}`,
    });
  };
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
      <div className="w-full flex justify-end">
        <Button
          variant="default"
          className="mb-3 bg-purple-450 text-white"
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
