import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import PurchaseOrder from './PurchaseOrder';
import ReleaseOrder from './ReleaseOrder';
import Invoice from './Invoice';
import { FormProvider, useForm } from '../../../context/formContext';
import {
  useBookingById,
  useGenerateInvoice,
  useGeneratePurchaseOrder,
  useGenerateReleaseOrder,
} from '../../../hooks/booking.hooks';

const orderView = {
  purchase: PurchaseOrder,
  release: ReleaseOrder,
  invoice: Invoice,
};

const title = {
  purchase: 'Purchase Order',
  release: 'Release Order',
  invoice: 'Invoice',
};

const purchaseSchema = yup.object({
  supplierName: yup.string().trim(),
  invoiceNo: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  supplierGst: yup.string().trim(),
  supplierStreetAddress: yup.string().trim(),
  supplierCity: yup.string().trim(),
  supplierZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  buyerName: yup.string().trim(),
  buyerGst: yup.string().trim(),
  buyerRefNo: yup.string().trim(), // TODO: key missing and should be buyerRefNo
  buyerOtherReference: yup.string().trim(), // TODO: key missing and should be buyerOtherReference
  dispatchThrough: yup.string().trim(),
  destination: yup.string().trim(),
  buyerStreetAddress: yup.string().trim(),
  buyerCity: yup.string().trim(),
  buyerZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  termOfDelivery: yup.string().trim(),
  signature: yup.string().trim(),
});

const initialPurchaseValues = {
  supplierName: '',
  invoiceNo: null,
  supplierGst: '',
  supplierStreetAddress: '',
  supplierCity: '',
  supplierZip: null,
  buyerName: '',
  buyerGst: '',
  buyerRefNo: '', // TODO: key missing and should be buyerRefNo
  buyerOtherReference: '', // TODO: key missing and should be buyerOtherReference
  dispatchThrough: '',
  destination: '',
  buyerStreetAddress: '',
  buyerCity: '',
  buyerZip: null,
  termOfDelivery: '',
  signature: '', // TODO: key missing
};

const releaseSchema = yup.object({
  releaseOrderNo: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  companyName: yup.string().trim(),
  quotationNumber: yup.string().trim(),
  contactPerson: yup.string().trim(),
  phone: yup.string().trim(),
  mobile: yup.string().trim(),
  email: yup.string().trim(),
  streetAddress: yup.string().trim(),
  city: yup.string().trim(),
  zip: yup.number().positive('Must be a positive number').typeError('Must be a number').nullable(),
  supplierName: yup.string().trim(),
  supplierdesignation: yup.string().trim(),
  signature: yup.string().trim(),
  termsAndConditions: yup.string().trim(),
});

const initialReleaseValues = {
  releaseOrderNo: null,
  companyName: '',
  quotationNumber: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  email: '',
  zip: null,
  supplierName: '',
  supplierDesignation: '',
  signature: '',
  termsAndConditions: '',
};

const invoiceSchema = yup.object({
  invoiceNo: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  supplierName: yup.string().trim(),
  supplierGst: yup.string().trim(),
  supplierStreetAddress: yup.string().trim(),
  supplierCity: yup.string().trim(),
  supplierZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  supplierPhone: yup.string().trim(),
  supplierEmail: yup.string().trim(),
  supplierRefNo: yup.string().trim(),
  supplierOtherReference: yup.string().trim(),
  supplierWebsite: yup.string().trim(),
  buyerName: yup.string().trim(),
  buyerContactPerson: yup.string().trim(),
  buyerPhone: yup.string().trim(),
  buyerGst: yup.string().trim(),
  buyerStreetAddress: yup.string().trim(),
  buyerCity: yup.string().trim(),
  buyerZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable(),
  buyerOrderNumber: yup.string().trim(),
  dispatchDocumentNumber: yup.string().trim(),
  dispatchThrough: yup.string().trim(),
  destination: yup.string().trim(),
  deliveryNote: yup.string().trim(),
  termOfDelivery: yup.string().trim(),
  bankName: yup.string().trim(),
  accountNo: yup.string().trim(),
  ifscCode: yup.string().trim(),
  modeOfPayment: yup.string().trim(),
  declaration: yup.string().trim(),
});

const initialInvoiceValues = {
  invoiceNo: null,
  supplierName: '',
  supplierGst: '',
  supplierStreetAddress: '',
  supplierCity: '',
  supplierZip: null,
  supplierPhone: '',
  supplierEmail: '',
  supplierRefNo: '',
  supplierOtherReference: '',
  supplierWebsite: '',
  buyerName: '',
  buyerContactPerson: '',
  buyerPhone: '',
  buyerGst: '',
  buyerStreetAddress: '',
  buyerCity: '',
  buyerZip: null,
  buyerOrderNumber: '',
  dispatchDocumentNumber: '',
  dispatchThrough: '',
  destination: '',
  deliveryNote: '',
  termOfDelivery: '',
  bankName: '',
  accountNo: '',
  ifscCode: '',
  modeOfPayment: '',
  declaration: '',
};

const schema = {
  purchase: purchaseSchema,
  release: releaseSchema,
  invoice: invoiceSchema,
};

const initialValues = {
  purchase: initialPurchaseValues,
  release: initialReleaseValues,
  invoice: initialInvoiceValues,
};

const Create = () => {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const { type } = useParams();
  const form = useForm({ validate: yupResolver(schema[type]), initialValues: initialValues[type] });
  const ManualEntryView = orderView[type] ?? <div />;
  const bookingId = searchParam.get('id');
  const { data: bookingData, isLoading } = useBookingById(bookingId, !!bookingId);
  const { mutateAsync: generatePurchaseOrder } = useGeneratePurchaseOrder();
  const { mutateAsync: generateRelease } = useGenerateReleaseOrder();
  const { mutateAsync: generateInvoice } = useGenerateInvoice();

  const handleSubmit = formData => {
    const data = {
      ...formData,
    };
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    if (Object.keys(data).length === 0) return;

    if (type === 'purchase') {
      generatePurchaseOrder({ id: bookingId, data });
    } else if (type === 'release') {
      generateRelease({ id: bookingId, data });
    } else if (type === 'invoice') {
      generateInvoice({ id: bookingId, data });
    }
    form.reset();
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="pb-12">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <header className="h-[60px] border-b flex items-center justify-between pl-5 pr-7 sticky top-0 z-50 bg-white">
            <p className="font-bold text-lg">{`Create ${title[type]}`}</p>
            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border rounded-md p-2 text-black"
              >
                Cancel
              </Button>
              <Button type="submit" className="border rounded-md p-2 bg-purple-450 text-white">
                Create
              </Button>
            </div>
          </header>
          <ManualEntryView
            spacesList={bookingData?.campaign?.spaces}
            isSpaceListLoading={isLoading}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default Create;
