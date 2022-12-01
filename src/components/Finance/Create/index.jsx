import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import PurchaseOrder from './PurchaseOrder';
import ReleaseOrder from './ReleaseOrder';
import Invoice from './Invoice';
import { FormProvider, useForm } from '../../../context/formContext';

const OrderView = {
  purchase: PurchaseOrder,
  release: ReleaseOrder,
  invoice: Invoice,
};

const Create = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { type } = useParams();
  const form = useForm();
  const ManualEntryView = OrderView[type] ?? <div />;

  const handleSubmit = e => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="pb-12">
      <form>
        <header className="h-[60px] border-b flex items-center justify-between pl-5 pr-7">
          <p className="font-bold text-lg">{`Create ${
            pathname.includes('purchase')
              ? 'Purchase Order'
              : pathname.includes('release')
              ? 'Release Order'
              : 'Invoice'
          }`}</p>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border rounded-md p-2 text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="border rounded-md p-2 bg-purple-450 text-white"
            >
              Create
            </Button>
          </div>
        </header>
        <FormProvider form={form}>
          <ManualEntryView />
        </FormProvider>
      </form>
    </div>
  );
};

export default Create;
