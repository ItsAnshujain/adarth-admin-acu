import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import validator from 'validator';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import BasicInformationForm from '../../components/modules/bookings/Create/BasicInformationForm';
import SelectSpaces from '../../components/modules/bookings/Create/SelectSpaces';
import OrderInformationForm from '../../components/modules/bookings/Create/OrderInformationForm';
import SuccessModal from '../../components/shared/Modal';
import Header from '../../components/modules/bookings/Create/Header';
import {
  useBookingById,
  useCreateBookings,
  useUpdateBooking,
} from '../../apis/queries/booking.queries';
import {
  gstRegexMatch,
  panRegexMatch,
  isValidURL,
  serialize,
  calculateTotalPrice,
} from '../../utils';
import { useFetchProposalById } from '../../apis/queries/proposal.queries';

const defaultValues = {
  client: {
    companyName: '',
    name: '',
    email: '',
    contactNumber: '',
    panNumber: '',
    gstNumber: '',
  },
  campaignName: '',
  description: '',
  place: [],
  price: 0,
  industry: '',
  // industry: '63f9c30b1a5afbaafe11b0c1',
  displayBrands: '',
};

const basicInformationSchema = yup.object({
  client: yup.object({
    companyName: yup.string().trim().required('Company name is required'),
    name: yup.string().trim().required('Client name is required'),
    email: yup.string().trim().email('Email must be valid'),
    contactNumber: yup
      .string()
      .trim()
      .test('valid', 'Contact Number must be valid', val => {
        if (val) {
          return validator.isMobilePhone(val, 'en-IN');
        }

        return true;
      }),
    panNumber: yup
      .string()
      .trim()
      .matches(panRegexMatch, 'Pan number must be valid and in uppercase'),
    gstNumber: yup
      .string()
      .trim()
      .matches(gstRegexMatch, 'GST number must be valid and in uppercase'),
  }),
  paymentReference: yup.string().trim(),
  paymentType: yup.string().trim(),
});

const campaignInformationSchema = yup.object({
  campaignName: yup.string().trim().required('Campaign name is required'),
  description: yup.string().trim(),
  industry: yup.string().trim().required('Industry is required'),
});

const schemas = [basicInformationSchema, campaignInformationSchema, yup.object()];

const proposalByIdQuery = {
  owner: 'all',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'asc',
};

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: bookingId } = useParams();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [searchParams] = useSearchParams(proposalByIdQuery);

  const [formStep, setFormStep] = useState(1);
  const form = useForm({ resolver: yupResolver(schemas[formStep - 1]), defaultValues });
  const createBooking = useCreateBookings();
  const updateBooking = useUpdateBooking();
  const bookingById = useBookingById(bookingId, !!bookingId);

  const proposalId = searchParams.get('proposalId');
  const proposalLimit = searchParams.get('proposalLimit');
  const proposalById = useFetchProposalById(
    `${proposalId}?${serialize({ ...proposalByIdQuery, limit: proposalLimit })}`,
    !!proposalId,
  );

  const watchPlace = form.watch('place') || [];

  const handleSubmit = form.handleSubmit(async formData => {
    setFormStep(prevState => prevState + 1);
    if (formStep === 3) {
      const data = { ...formData };

      setFormStep(3);
      if (!watchPlace?.length) {
        showNotification({
          title: 'Please select atleast one place to continue',
          color: 'blue',
        });
        return;
      }

      let minDate = null;
      let maxDate = null;

      const totalImpressionAndHealth = data.place.reduce(
        (acc, item) => ({
          maxImpression: acc.maxImpression + item.impressionMax,
          minImpression: acc.minImpression + item.impressionMin,
        }),
        {
          maxImpression: 0,
          minImpression: 0,
        },
      );

      if (data.place.some(item => !(item.startDate || item.endDate))) {
        showNotification({
          title: 'Please select the occupancy date to continue',
          color: 'blue',
        });
        return;
      }

      if (
        data.place?.some(item =>
          bookingId
            ? item.unit > item.initialUnit + item.availableUnit
            : item.unit > item.availableUnit,
        )
      ) {
        showNotification({
          title: 'Exceeded maximum units available for selected date range for one or more places',
          color: 'blue',
        });
        return;
      }
      data.place = watchPlace?.map(item => ({
        ...item,
        id: item._id,
        price: +item.price,
        media: isValidURL(item.media) ? item.media : undefined,
        startDate: item.startDate
          ? dayjs(item.startDate).startOf('day').toISOString()
          : dayjs().startOf('day').toISOString(),
        endDate: item.endDate
          ? dayjs(item.endDate).endOf('day').toISOString()
          : dayjs().endOf('day').toISOString(),
        tradedAmount: item?.tradedAmount ? +item.tradedAmount : 0,
        unit: item?.unit ? +item.unit : 1,
      }));

      if (data.place.some(item => item.price === 0 || !item.price)) {
        showNotification({
          title: 'One of your space price is zero. Please add the price to continue',
          color: 'blue',
        });
        return;
      }

      data.place.forEach(item => {
        const start = item.startDate;
        const end = item.endDate;

        if (!minDate) minDate = start;
        if (!maxDate) maxDate = end;

        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;
      });

      if (data?.client?.panNumber) {
        data.client.panNumber = data.client.panNumber?.toUpperCase();
      }
      if (data?.client?.gstNumber) {
        data.client.gstNumber = data.client.gstNumber?.toUpperCase();
      }
      if (data?.displayBrands) {
        data.displayBrands = [data.displayBrands];
      }

      const totalPrice = calculateTotalPrice(watchPlace);
      const gstCalculation = totalPrice * 0.18;
      data.price = totalPrice + gstCalculation;

      Object.keys(data).forEach(k => {
        if (data[k] === '') {
          delete data[k];
        }
      });

      Object.keys(data.client).forEach(k => {
        if (data.client[k] === '') {
          delete data.client[k];
        }
      });

      if (bookingId) {
        updateBooking.mutate(
          {
            id: bookingId,
            data: {
              ...data,
              ...totalImpressionAndHealth,
              startDate: minDate,
              endDate: maxDate,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['bookings']);
              form.reset();
              setTimeout(() => {
                navigate('/bookings');
              }, 1000);
            },
          },
        );
      } else {
        createBooking.mutate(
          {
            ...data,
            ...totalImpressionAndHealth,
            startDate: minDate,
            endDate: maxDate,
            proposalId: proposalId || null,
          },
          {
            onSuccess: () => {
              setOpenSuccessModal(true);
              setTimeout(() => {
                navigate('/bookings');
                form.reset();
              }, 2000);
            },
          },
        );
      }
    }
  });

  const getForm = useCallback(
    () =>
      formStep === 1 ? (
        <BasicInformationForm />
      ) : formStep === 2 ? (
        <OrderInformationForm />
      ) : (
        <SelectSpaces />
      ),
    [formStep],
  );

  useEffect(() => {
    if (bookingById.data) {
      const { client, displayBrands, campaign } = bookingById.data;

      form.reset({
        // ...form.values,
        client: {
          companyName: client?.companyName || '',
          name: client?.name || '',
          email: client?.email || '',
          contactNumber: client?.contactNumber || '',
          panNumber: client?.panNumber || '',
          gstNumber: client?.gstNumber || '',
        },
        campaignName: campaign?.name || '',
        description: campaign?.description || '',
        place:
          campaign?.spaces?.map(item => ({
            ...item,
            location: item?.location?.city,
            dimension: item?.specifications?.size,
            _id: item._id,
            price: +item.campaignPrice,
            media: isValidURL(item.media) ? item.media : undefined,
            tradedAmount: item?.tradedAmount ? item.tradedAmount : 0,
            availableUnit:
              item?.specifications?.unit && item.unit
                ? item.specifications.unit - item.unit
                : item.unit,
            initialUnit: item?.unit || 0,
          })) || [],
        industry: campaign?.industry?._id || '',
        displayBrands: displayBrands?.[0] || '',
        price: campaign?.price || 0,
      });
    }
  }, [bookingById.data]);

  useEffect(() => {
    if (proposalById.data) {
      form.reset({
        // ...form.values,
        campaignName: proposalById.data?.proposal?.name || '',
        description: proposalById.data?.proposal?.description || '',
        place: proposalById.data?.inventories.docs.map(item => ({
          _id: item._id,
          price: item.price,
          media: isValidURL(item.media) ? item.media : undefined,
          startDate: item.startDate,
          endDate: item.endDate,
          tradedAmount: item?.tradedAmount ? item.tradedAmount : 0,
          unit: item?.bookedUnits,
          availableUnit: item?.remainingUnits,
          initialUnit: item?.bookedUnits || 0,
        })),
      });
    }
  }, [proposalById.data]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <Header
            setFormStep={setFormStep}
            formStep={formStep}
            isLoading={createBooking.isLoading || updateBooking.isLoading}
            isEditable={!!bookingId}
          />
          {getForm()}
        </form>
      </FormProvider>
      <SuccessModal
        title="Order Successfully Created"
        prompt="Visit Order List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="bookings"
      />
    </div>
  );
};

export default CreateBookingPage;
