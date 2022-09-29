import { useMemo, useState } from 'react';
import { Accordion, Checkbox, Drawer } from '@mantine/core';

const inititalFilterData = {
  'Role': {
    'management': 'Management',
    'supervisor': 'Supervisor',
    'associate': 'Associate',
  },
};
const styles = { title: { fontWeight: 'bold' } };

const Filter = ({ isOpened, setShowFilter }) => {
  const [_, setCheckedValue] = useState(false);

  const renderRoles = useMemo(
    () =>
      Object.keys(inititalFilterData.Role).map(item => (
        <div className="flex gap-2 mb-2" key={item}>
          <Checkbox
            onChange={event => setCheckedValue(event.currentTarget.value)}
            label={inititalFilterData.Role[item]}
            value={item}
          />
        </div>
      )),
    [],
  );

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
