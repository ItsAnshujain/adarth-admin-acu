import { Navigate, useLocation } from 'react-router-dom';
import shallow from 'zustand/shallow';
import useTokenIdStore from '../store/user.store';

const RequireAuth = ({ children }) => {
  const token = useTokenIdStore(state => state.token, shallow);
  const location = useLocation();

  return token ? children : <Navigate to="/login" replace state={{ path: location.pathname }} />;
};

export default RequireAuth;
