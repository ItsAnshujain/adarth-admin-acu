import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import PurchaseOrder from './PurchaseOrder';
import ReleaseOrder from './ReleaseOrder';
import Invoice from './Invoice';
import { FormProvider, useForm } from '../../../context/formContext';

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
  companyName: yup.string().trim().required('Company Name is required'),
  voucherNumber: yup.string().trim().required('Voucher No is required'),
  companyGst: yup.string().trim().required('GST is required'),
  companyStreetAddress: yup.string().trim().required('Street Address is required'),
  companyCity: yup.string().trim().required('City is required'),
  companyPin: yup.string().trim().required('Pin is required'),
  supplierName: yup.string().trim().required('Supplier Name is required'),
  supplierGst: yup.string().trim().required('GST is required'),
  supplierRef: yup.string().trim().required('Supplier Ref is required'),
  otherReferences: yup.string().trim().required('Other Reference(s) is required'),
  dispatchThrough: yup.string().trim().required('Dispatch Through is required'),
  destination: yup.string().trim().required('Destination is required'),
  supplierStreetAddress: yup.string().trim().required('Street Address is required'),
  supplierCity: yup.string().trim().required('City is required'),
  supplierPin: yup.string().trim().required('Pin is required'),
  termsOfDelivery: yup.string().trim().required('Terms of Delivery is required'),
  amountChargeable: yup.string().trim().required('Amount Chargeable is required'),
  signaturePhoto: yup.string().trim().required('Photo is required'),
});

const initialPurchaseValues = {
  companyName: '',
  voucherNumber: '',
  companyGst: '',
  companyStreetAddress: '',
  companyCity: '',
  companyPin: '',
  supplierName: '',
  supplierGst: '',
  supplierRef: '',
  otherReferences: '',
  dispatchThrough: '',
  destination: '',
  supplierStreetAddress: '',
  supplierCity: '',
  supplierPin: '',
  termsOfDelivery: '',
  amountChargeable: '',
  signaturePhoto: '',
};

const releaseSchema = yup.object({
  releaseOrderNumber: yup.string().trim().required('Release Order No is required'),
  companyName: yup.string().trim().required('Company Name is required'),
  quotationNumber: yup.string().trim().required('Quotation No is required'),
  contactPerson: yup.string().trim().required('Contact Person is required'),
  phone: yup.string().trim().required('Phone is required'),
  mobile: yup.string().trim().required('Mobile is required'),
  email: yup.string().trim().required('Email is required'),
  streetAddress: yup.string().trim().required('Street Address is required'),
  city: yup.string().trim().required('City is required'),
  pin: yup.string().trim().required('Pin is required'),
  supplierName: yup.string().trim().required('Supplier Name is required'),
  designation: yup.string().trim().required('Destination is required'),
  amountChargeable: yup.string().trim().required('Amount Chargeable is required'),
  signatureStampPhoto: yup.string().trim().required('Photo is required'),
  termsAndConditions: yup.string().trim().required('Terms & Conditions is required'),
});

const initialReleaseValues = {
  releaseOrderNumber: '',
  companyName: '',
  quotationNumber: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  email: '',
  supplierName: '',
  designation: '',
  signatureStampPhoto: '',
  amountChargebale: '',
  termsAndConditions: '',
};

const invoiceSchema = yup.object({
  invoiceNumber: yup.string().trim().required('Invoice No is required'),
  supplierName: yup.string().trim().required('Supplier Name is required'),
  supplierGst: yup.string().trim().required('GSTIN/UIN is required'),
  supplierStreetAddress: yup.string().trim().required('Street Address is required'),
  supplierCity: yup.string().trim().required('City is required'),
  supplierPin: yup.string().trim().required('Pin is required'),
  supplierContact: yup.string().trim().required('Contact is required'),
  supplierEmail: yup.string().trim().required('Email is required'),
  supplierRef: yup.string().trim().required('Supplier Ref is required'),
  otherReference: yup.string().trim().required('Other Reference(s) is required'),
  website: yup.string().trim().required('Website is required'),
  buyerName: yup.string().trim().required('Buyer Name is required'),
  contactPerson: yup.string().trim().required('Contact Person is required'),
  buyerContact: yup.string().trim().required('Contact is required'),
  buyerGst: yup.string().trim().required('GSTIN/UIN is required'),
  buyerStreetAddress: yup.string().trim().required('Street Address is required'),
  buyerCity: yup.string().trim().required('City is required'),
  buyerPin: yup.string().trim().required('Pin is required'),
  buyerOrderNumber: yup.string().trim().required('Buyers Order No. is required'),
  dispatchedDocNumber: yup.string().trim().required('Dispatched Document No. is required'),
  dispatchedThrough: yup.string().trim().required('Dispatched through is required'),
  destination: yup.string().trim().required('Destination is required'),
  deliveryNote: yup.string().trim().required('Delivery Note is required'),
  termsOfDelivery: yup.string().trim().required('Terms of Delivery is required'),
  amountChargeable: yup.string().trim().required('Amount Chargeable is required'),
  bankName: yup.string().trim().required('Bank Name is required'),
  acNumber: yup.string().trim().required('A/c No. is required'),
  branchIfscCode: yup.string().trim().required('Branch & IFSC Code is required'),
  modeTermOfPayment: yup.string().trim().required('Mode/Terms of Payment is required'),
  declaration: yup.string().trim().required('Declaration is required'),
});

const initialInvoiceValues = {
  invoiceNumber: '',
  supplierName: '',
  supplierGst: '',
  supplierStreetAddress: '',
  supplierCity: '',
  supplierPin: '',
  supplierContact: '',
  supplierEmail: '',
  supplierRef: '',
  otherReference: '',
  website: '',
  contactPerson: '',
  buyerName: '',
  buyerContact: '',
  buyerGst: '',
  buyerStreetAddress: '',
  buyerCity: '',
  buyerPin: '',
  buyerOrderNumber: '',
  dispatchedDocNumber: '',
  dispatchedThrough: '',
  destination: '',
  deliveryNote: '',
  termsOfDelivery: '',
  amountChargeable: '',
  bankName: '',
  acNumber: '',
  branchIfscCode: '',
  modeTermOfPayment: '',
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
  const { type } = useParams();
  const form = useForm({ validate: yupResolver(schema[type]), initialValues: initialValues[type] });
  const ManualEntryView = orderView[type] ?? <div />;

  const handleSubmit = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);
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
          <ManualEntryView />
        </form>
      </FormProvider>
    </div>
  );
};

export default Create;
