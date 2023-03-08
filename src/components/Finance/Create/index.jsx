import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Select } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import validator from 'validator';
import { useModals } from '@mantine/modals';
import PurchaseOrder from './PurchaseOrder';
import ReleaseOrder from './ReleaseOrder';
import Invoice from './Invoice';
import { FormProvider, useForm } from '../../../context/formContext';
import {
  useBookingById,
  useBookings,
  useGenerateInvoice,
  useGeneratePurchaseOrder,
  useGenerateReleaseOrder,
} from '../../../hooks/booking.hooks';
import {
  downloadPdf,
  gstRegexMatch,
  mobileRegexMatch,
  onlyNumbersMatch,
  serialize,
  temporaryInvoicePdfLink,
  temporaryPurchaseOrderPdfLink,
  temporaryReleaseOrderPdfLink,
} from '../../../utils';
import modalConfig from '../../../utils/modalConfig';
import PurchaseOrderPreview from './PurchaseOrderPreview';
import ReleaseOrderPreview from './ReleaseOrderPreview';
import InvoicePreview from './InvoicePreview';

const updatedModalConfig = { ...modalConfig, size: 'xl' };

const bookingStyles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
};

const orderView = {
  purchase: PurchaseOrder,
  release: ReleaseOrder,
  invoice: Invoice,
};

const preview = {
  purchase: PurchaseOrderPreview,
  release: ReleaseOrderPreview,
  invoice: InvoicePreview,
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
    .matches(gstRegexMatch, 'GST number must be valid and in uppercase')
    .required('GST is required'),
  supplierStreetAddress: yup.string().trim().required('Street Address is required'),
  supplierCity: yup.string().trim().required('City is required'),
  supplierZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  buyerName: yup.string().trim().required('Supplier Name is required'),
  buyerGst: yup
    .string()
    .trim()
    .matches(gstRegexMatch, 'GST number must be valid and in uppercase')
    .required('GST is required'),
  supplierRefNo: yup
    .string()
    .trim()
    .matches(onlyNumbersMatch, 'Must be a number')
    .required('Supplier Ref is required'),
  supplierOtherReference: yup.string().trim(),
  dispatchThrough: yup.string().trim(),
  destination: yup.string().trim(),
  buyerStreetAddress: yup.string().trim().required('Street Address is required'),
  buyerCity: yup.string().trim().required('City is required'),
  buyerZip: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Pin is required'),
  termOfDelivery: yup.string().trim().required('Terms of Delivery is required'),
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
  supplierRefNo: '',
  supplierOtherReference: '',
  dispatchThrough: '',
  destination: '',
  buyerStreetAddress: '',
  buyerCity: '',
  buyerZip: null,
  termOfDelivery: '',
  spaces: [],
};

const releaseSchema = yup.object({
  releaseOrderNo: yup
    .number()
    .positive('Must be a positive number')
    .typeError('Must be a number')
    .nullable()
    .required('Release Order No is required'),
  companyName: yup.string().trim().required('Company Name is required'),
  quotationNo: yup
    .string()
    .trim()
    .matches(onlyNumbersMatch, 'Must be a number')
    .required('Quotation No is required'),
  contactPerson: yup.string().trim().required('Contact Person is required'),
  phone: yup
    .string()
    .trim()
    // .test('valid', 'Must be a valid number', val => validator.isMobilePhone(val, 'en-IN'))
    .matches(mobileRegexMatch, { message: 'Must be a valid number', excludeEmptyString: true })
    .notRequired(),
  mobile: yup
    .string()
    .trim()
    .test('valid', 'Must be a valid number', val => validator.isMobilePhone(val, 'en-IN'))
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
  termsAndCondition: yup.string().trim(),
});

const initialReleaseValues = {
  releaseOrderNo: null,
  companyName: '',
  quotationNo: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  email: '',
  zip: null,
  supplierName: '',
  supplierDesignation: '',
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
    .test('valid', 'Must be a valid number', val => validator.isMobilePhone(val, 'en-IN'))
    .required('Contact is required'),
  supplierEmail: yup.string().trim().required('Email is required').email('Invalid Email'),
  supplierRefNo: yup
    .string()
    .trim()
    .matches(onlyNumbersMatch, 'Must be a number')
    .required('Supplier Ref is required'),
  supplierOtherReference: yup.string().trim(),
  supplierWebsite: yup.string().trim().url('Invalid URL'),
  buyerName: yup.string().trim().required('Buyer Name is required'),
  buyerContactPerson: yup.string().trim().required('Contact Person is required'),
  buyerPhone: yup
    .string()
    .trim()
    .test('valid', 'Must be a valid number', val => validator.isMobilePhone(val, 'en-IN'))
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
  buyerOrderNumber: yup
    .string()
    .trim()
    .matches(onlyNumbersMatch, 'Must be a number')
    .required('Buyers Order No. is required'),
  dispatchDocumentNumber: yup.string().trim().matches(onlyNumbersMatch, 'Must be a number'),
  dispatchThrough: yup.string().trim(),
  destination: yup.string().trim(),
  deliveryNote: yup.string().trim(),
  termOfDelivery: yup.string().trim().required('Terms of Delivery is required'),
  bankName: yup.string().trim().required('Bank Name is required'),
  accountNo: yup
    .string()
    .trim()
    .matches(onlyNumbersMatch, 'Must be digits only')
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

const bookingQueries = {
  page: 1,
  limit: 100,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};
const Create = () => {
  const modals = useModals();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const { type } = useParams();
  const form = useForm({ validate: yupResolver(schema[type]), initialValues: initialValues[type] });
  const ManualEntryView = orderView[type] ?? <div />;
  const PreviewView = preview[type] ?? <div />;
  const bookingId = searchParam.get('id');
  const [bookingIdFromFinance, setBookingIdFromFinance] = useState();

  const {
    data: bookingDatas,
    isLoading: isBookingDatasLoading,
    isSuccess: isBookingDatasLoaded,
  } = useBookings(serialize(bookingQueries));
  const { data: bookingData } = useBookingById(
    bookingId || bookingIdFromFinance,
    !!bookingId || !!bookingIdFromFinance,
  );
  const { mutateAsync: generatePurchaseOrder, isLoading: isGeneratePurchaseOrderLoading } =
    useGeneratePurchaseOrder();
  const { mutateAsync: generateReleaseOrder, isLoading: isGenerateReleaseOrderLoading } =
    useGenerateReleaseOrder();
  const { mutateAsync: generateInvoiceOrder, isLoading: isGenerateInvoiceOrderLoading } =
    useGenerateInvoice();

  const redirectToHome = () => setTimeout(() => navigate(-1), 2000);

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

  // TODO: preview integration left
  // eslint-disable-next-line no-unused-vars
  const toggleImagePreviewModal = (formData, spaces) =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <PreviewView
            previeData={formData}
            previewSpaces={spaces}
            totalPrice={calcutateTotalPrice || 0}
            type={type}
          />
        ),
      },
      ...updatedModalConfig,
    });

  const handleSubmit = async formData => {
    const data = { ...formData };
    // toggleImagePreviewModal(data, data?.spaces);

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
      data.spaces = form.values?.spaces?.map(item => ({
        id: item._id,
        per: +item.per || 1,
        dueOn: item.dueOn || new Date(),
      }));

      const purchaseOrderPdf = await generatePurchaseOrder(
        { id: bookingId || bookingIdFromFinance, data },
        { onSuccess: () => redirectToHome() },
      );
      if (purchaseOrderPdf?.generatedPdf?.Location) {
        // TODO: kept it for demo purpose will remove later
        // downloadPdf(purchaseOrderPdf.generatedPdf.Location);
        downloadPdf(temporaryPurchaseOrderPdfLink);
      }
    } else if (type === 'release') {
      if (data?.phone !== undefined && !data?.phone?.includes('+91')) {
        data.phone = `+91${data?.phone}`;
      }
      if (!data?.mobile?.includes('+91')) {
        data.mobile = `+91${data?.mobile}`;
      }
      const releaseOrderPdf = await generateReleaseOrder(
        { id: bookingId || bookingIdFromFinance, data },
        { onSuccess: () => redirectToHome() },
      );
      if (releaseOrderPdf?.generatedPdf?.Location) {
        // TODO: kept it for demo purpose will remove later
        // downloadPdf(releaseOrderPdf.generatedPdf.Location);
        downloadPdf(temporaryReleaseOrderPdfLink);
      }
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
      const invoicePdf = await generateInvoiceOrder(
        { id: bookingId || bookingIdFromFinance, data },
        { onSuccess: () => redirectToHome() },
      );
      if (invoicePdf?.generatedPdf?.Location) {
        // TODO: kept it for demo purpose will remove later
        // downloadPdf(invoicePdf.generatedPdf.Location);
        downloadPdf(temporaryInvoicePdfLink);
      }
    }
    form.reset();
  };

  const handleBack = () => navigate(-1);

  useEffect(() => {
    if (bookingId) setBookingIdFromFinance(bookingId);
  }, [bookingId]);

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
                className="primary-button mr-2"
                variant="filled"
                loading={
                  isGeneratePurchaseOrderLoading ||
                  isGenerateReleaseOrderLoading ||
                  isGenerateInvoiceOrderLoading
                }
                disabled={
                  isGeneratePurchaseOrderLoading ||
                  isGenerateReleaseOrderLoading ||
                  isGenerateInvoiceOrderLoading ||
                  !bookingIdFromFinance
                }
                // TODO: remove after manual entry api
              >
                Create
              </Button>
            </div>
          </header>
          <div className="pl-5 pr-7 pt-4 pb-8 border-b">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Booking List (Please select a Booking before creating an order)"
                // TODO: remove after manual entry api
                withAsterisk={!bookingIdFromFinance}
                className="w-full"
                styles={bookingStyles}
                value={bookingId || bookingIdFromFinance}
                disabled={bookingId || isBookingDatasLoading}
                placeholder="Select..."
                onChange={setBookingIdFromFinance}
                data={
                  isBookingDatasLoaded
                    ? bookingDatas.docs.map(bookingItem => ({
                        label: bookingItem?.campaign?.name,
                        value: bookingItem?._id,
                      }))
                    : []
                }
              />
            </div>
          </div>
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
