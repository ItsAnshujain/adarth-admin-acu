import { Text, Button, PasswordInput } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const initialValues = {
  confirmPassword: '',
  password: '',
};

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long'),
  confirmPassword: yup
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
    navigate('/inventory');
  };

  return (
    <div className="my-auto w-[31%]">
      <p className="text-2xl font-bold">Change Password</p>
      <Text className="mb-8">Please use registered email for login</Text>

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Text color="gray" className="mb-2 opacity-50">
          New Password
        </Text>
        <Controller
          name="password"
          defaultValue={initialValues.password}
          control={control}
          render={({ field }) => (
            <PasswordInput {...field} size="lg" placeholder="Your New Password" />
          )}
        />

        <p className="text-sm text-orange-450 mb-3">{errors.password?.message}</p>

        <Text color="gray" className="mb-2 mt-6 opacity-50">
          Confirm Password
        </Text>
        <Controller
          name="confirmPassword"
          defaultValue={initialValues.confirmPassword}
          control={control}
          render={({ field }) => (
            <PasswordInput {...field} size="lg" placeholder="Confirm New Password" />
          )}
        />

        <p className="mb-3 text-sm text-orange-450">{errors.confirmPassword?.message}</p>

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
        <Link to="/">
          <span className="text-purple-450 ml-1 cursor-pointer">Back to Login</span>
        </Link>
      </Text>
    </div>
  );
};

export default Home;
