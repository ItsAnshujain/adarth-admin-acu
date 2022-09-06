import { TextInput, Text, Button } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const initialValues = {
  email: '',
};

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid Email'),
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
    navigate('/change-password');
  };

  return (
    <div className="my-auto w-[31%]">
      <p className="mb-1 text-2xl font-bold">Forgot Password</p>
      <Text className="mb-8">Please use registered email id</Text>

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
          Send Link
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
