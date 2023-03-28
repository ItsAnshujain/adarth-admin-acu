import { Button, Group, Text, Title } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { FormProvider, useForm } from '../../context/formContext';
import { useUpdateUsers } from '../../hooks/users.hooks';
import useUserStore from '../../store/user.store';
import banner from '../../assets/login.svg';

const TermsAndConditionsPage = () => {
  const navigate = useNavigate();
  const form = useForm();
  const userId = useUserStore(state => state.id);

  const { setToken, setId } = useUserStore(
    state => ({
      setToken: state.setToken,
      setId: state.setId,
    }),
    shallow,
  );

  const { mutateAsync: updateUser, isLoading: isUserUpdateLoading } = useUpdateUsers();
  const handleSubmit = async () => {
    const data = { hasAcceptedTerms: true };

    updateUser(
      { userId, data },
      {
        onSuccess: () => {
          navigate('/home');
          localStorage.setItem('hasTerms', true);
        },
      },
    );
  };

  const handleBack = () => {
    setToken(null);
    setId(null);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex">
      <div className="hidden md:mr-16 md:block">
        <img src={banner} alt="login" className="h-screen" />
      </div>
      <div className="flex h-screen w-full flex-col justify-center px-5 md:w-[35%] md:px-0">
        <FormProvider form={form}>
          <form>
            <Title className="mb-5">Terms and Conditions</Title>
            <Text>Please accept the terms and conditions before signing in</Text>
            {form.errors ? <p className="text-red-450">{form.errors.hasAcceptedTerms}</p> : null}
            <Group mt="xs">
              <Button
                className="primary-button"
                onClick={form.onSubmit(e => handleSubmit(e))}
                disabled={isUserUpdateLoading}
                loading={isUserUpdateLoading}
              >
                Accept
              </Button>
              <Button
                className="secondary-button"
                onClick={handleBack}
                disabled={isUserUpdateLoading}
              >
                Decline
              </Button>
            </Group>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
