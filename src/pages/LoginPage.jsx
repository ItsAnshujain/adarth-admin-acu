import React from 'react';
import * as yup from 'yup';
import shallow from 'zustand/shallow';
import { Title, Text, Button } from '@mantine/core';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@mantine/form';
import banner from '../assets/login.svg';
import { useForm, FormProvider } from '../context/formContext';
import { useLogin } from '../hooks/auth.hooks';
import useUserStore from '../store/user.store';
import TextInput from '../components/shared/TextInput';
import PasswordInput from '../components/shared/PasswordInput';

const initialValues = {
  email: '',
  password: '',
};

const schema = yup.object({
  email: yup.string().trim().required('Email is required').email('Invalid Email'),
  password: yup
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setToken, setId, setHasAcceptedTerms } = useUserStore(
    state => ({
      setToken: state.setToken,
      setId: state.setId,
      id: state.id,
      setHasAcceptedTerms: state.setHasAcceptedTerms,
    }),
    shallow,
  );

  const redirectTo = searchParams.get('redirect_to');
  const { mutateAsync: login, isLoading } = useLogin();

  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmitHandler = async formData => {
    const response = await login(formData);
    setToken(response.token);
    setId(response.id);
    setHasAcceptedTerms(response.hasAcceptedTerms);
    if (!response.hasAcceptedTerms) {
      if (location.search.includes('setting')) {
        navigate('/terms-conditions?redirect_to=setting&type=change_password');
      } else {
        navigate('/terms-conditions');
      }
      return;
    }

    if (redirectTo) {
      navigate(`/${redirectTo}`);
    } else {
      navigate('/home');
    }
  };

  const styles = () => ({
    label: {
      color: 'grey',
      opacity: '0.5',
      marginBottom: '16px',
      marginTop: '24px',
      fontWeight: '100',
      fontSize: '16px',
    },
  });

  return (
    <div className="flex">
      <div className="hidden md:mr-16 md:block">
        <img src={banner} alt="login" className="h-screen" />
      </div>
      <div className="flex h-screen w-full flex-col justify-center px-5 md:w-[31%] md:px-0">
        <Title className="mb-1">Login to Adarth</Title>
        <Text>Please use registered email for login</Text>
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
            <PasswordInput
              name="password"
              label="Password"
              disabled={isLoading}
              size="lg"
              placeholder="Your Password"
              styles={styles}
              errors={form.errors}
            />
            <Button
              disabled={isLoading}
              className="mt-5 width-full bg-purple-450"
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
              Login
            </Button>
          </form>
        </FormProvider>
        <Text className="mt-4">
          <Link to="/forgot-password">
            <span className="text-purple-450 ml-1 cursor-pointer">Forgot Password</span>
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default LoginPage;
