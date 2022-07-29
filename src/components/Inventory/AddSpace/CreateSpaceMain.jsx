import { Chip, Button } from '@mantine/core';
import BasicInfo from './BasicInformation';

const initialState = [
  { state: false, text: 'Basic Information' },
  { state: true, text: 'Specifications' },
  { state: false, text: 'Location' },
];

const styles = () => ({
  checkIcon: {
    backgroundColor: 'white',
    color: 'primary',
  },
});
const MainArea = () => (
  <>
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="flex gap-2 pl-5">
        {initialState.map(val => (
          <Chip
            key={val.text}
            styles={styles}
            checked={val.state}
            variant="filled"
            color="gray"
            radius="xs"
            size="md"
          >
            {val.text}
          </Chip>
        ))}
      </div>
      <div className="flex gap-4 pr-7">
        <Button className="bg-black">Back</Button>
        <Button variant="outline">Cancel</Button>
        <Button className="bg-purple-450">Next</Button>
      </div>
    </div>
    <div>
      <div>
        <form>
          <BasicInfo />
        </form>
      </div>
    </div>
  </>
);

export default MainArea;
