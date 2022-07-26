import { Select } from '@mantine/core';
import down from '../assets/down.svg';

const data = ['20', '40', '60', '80', '100'];
const styles = () => ({
  'div': {
    'div': {
      'input': {
        width: '35%',
        position: 'relative',
        paddingLeft: 0,
        texAlign: 'left',
      },
      'div': {
        position: 'absolute',
        right: 110,
      },
    },
  },
});

const RowsPerPage = ({ setCount }) => (
  <div className="pl-5">
    <p className="flex items-center gap-3 text-sm text-gray-6">
      Rows Per Page :{' '}
      <Select
        variant="unstyled"
        defaultValue="20"
        data={data}
        sx={styles}
        onChange={setCount}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        rightSection={<img src={down} alt="down-arrow" className="h-4 p-0 m-0" />}
      />
    </p>
  </div>
);

export default RowsPerPage;
