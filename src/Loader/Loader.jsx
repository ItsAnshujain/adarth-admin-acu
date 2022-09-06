import { Loader } from '@mantine/core';

const CustomLoader = () => (
  <div className="flex justify-center items-center w-screen h-[calc(100vh-80px)]">
    <Loader />
  </div>
);

export default CustomLoader;
