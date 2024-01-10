import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { yupResolver } from '@mantine/form';
import dayjs from 'dayjs';
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
import { FormProvider, useForm } from '../../context/formContext';
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
  letterHead: yup
    .string()
    .trim()
    .when('uploadType', {
      is: val => val === 'new',
      then: yup.string().trim().required('Letter Head is Required'),
      otherwise: yup.string().trim(),
    }),
  letterFooter: yup
    .string()
    .trim()
    .when('uploadType', {
      is: val => val === 'new',
      then: yup.string().nullable().trim().required('Letter Footer is Required'),
      otherwise: yup.string().trim(),
    }),
});

const CreateProposalPage = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema), initialValues });
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

  const { data: proposalStatusData } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 100, page: 1 }),
  );

  const getForm = () =>
    formStep === 1 ? <BasicInfo proposalId={proposalId} userData={userData} /> : <Spaces />;

  const onSubmit = formData => {
    let data = {};
    data = { ...formData };
    setFormStep(2);
    if (formStep === 2) {
      if (!form.values?.spaces?.length) {
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

      data.spaces = form.values?.spaces?.map(item => ({
        id: item._id,
        price: +item.price,
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

      if (data.proposalTermsId) {
        data.proposalTermsId = data.proposalTermsId.value;
      }

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
  };

  useEffect(() => {
    if (proposalData) {
      form.setValues({
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
            _id: item._id,
            price: item.price,
            startDate: new Date(item.startDate),
            endDate: new Date(item.endDate),
            unit: item?.bookedUnits,
            availableUnit: item?.remainingUnits,
            initialUnit: item?.bookedUnits || 0,
          })) || [],
        letterHead: userData?.proposalHead
          ? userData?.proposalHead
          : proposalData?.proposal?.letterHead,
        letterFooter: userData?.proposalFooter
          ? userData?.proposalFooter
          : proposalData?.proposal?.letterFooter,
        proposalTermsId: {
          label: proposalData?.proposal?.proposalTermsId?.name,
          value: proposalData?.proposal?.proposalTermsId?._id,
        },
      });
    }
  }, [proposalData, userData]);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 border-l border-gray-450 overflow-y-auto px-5">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmit)}>
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
