import * as yup from 'yup';
import { useState } from 'react';
import { Text, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { useForm, yupResolver } from '@mantine/form';
import SuccessModal from '../../components/shared/Modal';
import { useResetPassword } from '../../hooks/auth.hooks';
import PasswordInput from '../../components/shared/PasswordInput';
import { FormProvider } from '../../context/formContext';

const initialValues = {
  confirmPassword: '',
  password: '',
};

const schema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password must be at most 32 characters long')
    .required('New Password is required'),
  confirmPassword: yup
    .string()
    .trim()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'New password and Confirm password must match'),
});

const Home = () => {
  const [open, setOpenSuccessModal] = useState(false);
  const { mutate: changePassword, isLoading } = useResetPassword();
  const navigate = useNavigate();

  const {
    location: { hostname, search },
  } = window;

  let token = '';
  if (hostname === 'localhost') {
    token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzFiMjNhOTRlOWU2ODgwODQxMmU5ZTgiLCJpYXQiOjE2NjI5Nzk4MTQsImV4cCI6MTY2MzA2NjIxNH0.DI52v5EDobQG5TcbO0GYFzRgm-pVHKiBpji-Hc_Qm90';
  } else {
    token = search?.split('=')[1];
  }

  const form = useForm({ validate: yupResolver(schema), initialValues });

  const onSubmitHandler = formData => {
    if (formData.password !== formData.confirmPassword) {
      showNotification({
        title: 'Password does not match',
        color: 'red',
      });
    } else {
      changePassword(
        {
          password: formData.password,
          token,
        },
        {
          onError: err => {
            showNotification({
              title: 'Something went wrong',
              message: err.message,
              color: 'red',
            });
          },
          onSuccess: () => {
            navigate('/login');
          },
        },
      );
    }

    return null;
  };

  const styles = {
    label: {
      color: 'grey',
      opacity: '0.5',
      marginBottom: '16px',
      marginTop: '24px',
      fontWeight: '100',
      fontSize: '16px',
    },
  };

  return (
    <>
      <div className="my-auto w-[31%]">
        <p className="text-2xl font-bold">Change Password</p>
        <FormProvider form={form}>
          <form onSubmit={form.onSubmit(onSubmitHandler)}>
            <PasswordInput
              label="New Password"
              name="password"
              disabled={isLoading}
              size="lg"
              placeholder="Your New Password"
              styles={styles}
              errors={form.errors}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              disabled={isLoading}
              size="lg"
              placeholder="Confirm New Password"
              styles={styles}
              errors={form.errors}
            />

            <Button
              disabled={isLoading}
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
        </FormProvider>
        <Text className="mt-4">
          <Link to="/login">
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
