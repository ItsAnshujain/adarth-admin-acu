import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Modal, Select } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import validator from 'validator';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import PurchaseOrder from '../../components/Finance/Create/PurchaseOrder';
import ReleaseOrder from '../../components/Finance/Create/ReleaseOrder';
import Invoice from '../../components/Finance/Create/Invoice';
import { FormProvider, useForm } from '../../context/formContext';
import {
  useBookingById,
  useBookings,
  useGenerateInvoice,
  useGenerateManualPurchaseOrder,
  useGenerateManualReleaseOrder,
  useGenerateManualInvoice,
  useGeneratePurchaseOrder,
  useGenerateReleaseOrder,
} from '../../hooks/booking.hooks';
import {
  downloadPdf,
  gstRegexMatch,
  mobileRegexMatch,
  onlyNumbersMatch,
  serialize,
  orderTitle,
} from '../../utils';
import modalConfig from '../../utils/modalConfig';
import PurchaseOrderPreview from '../../components/Finance/Create/PurchaseOrderPreview';
import ReleaseOrderPreview from '../../components/Finance/Create/ReleaseOrderPreview';
import InvoicePreview from '../../components/Finance/Create/InvoicePreview';
import ManualEntryContent from './ManualEntryContent';

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

const Home = () => {
  const modals = useModals();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const { type } = useParams();
  const form = useForm({ validate: yupResolver(schema[type]), initialValues: initialValues[type] });

  const ManualEntryView = orderView[type] ?? <div />;
  const Preview = preview[type] ?? <div />;

  const bookingId = searchParam.get('id');

  const [opened, { open, close }] = useDisclosure(false);
  const [bookingIdFromFinance, setBookingIdFromFinance] = useState();
  const [addSpaceItem, setAddSpaceItem] = useState([]);
  const [previewData] = useState();

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
  const { mutateAsync: generateInvoice, isLoading: isGenerateInvoiceLoading } =
    useGenerateInvoice();

  const {
    mutateAsync: generateManualPurchaseOrder,
    isLoading: isGenerateManualPurchaseOrderLoading,
  } = useGenerateManualPurchaseOrder();
  const {
    mutateAsync: generateManualReleaseOrder,
    isLoading: isGenerateManualReleaseOrderLoading,
  } = useGenerateManualReleaseOrder();
  const { mutateAsync: generateManualInvoice, isLoading: isGenerateManualInvoiceLoading } =
    useGenerateManualInvoice();

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

  const toggleAddItemModal = item =>
    modals.openContextModal('basic', {
      title: 'Manual Entry',
      innerProps: {
        modalBody: (
          <ManualEntryContent
            onClose={() => modals.closeModal()}
            setAddSpaceItem={setAddSpaceItem}
            addSpaceItem={addSpaceItem}
            item={item}
            type={type}
          />
        ),
      },
      ...updatedModalConfig,
    });

  // TODO: preview integration left
  // eslint-disable-next-line no-unused-vars
  const toggleFormPreviewModal = (formData, spaces) =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Preview
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
    // toggleFormPreviewModal(data, data?.spaces);

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
      if (bookingIdFromFinance) {
        data.spaces = addSpaceItem?.map(item => ({
          id: item._id,
          per: +item.per || 1,
          dueOn: item.dueOn || new Date(),
        }));

        const purchaseOrderPdf = await generatePurchaseOrder(
          { id: bookingId || bookingIdFromFinance, data },
          { onSuccess: () => redirectToHome() },
        );
        if (purchaseOrderPdf?.generatedPdf?.Location) {
          downloadPdf(purchaseOrderPdf.generatedPdf.Location);
        }
      } else {
        data.spaces = addSpaceItem?.map((item, index) => ({
          name: item.name,
          location: item.location,
          titleDate: item.titleDate,
          dueOn: item.dueOn,
          quantity: item.quantity,
          rate: item.rate,
          per: item.per,
          price: item.price,
          index: index + 1,
        }));

        if (!data.spaces.length) {
          showNotification({
            title: 'Please create atleast one Order Item to continue',
          });
          return;
        }

        await generateManualPurchaseOrder(data);
      }
    } else if (type === 'release') {
      if (data?.phone !== undefined && !data?.phone?.includes('+91')) {
        data.phone = `+91${data?.phone}`;
      }
      if (!data?.mobile?.includes('+91')) {
        data.mobile = `+91${data?.mobile}`;
      }

      if (bookingIdFromFinance) {
        const releaseOrderPdf = await generateReleaseOrder(
          { id: bookingId || bookingIdFromFinance, data },
          { onSuccess: () => redirectToHome() },
        );
        if (releaseOrderPdf?.generatedPdf?.Location) {
          downloadPdf(releaseOrderPdf.generatedPdf.Location);
        }
      } else {
        data.spaces = addSpaceItem?.map((item, index) => ({
          location: item.location,
          area: item.area,
          city: item.city,
          displayCost: item.displayCost,
          height: item.height,
          media: item.media,
          mountingCost: item.mountingCost,
          printingCost: item.printingCost,
          width: item.width,
          index: index + 1,
        }));

        if (!data.spaces.length) {
          showNotification({
            title: 'Please create atleast one Order Item to continue',
          });
          return;
        }
      }
      data.grandTotal = 100;
      data.grandTotalInWords = 'zero';
      data.printingSqftCost = 10;
      data.mountingSqftCost = 10;

      await generateManualReleaseOrder(data);
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

      if (bookingIdFromFinance) {
        const invoicePdf = await generateInvoice(
          { id: bookingId || bookingIdFromFinance, data },
          { onSuccess: () => redirectToHome() },
        );
        if (invoicePdf?.generatedPdf?.Location) {
          downloadPdf(invoicePdf.generatedPdf.Location);
        }
      } else {
        data.spaces = addSpaceItem?.map((item, index) => ({
          name: item.name,
          location: item.location,
          titleDate: item.titleDate,
          dueOn: item.dueOn,
          quantity: item.quantity,
          rate: item.rate,
          per: item.per,
          price: item.price,
          index: index + 1,
        }));

        if (!data.spaces.length) {
          showNotification({
            title: 'Please create atleast one Order Item to continue',
          });
          return;
        }
      }

      await generateManualInvoice(data);
    }
    form.reset();
  };

  const handleBack = () => navigate(-1);

  const updatedBookingsList = useMemo(() => {
    let arr = [{ label: 'Select', value: '' }];
    if (isBookingDatasLoaded && bookingDatas) {
      if (bookingDatas?.docs) {
        arr = [
          ...arr,
          ...bookingDatas.docs.map(bookingItem => ({
            label: bookingItem?.campaign?.name,
            value: bookingItem?._id,
          })),
        ];
      }

      return arr;
    }
    return [];
  }, [bookingDatas]);

  useEffect(() => {
    if (bookingId) setBookingIdFromFinance(bookingId);
  }, [bookingId]);

  useEffect(() => {
    if (bookingData?.campaign?.spaces) {
      setAddSpaceItem(bookingData?.campaign?.spaces);
    }
  }, [bookingData]);

  useEffect(() => {
    if (bookingIdFromFinance === '') {
      setAddSpaceItem([]);
    }
  }, [bookingIdFromFinance]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <div className="pb-12">
        <FormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <header className="h-[60px] border-b flex items-center justify-between pl-5 pr-7 sticky top-0 z-50 bg-white">
              <p className="font-bold text-lg">{`Create ${orderTitle[type]}`}</p>
              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  disabled={
                    isGeneratePurchaseOrderLoading ||
                    isGenerateReleaseOrderLoading ||
                    isGenerateInvoiceLoading ||
                    isGenerateManualPurchaseOrderLoading ||
                    isGenerateManualReleaseOrderLoading ||
                    isGenerateManualInvoiceLoading
                  }
                >
                  Cancel
                </Button>
                <Button className="secondary-button" onClick={open}>
                  Preview
                </Button>
                <Button
                  type="submit"
                  className="primary-button mr-2"
                  variant="filled"
                  loading={
                    isGeneratePurchaseOrderLoading ||
                    isGenerateReleaseOrderLoading ||
                    isGenerateInvoiceLoading ||
                    isGenerateManualPurchaseOrderLoading ||
                    isGenerateManualReleaseOrderLoading ||
                    isGenerateManualInvoiceLoading
                  }
                  disabled={
                    isGeneratePurchaseOrderLoading ||
                    isGenerateReleaseOrderLoading ||
                    isGenerateInvoiceLoading ||
                    isGenerateManualPurchaseOrderLoading ||
                    isGenerateManualReleaseOrderLoading ||
                    isGenerateManualInvoiceLoading
                  }
                >
                  Create
                </Button>
              </div>
            </header>
            <div className="pl-5 pr-7 pt-4 pb-8 border-b">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Booking List (Please select a Booking before creating an order)"
                  className="w-full"
                  styles={bookingStyles}
                  value={bookingId || bookingIdFromFinance}
                  disabled={bookingId || isBookingDatasLoading}
                  placeholder="Select..."
                  onChange={e => {
                    // eslint-disable-next-line no-alert
                    const willChange = window.confirm(
                      'Order item details if added, will get cleared if you change a booking',
                    );
                    if (willChange) {
                      setBookingIdFromFinance(e);
                    }
                  }}
                  data={updatedBookingsList}
                />
              </div>
            </div>
            <ManualEntryView
              totalPrice={calcutateTotalPrice || 0}
              onClickAddItems={data => toggleAddItemModal(data)}
              bookingIdFromFinance={bookingIdFromFinance}
              addSpaceItem={addSpaceItem}
              setAddSpaceItem={setAddSpaceItem}
            />
          </form>
        </FormProvider>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        title="Manual Entry"
        centered
        size="xl"
        overlayBlur={3}
        overlayOpacity={0.55}
        radius={0}
        padding={0}
        classNames={{
          title: 'font-dmSans text-xl px-4',
          header: 'px-4 pt-4',
          body: 'pb-4',
          close: 'mr-4',
        }}
      >
        <Preview
          previewData={previewData}
          previewSpaces={addSpaceItem}
          totalPrice={calcutateTotalPrice || 0}
          type={type}
        />
      </Modal>
    </div>
  );
};

export default Home;
