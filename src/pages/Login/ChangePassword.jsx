import * as yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import SuccessModal from '../../components/shared/Modal';
import { useResetPassword } from '../../hooks/auth.hooks';
import { ControlledFormPasswordInput } from '../../components/Input/FormInput';

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
  const navigate = useNavigate();
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
      setTimeout(() => {
        setPasswordMatches(true);
      }, 10);
    } else {
      changePassword({
        password: formData.password,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzFiMjNhOTRlOWU2ODgwODQxMmU5ZTgiLCJpYXQiOjE2NjI5Nzk4MTQsImV4cCI6MTY2MzA2NjIxNH0.DI52v5EDobQG5TcbO0GYFzRgm-pVHKiBpji-Hc_Qm90',
      });
    }

    return null;
  };

  if (isError) {
    showNotification({
      title: 'Something went wrong',
      message: 'Please try again',
    });
  }

  if (!passwordMatches) {
    showNotification({
      title: 'Password does not match',
    });
  }

  if (isSuccess) {
    navigate('/login');
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
    <>
      <div className="my-auto w-[31%]">
        <p className="text-2xl font-bold">Change Password</p>

        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <ControlledFormPasswordInput
            label="New Password"
            name="password"
            initialValues={initialValues}
            control={control}
            placeholder="Your New Password"
            styles={styles}
            isLoading={isLoading}
            size="lg"
            errors={errors}
          />

          <ControlledFormPasswordInput
            label="Confirm Password"
            name="confirmPassword"
            initialValues={initialValues}
            control={control}
            placeholder="Confirm New Password"
            styles={styles}
            isLoading={isLoading}
            size="lg"
            errors={errors}
          />

          <Button
            className="mt-3 width-full bg-purple-450 border-rounded-xl text-xl"
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
