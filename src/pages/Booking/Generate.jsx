import { ChevronDown } from 'react-feather';
import Main from '../../components/Bookings/Generate';

const OrderDetails = () => (
  <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
    <div className="h-20 flex items-center justify-between border  border-b-1">
      <p className="text-xl pl-5 font-bold">Upload File</p>
      <button type="button" className="border mr-7 rounded md p-2 items-center flex">
        <ChevronDown className="h-3" />
        <span>Close</span>
      </button>
    </div>
    <Main />
  </div>
);

export default OrderDetails;
