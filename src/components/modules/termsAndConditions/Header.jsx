import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';

const Header = () => (
  <div className="flex justify-between items-center py-4">
    <div className="font-bold text-lg">Terms and Conditions</div>
    <Button
      variant="default"
      className="bg-purple-450 text-white font-normal rounded-md"
      leftIcon={<IconPlus size={20} />}
    >
      Add Terms and Conditions
    </Button>
  </div>
);

export default Header;
