import { useEffect, useState } from 'react';
import { Text, Button, PasswordInput, Alert } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { XOctagon } from 'react-feather';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SuccessModal from '../../components/shared/Modal';
import { useResetPassword } from '../../hooks/auth.hooks';

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
    .required('Confirm Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long'),
});

const Home = () => {
  const [open, setOpenSuccessModal] = useState(false);
  const [passwordMatches, setPasswordMatches] = useState(true);
  const { mutate: changePassword, isLoading, isError, isSuccess } = useResetPassword();

  useEffect(() => {
    if (!passwordMatches) {
      setPasswordMatches(false);
      setTimeout(() => {
        setPasswordMatches(true);
      }, 1000);
    }
  }, [passwordMatches]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    initialValues,
  });

  // TODO: add data as and argument to function while integration
  const onSubmitHandler = formData => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatches(false);
    }

    return null;
  };

  return (
    <>
      <div className="my-auto w-[31%]">
        <p className="text-2xl font-bold">Change Password</p>

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
          {!passwordMatches && (
            <div className="absolute top-10 right-0">
              <Alert icon={<XOctagon />} color="red">
                Password do not match
              </Alert>
            </div>
          )}

          <Button
            className="mt-2 width-full bg-purple-450 border-rounded-xl text-xl"
            color="primary"
            type="submit"
            styles={() => ({
              root: {
                width: '100%',
                height: '44px',
                '&:hover': {
                  backgroundColor: '#4B0DAF',
                },
              },
            })}
          >
            Save
          </Button>
        </form>
        <Text className="mt-4">
          <Link to="/">
            <span className="text-purple-450 ml-1 cursor-pointer">Back to Login</span>
          </Link>
        </Text>
      </div>
      <SuccessModal
        open={open}
        setOpenSuccessModal={setOpenSuccessModal}
        title="Password Successfully Changed"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        prompt="Login"
        path="login"
      />
    </>
  );
};

export default Home;
