import { Button, Drawer, Radio } from '@mantine/core';
import { IconTrash, IconHistory, IconShare } from '@tabler/icons';

const VersionsDrawer = ({ isOpened, onClose }) => (
  <Drawer
    className="overflow-auto"
    size="lg"
    padding="xl"
    position="right"
    opened={isOpened}
    title="Versions"
    onClose={onClose}
  >
    <div className="border border-gray-400 p-2 rounded-md flex flex-col gap-2">
      <div className="flex w-full gap-4 justify-between">
        <Radio
          label={
            <div>
              <div className="text-xl truncate" title="Version 1.0.0.10.10">
                Version 1.0.0.10.10 00
              </div>
              <div className="text-sm ">01/01/2024</div>
            </div>
          }
          classNames={{ inner: 'mt-2', root: 'w-1/2', label: 'w-[150px]' }}
        />
        <div className="flex">
          <Button size="xs" title="Restore" className="text-black px-2">
            <IconHistory size={22} />
          </Button>
          <Button size="xs" title="Share" className="text-black px-2">
            <IconShare size={22} />
          </Button>
          <Button size="xs" title="Delete" className="text-red-350 px-2">
            <IconTrash size={22} />
          </Button>
        </div>
      </div>
    </div>
  </Drawer>
);

export default VersionsDrawer;
