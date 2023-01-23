import { Button, Divider, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import shallow from 'zustand/shallow';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import randomWords from 'random-words';
import { showNotification } from '@mantine/notifications';
import { useDeleteAccount } from '../../hooks/settings.hooks';
import useUserStore from '../../store/user.store';
import { useForm, FormProvider } from '../../context/formContext';
import PasswordInput from '../shared/PasswordInput';
import TextInput from '../shared/TextInput';

const schema = yup.object({
  randomText: yup.string().trim().required('Field is required'),
  password: yup
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .required('Password is required'),
});

const initialValues = {
  randomText: '',
  password: '',
};

const TwoStepDeleteAccountContent = ({ onClickCancel = () => {}, navigate }) => {
  const { setToken, setId, id } = useUserStore(
    state => ({
      setToken: state.setToken,
      setId: state.setId,
      id: state.id,
    }),
    shallow,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const { mutateAsync, isLoading } = useDeleteAccount();

  const form = useForm({ validate: yupResolver(schema), initialValues });
  const [typeWord, setTypeWord] = useState('');

  const handleAccountDelete = formData => {
    const data = { ...formData };
    if (data.randomText?.toLowerCase() !== typeWord?.toLowerCase()) {
      showNotification({
        title: 'The entered word does not match the given word',
        color: 'red',
      });

      return;
    }

    delete data.randomText;
    mutateAsync(
      { userId: id, data },
      {
        onSuccess: () => {
          form.reset();
          setToken(null);
          setId(null);
          onClickCancel();
          navigate('/login');
        },
      },
    );
  };

  useEffect(() => {
    if (currentStep === 2) {
      const word = randomWords();
      setTypeWord(word);
    }
  }, [currentStep]);

  return (
    <div>
      <Divider />
      {currentStep === 1 ? (
        <div className="px-4 py-5">
          <Text size="md" mb={16} className="font-sans">
            Are you sure? Your profile and related information will be deleted from our site.
          </Text>
          <div className="flex gap-2  justify-end">
            <Button
              onClick={onClickCancel}
              className="bg-black text-white rounded-md text-sm font-sans"
            >
              No, I have changed my mind
            </Button>
            <Button
              className="bg-purple-450 text-white rounded-md text-sm font-sans"
              onClick={() => setCurrentStep(2)}
            >
              Yes, contine
            </Button>
          </div>
        </div>
      ) : currentStep === 2 ? (
        <div className="px-4 py-5">
          <FormProvider form={form}>
            <form onSubmit={form.onSubmit(handleAccountDelete)}>
              <Text size="md" mb={16} className="font-sans">
                Please enter <span className="capitalize font-medium">{`"${typeWord}"`}</span> and
                your password to confirm that you wish to close your account.
              </Text>
              <div className="mb-10">
                <TextInput
                  name="randomText"
                  label="Type the text:"
                  disabled={isLoading}
                  placeholder="Write..."
                  errors={form.errors}
                  mb={10}
                  autoComplete="off"
                  className="font-sans"
                />
                <PasswordInput
                  name="password"
                  label="Enter your password:"
                  disabled={isLoading}
                  placeholder="Your Password"
                  errors={form.errors}
                  autoComplete="new-password"
                  className="font-sans"
                />
              </div>
              <div className="flex gap-2  justify-end">
                <Button
                  onClick={() => setCurrentStep(1)}
                  className="bg-black text-white rounded-md text-sm font-sans"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="bg-red-450 text-white rounded-md text-sm font-sans"
                >
                  Delete Account
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      ) : null}
    </div>
  );
};

export default TwoStepDeleteAccountContent;
