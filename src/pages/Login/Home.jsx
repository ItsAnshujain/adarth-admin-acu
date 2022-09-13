import * as yup from 'yup';
import shallow from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { Title, Text, Button } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks/auth.hooks';
import {
  ControlledFormTextInput,
  ControlledFormPasswordInput,
} from '../../components/Input/FormInput';
import { fetchUserDetails } from '../../hooks/user.hooks';
import useUserStore from '../../store/user.store';

const defaultValues = {
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

  const { setToken, setId, id, setUserDetails } = useUserStore(
    state => ({
      setToken: state.setToken,
      setId: state.setId,
      id: state.id,
      setUserDetails: state.setUserDetails,
    }),
    shallow,
  );

  useUserStore(state => state.userDetails, shallow);

  const { mutate: login, isError, data, isLoading, isSuccess } = useLogin();
  const { data: ud, isSuccess: userDataLoaded, isLoading: userDataLoading } = fetchUserDetails(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmitHandler = async formData => {
    login(formData);
  };

  if (isError) {
    showNotification({
      title: 'Invalid details',
      message: 'Email and Password do not match',
      color: 'red',
    });
  }

  if (isSuccess) {
    const {
      data: { token, id: userId },
    } = data;
    setToken(token);
    setId(userId);
  }

  if (userDataLoaded) {
    setUserDetails(ud);
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
          control={control}
          label="Email"
          isLoading={isLoading && userDataLoading}
          size="lg"
          placeholder="Your Email"
          styles={styles}
          errors={errors}
        />
        <ControlledFormPasswordInput
          name="password"
          control={control}
          label="Password"
          isLoading={isLoading && userDataLoading}
          size="lg"
          placeholder="Your Password"
          styles={styles}
          errors={errors}
        />
        <Button
          disabled={isLoading && userDataLoading}
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
