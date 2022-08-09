import { Select } from '@mantine/core';
import down from '../assets/down.svg';

const data = ['10', '20', '40', '80', '100'];
const styles = () => ({
  rightSection: { pointerEvents: 'none' },
  wrapper: {
    width: '60px',
  },
});

const RowsPerPage = ({ setCount }) => (
  <div className="pl-5">
    <div className="flex items-center gap-3 text-sm text-gray-6">
      Rows Per Page :{' '}
      <Select
        variant="unstyled"
        defaultValue="10"
        data={data}
        onChange={setCount}
        styles={styles}
        rightSection={<img src={down} alt="down-arrow" className="h-4 p-0 m-0" />}
      />
    </div>
  </div>
);

export default RowsPerPage;
