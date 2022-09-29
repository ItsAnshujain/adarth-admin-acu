import { yupResolver } from '@mantine/form';
import * as yup from 'yup';
import { FormProvider, useForm } from '../../context/formContext';
import PasswordInput from '../shared/PasswordInput';

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

const schema = yup.object().shape({
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

  const onSubmitHandler = formData => {
    // eslint-disable-next-line no-console
    console.log(formData);
  };
  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="font-bold text-xl mb-3">Change Password</p>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmitHandler)}>
          <div className="flex gap-4 flex-col">
            <PasswordInput
              label="Current Password"
              name="oldPassword"
              // disabled={isLoading}
              size="md"
              placeholder="Your Current Password"
              styles={styles}
              errors={form.errors}
              className="w-4/12"
            />
            <PasswordInput
              label="New Password"
              name="password"
              // disabled={isLoading}
              size="md"
              placeholder="Your New Password"
              styles={styles}
              errors={form.errors}
              className="w-4/12"
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              // disabled={isLoading}
              size="md"
              placeholder="Confirm New Password"
              styles={styles}
              errors={form.errors}
              className="w-4/12"
            />
          </div>
          <button type="submit" className="py-2 px-8 rounded bg-purple-450 text-white mt-4">
            Save
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default ChangePassword;
