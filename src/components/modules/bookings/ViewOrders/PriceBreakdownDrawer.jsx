import { Divider, Drawer } from '@mantine/core';
import toIndianCurrency from '../../../../utils/currencyFormat';

const PriceBreakdownDrawer = ({ isOpened, styles, onClose }) => (
  <Drawer
    className="overflow-auto"
    overlayOpacity={0.1}
    overlayBlur={0}
    size="510px"
    position="right"
    opened={isOpened}
    styles={styles}
    title="Price Breakdown Total Booking"
    onClose={onClose}
    classNames={{
      title: 'text-xl font-semibold',
      header: 'px-6 mb-0 z-20 h-16 sticky top-0 bg-white',
      closeButton: 'text-black',
      body: 'p-0',
    }}
  >
    <Divider />
    <div className="border border-yellow-350 bg-yellow-250 m-6 p-4 rounded-lg flex flex-col gap-1">
      <div className="flex justify-between">
        <div>Total Display Cost</div>
        <div className="font-bold text-lg">{toIndianCurrency(1000000)}</div>
      </div>
      <div className="flex justify-between">
        <div>GST</div>
        <div className="font-bold text-lg">{toIndianCurrency(10000)}</div>
      </div>
    </div>
    <div className="border border-blue-200 bg-blue-100 m-6 p-4 rounded-lg flex flex-col gap-4">
      <div>
        <div className="flex justify-between">
          <div>Total Printing Cost</div>
          <div className="font-bold text-lg">{toIndianCurrency(1000000)}</div>
        </div>
        <div className="flex justify-between">
          <div>GST</div>
          <div className="font-bold text-lg">{toIndianCurrency(10000)}</div>
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <div>Total Mounting Cost</div>
          <div className="font-bold text-lg">{toIndianCurrency(1000000)}</div>
        </div>
        <div className="flex justify-between">
          <div>GST</div>
          <div className="font-bold text-lg">{toIndianCurrency(10000)}</div>
        </div>
      </div>
    </div>
    <div className="border border-purple-350 bg-purple-100 m-6 p-4 rounded-lg flex flex-col gap-4">
      <div className="italic font-normal text-xs">** inclusive of GST</div>
      <div className="flex justify-between">
        <div>One-time Installation Cost</div>
        <div className="font-bold text-lg">{toIndianCurrency(1000000)}</div>
      </div>

      <div className="flex justify-between">
        <div>Monthly Additional Cost</div>
        <div className="font-bold text-lg">{toIndianCurrency(1000000)}</div>
      </div>

      <div className="flex justify-between">
        <div>
          Other Charges (<span className="text-red-450">-</span>)
        </div>
        <div className="font-bold text-lg">{toIndianCurrency(1000000)}</div>
      </div>
    </div>
    <div className="border border-green-350 bg-green-100 m-6 p-4 rounded-lg flex flex-col">
      <div className="flex justify-between">
        <div>Discount</div>
        <div className="font-bold text-lg">{toIndianCurrency(200000)}</div>
      </div>
      <div className="text-gray-550">(Discount over display cost)</div>
    </div>
    <div className="absolute bottom-0 z-10 bg-white pt-2 gap-6 w-full">
      <Divider />
      <div className="flex justify-between p-6">
        <div className="text-lg font-semibold">Total Price</div>
        <div className="text-xl text-purple-450 font-semibold">{toIndianCurrency(10000)}</div>
      </div>
    </div>
  </Drawer>
);

export default PriceBreakdownDrawer;
