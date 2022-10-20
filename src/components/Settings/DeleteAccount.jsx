import { Button } from '@mantine/core';
import { useDeleteAccount } from '../../hooks/settings.hooks';
import useUserStore from '../../store/user.store';

const DeleteAccount = () => {
  const { mutateAsync, isLoading } = useDeleteAccount();
  const userId = useUserStore(state => state.id);
  const handleAccountDelete = () => {
    mutateAsync(userId);
  };
  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="font-bold text-xl">Are you sure you want to delete your account?</p>
      <p className="font-medium text-slate-400 text-sm mt-1 mb-3">
        Lorem ipsum dolor sit inventore veritatis corrupti suscipit!
      </p>
      <Button
        type="button"
        className="py-2 px-3 rounded bg-purple-450 text-white mt-1"
        onClick={handleAccountDelete}
        loading={isLoading}
      >
        Yes
      </Button>
    </div>
  );
};

export default DeleteAccount;
