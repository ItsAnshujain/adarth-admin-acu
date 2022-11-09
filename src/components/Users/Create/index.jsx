import { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import Credentials from './Credentials';
import SuccessModal from '../../shared/Modal';
import Header from './Header';
import { FormProvider, useForm } from '../../../context/formContext';
import { useCreateUsers, useInvitePeers } from '../../../hooks/users.hooks';
import { serialize } from '../../../utils';

const schema = yup.object().shape({
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

const MainArea = () => {
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
    <>
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
    </>
  );
};

export default MainArea;
