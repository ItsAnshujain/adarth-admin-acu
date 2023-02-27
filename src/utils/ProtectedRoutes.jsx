import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useTokenIdStore from '../store/user.store';

const ProtectedRoutes = () => {
  const token = useTokenIdStore(state => state.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
