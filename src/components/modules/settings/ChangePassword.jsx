import { Button } from '@mantine/core';
import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { FormProvider, useForm } from '../../../context/formContext';
import { useChangePassword } from '../../../apis/queries/settings.queries';
import PasswordInput from '../../shared/PasswordInput';

const styles = {
  label: {
    color: 'grey',
    marginBottom: '4px',
    fontWeight: '100',
    fontSize: '16px',
  },
};

const initialValues = {
  confirmPassword: '',
  password: '',
  oldPassword: '',
};

const schema = yup.object({
  oldPassword: yup.string().trim().required('Current Password is required'),
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

const ChangePassword = () => {
  const form = useForm({ validate: yupResolver(schema), initialValues });

  const { mutateAsync, isLoading } = useChangePassword();

  const onSubmitHandler = formData => {
    mutateAsync({ ...formData }, { onSuccess: () => form.reset() });
  };
  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="font-bold text-xl mb-3">Change Password</p>
      <p className="font-medium text-slate-400 text-sm mt-1 mb-3">
        Please fill the below details to change your password
      </p>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitHandler)}>
          <div className="flex gap-4 flex-col">
            <PasswordInput
              label="Current Password"
              name="oldPassword"
              withAsterisk
              size="md"
              placeholder="Your Current Password"
              styles={styles}
              errors={form.errors}
              className="md:w-4/12"
            />
            <PasswordInput
              label="New Password"
              name="password"
              withAsterisk
              size="md"
              placeholder="Your New Password"
              styles={styles}
              errors={form.errors}
              className="md:w-4/12"
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              withAsterisk
              size="md"
              placeholder="Confirm New Password"
              styles={styles}
              errors={form.errors}
              className="md:w-4/12"
            />
          </div>
          <Button
            disabled={isLoading}
            loading={isLoading}
            type="submit"
            className="py-2 px-8 rounded bg-purple-450 text-white mt-4 "
          >
            Save
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default ChangePassword;
