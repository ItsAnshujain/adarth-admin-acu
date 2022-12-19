import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useMemo } from 'react';
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
import { downloadPdf, gstRegexMatch, mobileRegexMatch } from '../../../utils';

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
  supplierName: yup.string().trim().required('Company Name is required'),
  invoiceNo: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Voucher No is required'),
  supplierGst: yup
    .string()
    .trim()
    .matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
  supplierStreetAddress: yup.string().trim().required('Street Address is required'),
  supplierCity: yup.string().trim().required('City is required'),
  supplierZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  buyerName: yup.string().trim().required('Supplier Name is required'),
  buyerGst: yup.string().trim().matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
  buyerRefNo: yup.string().trim().required('Supplier Ref is required'), // TODO: key missing and should be buyerRefNo
  buyerOtherReference: yup.string().trim().required('Other Reference(s) is required'), // TODO: key missing and should be buyerOtherReference
  dispatchThrough: yup.string().trim().required('Dispatch Through is required'),
  destination: yup.string().trim().required('Destination is required'),
  buyerStreetAddress: yup.string().trim().required('Street Address is required'),
  buyerCity: yup.string().trim().required('City is required'),
  buyerZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  termOfDelivery: yup.string().trim().required('Terms of Delivery is required'),
  signature: yup.string().trim().required('Signature is required'),
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
    .nullable()
    .required('Release Order No is required'),
  companyName: yup.string().trim().required('Company Name is required'),
  quotationNumber: yup.string().trim().required('Company Name is required'),
  contactPerson: yup.string().trim().required('Contact Person is required'),
  phone: yup
    .string()
    .trim()
    .matches(mobileRegexMatch, 'Must be a valid number')
    .required('Phone is required'),
  mobile: yup
    .string()
    .trim()
    .matches(mobileRegexMatch, 'Must be a valid number')
    .required('Mobile is required'),
  email: yup.string().trim().required('Email is required').email('Invalid Email'),
  streetAddress: yup.string().trim().required('Street Address is required'),
  city: yup.string().trim().required('City is required'),
  zip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  supplierName: yup.string().trim().required('Supplier Name is required'),
  supplierDesignation: yup.string().trim().required('Designation is required'),
  signature: yup.string().trim().required('Signature is required'),
  termsAndCondition: yup.string().trim().required('Terms and Condition is required'),
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
  termsAndCondition: '',
};

const invoiceSchema = yup.object({
  invoiceNo: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Invoice No is required'),
  supplierName: yup.string().trim().required('Supplier Name is required'),
  supplierGst: yup
    .string()
    .trim()
    .matches(gstRegexMatch, 'GST number must be valid and in uppercase')
    .required('GST number is required'),
  supplierStreetAddress: yup.string().trim().required('Street Address is required'),
  supplierCity: yup.string().trim().required('City is required'),
  supplierZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  supplierPhone: yup
    .string()
    .trim()
    .matches(mobileRegexMatch, 'Must be a valid number')
    .required('Contact is required'),
  supplierEmail: yup.string().trim().required('Email is required').email('Invalid Email'),
  supplierRefNo: yup.string().trim().required('Supplier Ref is required'),
  supplierOtherReference: yup.string().trim().required('Other Reference(s) is required'),
  supplierWebsite: yup.string().trim().required('Website is required').url('Invalid URL'),
  buyerName: yup.string().trim().required('Buyer Name is required'),
  buyerContactPerson: yup.string().trim().required('Contact Person is required'),
  buyerPhone: yup
    .string()
    .trim()
    .matches(mobileRegexMatch, 'Must be a valid number')
    .required('Contact is required'),
  buyerGst: yup
    .string()
    .trim()
    .matches(gstRegexMatch, 'GST number must be valid and in uppercase')
    .required('GST number is required'),
  buyerStreetAddress: yup.string().trim().required('Street Address is required'),
  buyerCity: yup.string().trim().required('City is required'),
  buyerZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  buyerOrderNumber: yup.string().trim().required('Buyers Order No. is required'),
  dispatchDocumentNumber: yup.string().trim().required('Dispatched Document No. is required'),
  dispatchThrough: yup.string().trim().required('Dispatched through is required'),
  destination: yup.string().trim().required('Destination is required'),
  deliveryNote: yup.string().trim().required('Delivery Note is required'),
  termOfDelivery: yup.string().trim().required('Terms of Delivery is required'),
  bankName: yup.string().trim().required('Bank Name is required'),
  accountNo: yup
    .string()
    .trim()
    .matches(/^[0-9]*$/, 'Must be digits only')
    .required('A/c No. is required'),
  ifscCode: yup.string().trim().required('Branch & IFSC Code is required'),
  modeOfPayment: yup.string().trim().required('Mode/Terms of Payment is required'),
  declaration: yup.string().trim().required('Declaration is required'),
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
  const { data: bookingData } = useBookingById(bookingId, !!bookingId);
  const { mutateAsync: generatePurchaseOrder, isLoading: isGeneratePurchaseOrderLoading } =
    useGeneratePurchaseOrder();
  const { mutateAsync: generateReleaseOrder, isLoading: isGenerateReleaseOrderLoading } =
    useGenerateReleaseOrder();
  const { mutateAsync: generateInvoiceOrder, isLoading: isGenerateInvoiceOrderLoading } =
    useGenerateInvoice();

  const calcutateTotalPrice = useMemo(() => {
    const initialPrice = 0;
    if (bookingData?.campaign?.spaces?.length > 0) {
      return bookingData?.campaign?.spaces
        .map(item =>
          item?.basicInformation?.price ? Number.parseInt(item.basicInformation.price, 10) : 0,
        )
        .reduce((previousValue, currentValue) => previousValue + currentValue, initialPrice);
    }
    return initialPrice;
  }, [bookingData?.campaign?.spaces]);

  const handleSubmit = async formData => {
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
      if (data?.supplierGst) {
        data.supplierGst = data.supplierGst?.toUpperCase();
      }
      if (data?.buyerGst) {
        data.buyerGst = data.buyerGst?.toUpperCase();
      }
      const purchaseOrderPdf = await generatePurchaseOrder({ id: bookingId, data });
      if (purchaseOrderPdf?.generatedPdf?.Location)
        downloadPdf(purchaseOrderPdf.generatedPdf.Location);
    } else if (type === 'release') {
      if (!data?.phone?.includes('+91')) {
        data.phone = `+91${data?.phone}`;
      }
      if (!data?.mobile?.includes('+91')) {
        data.mobile = `+91${data?.mobile}`;
      }
      const releaseOrderPdf = await generateReleaseOrder({ id: bookingId, data });
      if (releaseOrderPdf?.generatedPdf?.Location)
        downloadPdf(releaseOrderPdf.generatedPdf.Location);
    } else if (type === 'invoice') {
      if (!data?.supplierPhone?.includes('+91')) {
        data.supplierPhone = `+91${data?.supplierPhone}`;
      }
      if (!data?.buyerPhone?.includes('+91')) {
        data.buyerPhone = `+91${data?.buyerPhone}`;
      }
      if (data?.supplierGst) {
        data.supplierGst = data.supplierGst?.toUpperCase();
      }
      if (data?.buyerGst) {
        data.buyerGst = data.buyerGst?.toUpperCase();
      }
      const invoicePdf = await generateInvoiceOrder({ id: bookingId, data });
      if (invoicePdf?.generatedPdf?.Location) downloadPdf(invoicePdf.generatedPdf.Location);
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
                disabled={
                  isGeneratePurchaseOrderLoading ||
                  isGenerateReleaseOrderLoading ||
                  isGenerateInvoiceOrderLoading
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="border rounded-md p-2 bg-purple-450 text-white"
                loading={
                  isGeneratePurchaseOrderLoading ||
                  isGenerateReleaseOrderLoading ||
                  isGenerateInvoiceOrderLoading
                }
                disabled={
                  isGeneratePurchaseOrderLoading ||
                  isGenerateReleaseOrderLoading ||
                  isGenerateInvoiceOrderLoading
                }
              >
                Create
              </Button>
            </div>
          </header>
          <ManualEntryView
            spacesList={bookingData?.campaign?.spaces}
            totalPrice={calcutateTotalPrice || 0}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default Create;
