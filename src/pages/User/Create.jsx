import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import Credentials from '../../components/Users/Create/Credentials';
import SuccessModal from '../../components/shared/Modal';
import Header from '../../components/Users/Create/Header';
import { FormProvider, useForm } from '../../context/formContext';
import { useCreateUsers, useInvitePeers } from '../../hooks/users.hooks';
import { serialize } from '../../utils';

const schema = yup.object({
  email: yup.string().trim().required('Email is required').email('Invalid Email'),
  role: yup
    .object({
      label: yup.string().trim(),
      value: yup.string().trim(),
    })
    .test('role', 'Role is required', obj => obj.value !== ''),
  name: yup.string().trim().required('Name is required'),
});

const initialValues = {
  name: '',
  email: '',
  role: { label: '', value: '' },
};

const CreateUser = () => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [type, setType] = useState('Team');
  const form = useForm(type === 'Team' ? { validate: yupResolver(schema), initialValues } : {});
  const { mutate: create, isLoading } = useCreateUsers();
  const { mutate: invite, isLoading: isPeersLoading } = useInvitePeers();
  const [peerId, setPeerId] = useState('');

  const onSubmitUserForm = formData => {
    if (type === 'Team') {
      const data = { ...formData, role: formData.role.value };
      create(data, {
        onSuccess: () => {
          form.reset();
          setTimeout(() => setOpenSuccessModal(true), 1000);
        },
      });
    } else if (type === 'Peer') {
      if (peerId === '') {
        showNotification({
          title: 'Please select a peer to continue',
          color: 'blue',
        });
        return;
      }

      invite(
        serialize({
          id: peerId || '',
          type: 'add',
        }),
        {
          onSuccess: () => {
            form.reset();
            setTimeout(() => setOpenSuccessModal(true), 1000);
          },
        },
      );
    }
  };

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-10 h-[calc(100vh-80px)] border-l border-gray-450 overflow-y-auto">
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitUserForm)}>
          <Header
            isLoading={isLoading || isPeersLoading}
            disabled={isLoading || isPeersLoading}
            type={type}
          />
          <Credentials setType={setType} setPeerId={setPeerId} />
        </form>
      </FormProvider>
      <SuccessModal
        title={type === 'Team' ? 'Profile Created Successfully' : 'Peer Added Successfully'}
        prompt="Visit User List"
        open={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        path="users"
      />
    </div>
  );
};

export default CreateUser;
