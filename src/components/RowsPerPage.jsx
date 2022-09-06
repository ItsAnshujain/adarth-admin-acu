import { Select } from '@mantine/core';
import { ChevronDown } from 'react-feather';

const data = ['10', '20', '40', '80', '100'];

const RowsPerPage = ({ setCount, count }) => (
  <div className="pl-5">
    <div className="flex items-center gap-3 text-sm text-gray-6">
      Rows Per Page :{' '}
      <Select
        variant="unstyled"
        defaultValue={count}
        data={data}
        onChange={setCount}
        styles={{
          rightSection: { pointerEvents: 'none' },
          wrapper: {
            width: '60px',
          },
        }}
        rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
      />
    </div>
  </div>
);

export default RowsPerPage;
