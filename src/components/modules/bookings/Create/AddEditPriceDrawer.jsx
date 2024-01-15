import { Checkbox, Divider, Drawer, NumberInput } from '@mantine/core';

const AddEditPriceDrawer = ({ isOpened, onClose, styles = {} }) => (
  <Drawer
    className="overflow-auto"
    overlayOpacity={0.1}
    overlayBlur={0}
    size="xl"
    transition="slide-left"
    transitionDuration={500}
    transitionTimingFunction="ease-in-out"
    position="right"
    opened={isOpened}
    styles={styles}
    title="Price Breakdown"
    onClose={onClose}
    classNames={{
      title: 'text-xl font-semibold',
      header: 'px-6 pt-4',
      closeButton: 'text-black',
    }}
  >
    <Divider className="my-4" />

    <Divider className="my-4" />

    <div className="border border-yellow-350 bg-yellow-250 m-6 p-4 rounded-md flex flex-col gap-4">
      <div>
        <div className="text-lg font-bold">Apply Display Cost</div>
        <div className="text-gray-500 text-base">
          Please select either Display Cost (per month) or Display Cost (per sq. ft.)
        </div>
      </div>
      <div className="text-base font-bold">Display Cost (per month)</div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NumberInput
            label="Cost"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-4/5"
          />
          <NumberInput
            label="GST"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-1/5"
            rightSection="%"
          />
        </div>
        <NumberInput
          label="Total"
          disabled
          hideControls
          classNames={{ label: 'text-base font-bold' }}
        />
      </div>
      <div className="text-base font-bold">Display Cost (per sq. ft.)</div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NumberInput
            label="Cost"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-4/5"
          />
          <NumberInput
            label="GST"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-1/5"
            rightSection="%"
          />
        </div>
        <NumberInput
          label="Total"
          disabled
          hideControls
          classNames={{ label: 'text-base font-bold' }}
        />
      </div>

      <NumberInput
        label="Traded Amount"
        hideControls
        classNames={{ label: 'text-base font-bold' }}
      />
    </div>
    <div className="border border-blue-200 bg-blue-100 m-6 p-4 rounded-md flex flex-col gap-4">
      <Checkbox
        defaultChecked
        label="Apply for all selected inventories"
        classNames={{ label: 'text-base font-bold' }}
      />
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NumberInput
            label="Printing Cost (per sq. ft.)"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-4/5"
          />
          <NumberInput
            label="GST"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-1/5"
            rightSection="%"
          />
        </div>
        <NumberInput
          label="Total Printing Cost"
          disabled
          hideControls
          classNames={{ label: 'text-base font-bold' }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NumberInput
            label="Mounting Cost (per sq. ft.)"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-4/5"
          />
          <NumberInput
            label="GST"
            hideControls
            classNames={{ label: 'text-base font-bold' }}
            className="w-1/5"
            rightSection="%"
          />
        </div>
        <NumberInput
          label="Total Mounting Cost"
          disabled
          hideControls
          classNames={{ label: 'text-base font-bold' }}
        />
      </div>
    </div>
    <div className="border border-purple-350 bg-purple-100 m-6 p-4 rounded-md flex flex-col gap-4">
      <div className="text-base font-bold">
        Miscellaneous <span className="text-xs font-normal italic"> ** inclusive of GST</span>
      </div>
      <NumberInput
        label="One-time Installation Cost"
        hideControls
        classNames={{ label: 'text-base font-bold' }}
      />
      <NumberInput
        label="Monthly Additional Cost"
        hideControls
        classNames={{ label: 'text-base font-bold' }}
      />
      <NumberInput
        label="Other Charges (-)"
        hideControls
        classNames={{ label: 'text-base font-bold' }}
      />
    </div>
  </Drawer>
);

export default AddEditPriceDrawer;
