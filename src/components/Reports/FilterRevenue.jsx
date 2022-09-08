import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Drawer } from '@mantine/core';

const inititalFilterData = {
  'StateOrCity': {
    'State': false,
    'City': false,
  },
};
const styles = { title: { fontWeight: 'bold' } };

const Filter = ({ isOpened, setShowFilter }) => {
  const [filterData, setFilterData] = useState(inititalFilterData);

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
        <div className="flex flex-col border p-4 pt-2 gap-2 rounded-xl">
          <div className="border-b py-2 flex justify-between items-center">
            <p className="text-lg">State Or City</p>
            <ChevronDown className="h-4" />
          </div>
          <div className="mt-2">
            {Object.entries(filterData.StateOrCity).map(items => (
              <div className="flex gap-2 mb-2">
                <input
                  className="w-4 border-gray-400"
                  type="checkbox"
                  checked={items[1]}
                  onChange={() =>
                    setFilterData(prevData => {
                      const newData = { ...prevData };
                      newData.Cities[items[0]] = !items[1];
                      return newData;
                    })
                  }
                />
                <p>{items[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Filter;
