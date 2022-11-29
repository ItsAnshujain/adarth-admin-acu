import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { yupResolver } from '@mantine/form';
import { useDebouncedState } from '@mantine/hooks';
import BasicInfo from './BasicInfo';
import Spaces from '../Spaces';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import {
  useCreateProposal,
  useUpdateProposal,
  useFetchProposalById,
} from '../../../hooks/proposal.hooks';
import { FormProvider, useForm } from '../../../context/formContext';
import { useFetchMasters } from '../../../hooks/masters.hooks';
import { serialize } from '../../../utils';

const schema = yup.object().shape({
  image: yup.string().trim(),
  name: yup.string().trim().required('Name is required'),
  description: yup.string().trim(),
  startDate: yup
    .string()
    .test('startDate', 'Start Date must be less that End Date', function (val) {
      if (new Date(val) < new Date(this.parent.endDate)) {
        return true;
      }
      return false;
    })
    .required('Start Date is required'),
  endDate: yup.string().required('End Date is required'),
  status: yup.string().trim(),
});

const initialValues = {
  image: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: '',
};

const Main = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const navigate = useNavigate();
  const { id: proposalId } = useParams();
  const [query] = useState({
    owner: 'all',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });

  const [selectedRow, setSelectedRow] = useState([]);
  const [proposedPrice, setProposedPrice] = useDebouncedState(null, 1000);
  const { mutate: create, isLoading: isCreateProposalLoading } = useCreateProposal();
  const { mutate: update, isLoading: isUpdateProposalLoading } = useUpdateProposal();
  const { data: proposalData } = useFetchProposalById(
    `${proposalId}?${serialize(query)}`,
    !!proposalId,
  );

  const handleUpdatedProposedPrice = (val, id) => setProposedPrice({ price: val, inventoryId: id });

  const { data: proposalStatusData } = useFetchMasters(
    serialize({ type: 'proposal_status', parentId: null, limit: 10 }),
  );

  const getForm = () =>
    formStep === 1 ? (
      <BasicInfo proposalId={proposalId} />
    ) : (
      <Spaces
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        selectedRowData={proposalData?.inventories.docs || []}
        noOfSelectedPlaces={selectedRow.length}
        setProposedPrice={handleUpdatedProposedPrice}
      />
    );

  const onSubmit = formData => {
    let data = {};

    data = {
      ...formData,
    };
    setFormStep(2);
    if (formStep === 2) {
      if (selectedRow.length === 0) {
        showNotification({
          title: 'Please select atleast one space to continue',
          color: 'blue',
        });
        return;
      }

      const spaceArray = [];
      selectedRow?.map(item => {
        const element = {
          id: item.original._id,
          price: item.original.basicInformation.price,
        };
        spaceArray.push(element);

        return spaceArray;
      });

      data.spaces = [...spaceArray];

      if (proposedPrice) {
        const newSpaceArray = spaceArray.map(item => {
          if (item.id === proposedPrice.inventoryId) {
            return { ...item, price: proposedPrice.price };
          }
          return item;
        });
        data.spaces = [...newSpaceArray];
      }

      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === undefined) {
          delete data[key];
        }
      });

      if (proposalId) {
        update({ proposalId, data });
      } else {
        const status = proposalStatusData?.docs?.filter(
          item => item?.name.toLowerCase() === 'created',
        )[0]?._id;

        data = {
          ...data,
          status,
        };

        create(data);
      }
      form.reset();

      setTimeout(() => navigate('/proposals'), 2000);
    }
  };

  useEffect(() => {
    if (proposalData) {
      form.setFieldValue('image', proposalData?.proposal?.image);
      form.setFieldValue('name', proposalData?.proposal?.name);
      form.setFieldValue('description', proposalData?.proposal?.description || '');
      if (proposalData?.proposal?.startDate) {
        form.setFieldValue('startDate', new Date(proposalData.proposal.startDate));
      }

      if (proposalData?.proposal?.endDate) {
        form.setFieldValue('endDate', new Date(proposalData.proposal.endDate));
      }
      form.setFieldValue('status', proposalData?.proposal?.status);
    }
  }, [proposalData]);

  return (
    <>
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
    </>
  );
};

export default Main;
