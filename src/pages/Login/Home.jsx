import * as yup from 'yup';
import shallow from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { Title, Text, Button } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/auth.hooks';
import useTokenIdStore from '../../store/user.store';
import {
  ControlledFormTextInput,
  ControlledFormPasswordInput,
} from '../../components/Input/FormInput';

const initialValues = {
  email: '',
  password: '',
};

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid Email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long'),
});

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setToken, setId } = useTokenIdStore(
    state => ({ setToken: state.setToken, setId: state.setId }),
    shallow,
  );

  const { mutate: login, isSuccess, isLoading, isError, data } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    initialValues,
  });

  const onSubmitHandler = async formData => {
    login(formData);
  };

  if (isError) {
    showNotification({
      title: 'Invalid details',
      message: 'Email and Password do not match',
    });
  }

  if (isSuccess) {
    const {
      data: { token, id: userId },
    } = data;
    setToken(token);
    setId(userId);

    reset(initialValues);

    navigate(location.state?.path || '/home');
  }

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
    <div className="my-auto w-[31%]">
      <Title className="mb-1">Login to Adarth</Title>
      <Text>Please use registered email for login</Text>

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <ControlledFormTextInput
          name="email"
          initialValues={initialValues}
          control={control}
          label="Email"
          isLoading={isLoading}
          size="lg"
          placeholder="Your Email"
          styles={styles}
          errors={errors}
        />

        <ControlledFormPasswordInput
          name="password"
          initialValues={initialValues}
          control={control}
          label="Password"
          isLoading={isLoading}
          size="lg"
          placeholder="Your Password"
          styles={styles}
          errors={errors}
        />
        <Button
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
      <Text className="mt-4">
        <Link to="/forgot-password">
          <span className="text-purple-450 ml-1 cursor-pointer">Forgot Password</span>
        </Link>
      </Text>
    </div>
  );
};

export default Home;
