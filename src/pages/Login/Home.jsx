import { Title, TextInput, Text, Button, PasswordInput } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    initialValues,
  });

  // TODO: add data as and argument to function while integration
  const onSubmitHandler = () => {
    reset(initialValues);
    navigate('/home');
  };

  return (
    <div className="my-auto w-[31%]">
      <Title className="mb-8">Login to Adarth</Title>
      <Text className="mb-8">Please use registered email for login</Text>

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Text color="gray" className="mb-4 opacity-50">
          Email
        </Text>
        <Controller
          name="email"
          defaultValue={initialValues.email}
          control={control}
          render={({ field }) => <TextInput {...field} size="lg" placeholder="Your Email" />}
        />

        <p className="text-sm text-orange-450 mb-3">{errors.email?.message}</p>

        <Text color="gray" className="my-4 mt-6 opacity-50">
          Password
        </Text>
        <Controller
          name="password"
          defaultValue={initialValues.password}
          control={control}
          render={({ field }) => <PasswordInput {...field} size="lg" placeholder="Your Password" />}
        />

        <p className="mb-3 text-sm text-orange-450">{errors.password?.message}</p>

        <Button
          className="mt-2 width-full bg-purple-450"
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
