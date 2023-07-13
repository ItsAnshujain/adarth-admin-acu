import React from 'react';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useForgotPassword } from '../apis/queries/auth.queries';
import { FormProvider, useForm } from '../context/formContext';
import TextInput from '../components/shared/TextInput';
import banner from '../assets/login.svg';

const initialValues = {
  email: '',
};

const schema = yup.object({
  email: yup.string().trim().required('Email is required').email('Invalid Email'),
});

const styles = {
  label: {
    color: 'grey',
    opacity: '0.5',
    marginBottom: '16px',
    fontWeight: '100',
    fontSize: '16px',
  },
};

const ForgotPasswordPage = () => {
  const form = useForm({ validate: yupResolver(schema), initialValues });
  const { mutate: forgotPassword, isLoading } = useForgotPassword();

  const onSubmitHandler = formData => {
    forgotPassword(formData);
  };

  return (
    <div className="flex">
      <div className="hidden md:mr-16 md:block">
        <img src={banner} alt="login" className="h-screen" />
      </div>
      <div className="flex h-screen w-full flex-col justify-center px-5 md:w-[31%] md:px-0">
        <p className="mb-1 text-2xl font-bold">Forgot Password</p>
        <p className="mb-4">Please use registered email id</p>
        <FormProvider form={form}>
          <form onSubmit={form.onSubmit(onSubmitHandler)}>
            <TextInput
              name="email"
              label="Email"
              disabled={isLoading}
              size="lg"
              placeholder="Your Email"
              styles={styles}
              errors={form.errors}
            />
            <Button
              loading={isLoading}
              className="mt-4 width-full bg-purple-450"
              color="primary"
              type="submit"
              styles={() => ({
                root: {
                  width: '100%',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: '#4B0DAF',
                  },
                },
              })}
            >
              Send Link
            </Button>
          </form>
        </FormProvider>
        <p className="mt-4">
          <Link to="/login">
            <span className="text-purple-450 ml-1 cursor-pointer">Back to Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
