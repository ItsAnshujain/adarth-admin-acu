import { Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showNotification } from '@mantine/notifications';
import { useForgotPassword } from '../../hooks/auth.hooks';
import { ControlledFormTextInput } from '../../components/Input/FormInput';

const initialValues = {
  email: '',
};

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid Email'),
});

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    initialValues,
  });
  const { mutate: forgotPassword, isLoading } = useForgotPassword();

  const onSubmitHandler = formData => {
    forgotPassword(formData, {
      onError: err => {
        showNotification({
          title: 'Invalid details',
          message: err.message,
        });
      },
      onSuccess: () => {
        showNotification({
          title: 'Request Submitted',
          message: 'Please check your email for further instructions',
          color: 'green',
        });
      },
    });
  };

  const styles = {
    label: {
      color: 'grey',
      opacity: '0.5',
      marginBottom: '16px',
      fontWeight: '100',
      fontSize: '16px',
    },
  };

  return (
    <div className="my-auto w-[31%]">
      <p className="mb-1 text-2xl font-bold">Forgot Password</p>
      <p className="mb-4">Please use registered email id</p>

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <ControlledFormTextInput
          label="Email"
          name="email"
          initialValues={initialValues}
          placeholder="Your Email"
          size="lg"
          isLoading={isLoading}
          control={control}
          errors={errors}
          styles={styles}
        />

        <Button
          disabled={isLoading}
          className="mt-4 width-full bg-purple-450"
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
      <p className="mt-4">
        <Link to="/">
          <span className="text-purple-450 ml-1 cursor-pointer">Back to Login</span>
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
