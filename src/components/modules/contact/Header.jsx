import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';

const Header = () => (
  <div className="flex justify-between items-center pt-4">
    <div className="font-bold text-lg">Contact List</div>
    <Button
      variant="default"
      className="bg-purple-450 text-white font-normal rounded-md"
      leftIcon={<IconPlus size={20} />}
    >
      Add Contact
    </Button>
  </div>
);

export default Header;
