import { Outlet } from 'react-router-dom';

import login from '../../assets/login.svg';

const Login = () => (
  <div className="flex">
    <div className="hidden md:mr-16 md:block">
      <img src={login} alt="login" className="h-screen" />
    </div>
    <Outlet />
  </div>
);

export default Login;
