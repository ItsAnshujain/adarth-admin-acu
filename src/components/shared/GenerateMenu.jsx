import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const GenerateMenu = ({ location, locationCreate }) => {
  const navigate = useNavigate();
  return (
    <div
      aria-hidden
      onClick={e => e.stopPropagation()}
      className="absolute bg-white flex flex-col p-4 px-6 text-black z-70 border shadow-lg items-start top-[110%] gap-y-4 cursor-default"
    >
      <Button onClick={() => navigate(locationCreate)} className="flex-none text-black px-0">
        Manual Entry
      </Button>
      <Button onClick={() => navigate(location)} className="flex-none text-black px-0">
        Upload
      </Button>
    </div>
  );
};

export default GenerateMenu;
