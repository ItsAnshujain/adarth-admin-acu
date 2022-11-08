import { useQueryClient } from '@tanstack/react-query';
import shallow from 'zustand/shallow';
import useTokenIdStore from '../store/user.store';
import NoMatch from '../pages/NoMatch';

const ProtectedRoute = ({ accepted, children }) => {
  const userId = useTokenIdStore(state => state.id, shallow);
  const queryClient = useQueryClient();
  const userCachedData = queryClient.getQueryData(['users-by-id', userId]);

  return accepted?.includes(userCachedData?.role) ? children : <NoMatch />;
};

export default ProtectedRoute;
