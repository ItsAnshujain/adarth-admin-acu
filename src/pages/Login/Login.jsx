import { Outlet } from 'react-router-dom';

import login from '../../assets/login.svg';

const Login = () => (
  <div className="flex">
    <div className="mr-16">
      <img src={login} alt="login" className="h-screen" />
    </div>

    <Outlet />
  </div>
);

export default Login;
