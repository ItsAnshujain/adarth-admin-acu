import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { useDeleteAccount } from '../../hooks/settings.hooks';
import useUserStore from '../../store/user.store';

const DeleteAccount = () => {
  const { mutateAsync, isLoading } = useDeleteAccount();
  const navigate = useNavigate();
  const { setToken, setId, id } = useUserStore(
    state => ({
      setToken: state.setToken,
      setId: state.setId,
      id: state.id,
    }),
    shallow,
  );

  const handleAccountDelete = () => {
    mutateAsync(id, {
      onSuccess: () => {
        setToken(null);
        setId(null);
        navigate('/login');
      },
    });
  };
  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="font-bold text-xl">Are you sure you want to delete your account?</p>
      <Button
        type="button"
        className="py-2 px-3 rounded bg-purple-450 text-white mt-3"
        onClick={handleAccountDelete}
        loading={isLoading}
      >
        Yes
      </Button>
    </div>
  );
};

export default DeleteAccount;
