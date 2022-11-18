import { useQueryClient } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import useTokenIdStore from '../store/user.store';

const RoleBased = ({ acceptedRoles, children }) => {
  const userId = useTokenIdStore(state => state.id, shallow);
  const queryClient = useQueryClient();
  const userCachedData = queryClient.getQueryData(['users-by-id', userId]);

  return acceptedRoles?.includes(userCachedData?.role) ? children : null;
};

export default RoleBased;