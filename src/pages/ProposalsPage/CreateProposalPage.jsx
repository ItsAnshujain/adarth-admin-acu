import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BasicInfo from '../../components/modules/proposals/CreateProposal/BasicInfo';
import Spaces from '../../components/modules/proposals/Spaces';
import SuccessModal from '../../components/shared/Modal';
import Header from '../../components/modules/proposals/CreateProposal/Header';
import {
  useCreateProposal,
  useUpdateProposal,
  useFetchProposalById,
} from '../../apis/queries/proposal.queries';
import { useFetchUsersById } from '../../apis/queries/users.queries';
import { useFetchMasters } from '../../apis/queries/masters.queries';
import { serialize } from '../../utils';
import useUserStore from '../../store/user.store';

const initialValues = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
  spaces: [],
  letterHead: '',
  letterFooter: '',
  uploadType: 'new',
};

const schema = yup.object({
  name: yup.string().trim().required('Name is required'),
  description: yup.string().trim(),
  status: yup.string().trim(),
  letterHead: yup.string().trim().nullable(),
  letterFooter: yup.string().trim().nullable(),
});

const CreateProposalPage = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  const navigate = useNavigate();
  const { id: proposalId } = useParams();
  const userId = useUserStore(state => state.id);

  const [query] = useState({
    owner: 'all',
    page: 1,
    limit: 30,
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });

  const { data: userData } = useFetchUsersById(userId);
  const { mutate: create, isLoading: isCreateProposalLoading } = useCreateProposal();
  const { mutate: update, isLoading: isUpdateProposalLoading } = useUpdateProposal();
  const { data: proposalData } = useFetchProposalById(
    `${proposalId}?${serialize(query)}`,
    !!proposalId,
  );
  const watchSpaces = form.watch('spaces');
  const { data: proposalStatusData } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  const getForm = () =>
    formStep === 1 ? <BasicInfo proposalId={proposalId} userData={userData} /> : <Spaces />;

  const onSubmit = form.handleSubmit(formData => {
    let data = {};
    data = { ...formData };
    setFormStep(2);
    if (formStep === 2) {
      if (!watchSpaces.length) {
        showNotification({
          title: 'Please select atleast one space to continue',
          color: 'blue',
        });
        return;
      }

      if (
        data.spaces?.some(item =>
          proposalId
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

      data.spaces = watchSpaces.map(item => ({
        ...item,
        id: item._id,
        price: +item.price.toFixed(2) || 0,
        startDate: item.startDate
          ? dayjs(item.startDate).startOf('day').toISOString()
          : dayjs().startOf('day').toISOString(),
        endDate: item.startDate
          ? dayjs(item.endDate).endOf('day').toISOString()
          : dayjs().endOf('day').toISOString(),
        unit: item?.unit ? +item.unit : 1,
      }));

      if (data.uploadType === 'existing') {
        data.letterHead = userData?.proposalHead;
        data.letterFooter = userData?.proposalFooter;
      }

      Object.keys(data).forEach(key => {
        if (data[key] === undefined) {
          delete data[key];
        }
      });

      if (data.spaces.some(item => !(item.startDate || item.endDate))) {
        showNotification({
          title: 'Please select the proposal date to continue',
          color: 'blue',
        });
        return;
      }

      let minDate = null;
      let maxDate = null;

      data.spaces.forEach(item => {
        const start = item.startDate;
        const end = item.endDate;

        if (!minDate) minDate = start;
        if (!maxDate) maxDate = end;

        if (start < minDate) minDate = start;
        if (end > maxDate) maxDate = end;
      });

      delete data.uploadType;

      if (proposalId) {
        data = {
          ...data,
          startDate: dayjs(minDate).startOf('day').toISOString(),
          endDate: dayjs(maxDate).endOf('day').toISOString(),
        };

        update(
          { proposalId, data },
          {
            onSuccess: () => {
              setTimeout(() => {
                navigate('/proposals');
                form.reset();
              }, 2000);
            },
          },
        );
      } else {
        const status = proposalStatusData?.docs?.filter(
          item => item?.name?.toLowerCase() === 'created',
        )[0]?._id;

        data = {
          ...data,
          status,
          startDate: dayjs(minDate).startOf('day').toISOString(),
          endDate: dayjs(maxDate).endOf('day').toISOString(),
        };

        create(data, {
          onSuccess: () => {
            setTimeout(() => {
              navigate('/proposals');
              form.reset();
            }, 2000);
          },
        });
      }
    }
  });

  useEffect(() => {
    if (proposalData) {
      console.log(proposalData);
      form.reset({
        ...form.values,
        name: proposalData?.proposal?.name,
        description: proposalData?.proposal?.description || '',
        status: proposalData?.proposal?.status,
        startDate: proposalData?.proposal?.startDate
          ? new Date(proposalData.proposal.startDate)
          : new Date(),
        endDate: proposalData?.proposal?.endDate
          ? new Date(proposalData.proposal.endDate)
          : new Date(),
        spaces:
          proposalData?.inventories.docs.map(item => ({
            ...item,
            ...item.pricingDetails,
            _id: item._id,
            price: item.price,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            unit: item?.bookedUnits,
            availableUnit: item?.remainingUnits,
            initialUnit: item?.bookedUnits || 0,
            dimension: item.size,
          })) || [],
        letterHead: proposalData?.proposal?.letterHead,
        letterFooter: proposalData?.proposal?.letterFooter,
        proposalTermsId: proposalData?.proposal?.proposalTermsId?._id,
      });
    }
  }, [proposalData, userData]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <div className="h-[60px] border-b border-gray-450 flex justify-between items-center">
            <Header
              setFormStep={setFormStep}
              formStep={formStep}
              isProposalLoading={isCreateProposalLoading || isUpdateProposalLoading}
              isEditable={!!proposalId}
              proposalId={proposalId}
            />
          </div>
          {getForm()}
        </form>
      </FormProvider>
      <SuccessModal
        title="Proposal Successfully Created"
        prompt="Visit Proposals"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="proposals"
      />
    </div>
  );
};

export default CreateProposalPage;
