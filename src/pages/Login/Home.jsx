import * as yup from 'yup';
import shallow from 'zustand/shallow';
import { Title, Text, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@mantine/form';
import { useForm, FormProvider } from '../../context/formContext';
import { useLogin } from '../../hooks/auth.hooks';
import { fetchUserDetails } from '../../hooks/user.hooks';
import useUserStore from '../../store/user.store';
import TextInput from '../../components/shared/TextInput';
import PasswordInput from '../../components/shared/PasswordInput';

const initialValues = {
  email: '',
  password: '',
};

const schema = yup.object().shape({
  email: yup.string().trim().required('Email is required').email('Invalid Email'),
  password: yup
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .required('Password is required'),
});

const Home = () => {
  const navigate = useNavigate();

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

  const { mutateAsync: login, isLoading } = useLogin();
  const { data: ud, isLoading: userDataLoading } = fetchUserDetails(id);

  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmitHandler = async formData => {
    const response = await login(formData);
    setToken(response.token);
    setId(response.id);
    setUserDetails(ud);
    navigate('/home');
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
    <div className="my-auto w-[31%]">
      <Title className="mb-1">Login to Adarth</Title>
      <Text>Please use registered email for login</Text>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitHandler)}>
          <TextInput
            name="email"
            label="Email"
            disabled={isLoading && userDataLoading}
            size="lg"
            placeholder="Your Email"
            styles={styles}
            errors={form.errors}
          />
          <PasswordInput
            name="password"
            label="Password"
            disabled={isLoading && userDataLoading}
            size="lg"
            placeholder="Your Password"
            styles={styles}
            errors={form.errors}
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
      </FormProvider>
      <Text className="mt-4">
        <Link to="/forgot-password">
          <span className="text-purple-450 ml-1 cursor-pointer">Forgot Password</span>
        </Link>
      </Text>
    </div>
  );
};

export default Home;
