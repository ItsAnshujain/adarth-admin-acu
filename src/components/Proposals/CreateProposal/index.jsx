import { useState, useEffect } from 'react';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { yupResolver } from '@mantine/form';
import BasicInfo from './BasicInfo';
import Spaces from '../Spaces';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import { useCreateProposal, useFetchProposalById } from '../../../hooks/proposal.hooks';
import { FormProvider, useForm } from '../../../context/formContext';

const UTC_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ[Z]';
const schema = yup.object().shape({
  name: yup.string().trim().required('Name is required'),
  description: yup.string().trim().required('Description is required'),
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
});

const initialValues = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
};

const Main = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const navigate = useNavigate();
  const { id: proposalId } = useParams();
  const [selectedRow, setSelectedRow] = useState([]);

  const { mutate: create, isLoading: isCreateProposalLoading } = useCreateProposal();
  const { data: proposalData } = useFetchProposalById(proposalId, !!proposalId);
  const getForm = () =>
    formStep === 1 ? <BasicInfo /> : <Spaces setSelectedRow={setSelectedRow} />;

  const onSubmit = formData => {
    let data = {};
    const startDate = dayjs(formData?.startDate).format(UTC_FORMAT);
    const endDate = dayjs(formData?.endDate).format(UTC_FORMAT);
    data = { ...formData, startDate, endDate };
    setFormStep(2);
    if (formStep === 2) {
      if (selectedRow.length === 0) {
        showNotification({
          title: 'Add Spaces',
          message: 'Please select atleast one space to continue',
          autoClose: 3000,
          color: 'blue',
        });
        return;
      }

      const spaceArray = [];
      selectedRow?.map(item => {
        const element = {
          _id: item.original._id,
          price: item.original.price,
        };
        spaceArray.push(element);

        return spaceArray;
      });

      data.spaces = [...spaceArray];

      create(data);
      form.reset();

      setTimeout(() => navigate('/proposals'), 2000);
    }
  };

  useEffect(() => {
    if (proposalData) {
      form.setFieldValue('name', proposalData?.name);
    }
  }, [proposalData]);

  return (
    <>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="h-20 border-b border-gray-450 flex justify-between items-center">
            <Header
              setFormStep={setFormStep}
              formStep={formStep}
              isCreateProposalLoading={isCreateProposalLoading}
            />
          </div>
          {getForm()}
        </form>
      </FormProvider>
      <SuccessModal
        title="Proposal Successfully Created"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Visit Proposals"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="proposals"
      />
    </>
  );
};

export default Main;
