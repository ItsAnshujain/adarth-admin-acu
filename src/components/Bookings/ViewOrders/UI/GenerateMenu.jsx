import { useNavigate } from 'react-router-dom';

const GenerateMenu = ({ location }) => {
  const navigate = useNavigate();
  return (
    <div
      aria-hidden
      onClick={e => e.stopPropagation()}
      className="absolute bg-white flex flex-col p-4 px-6 text-black z-70 border shadow-lg items-start top-[110%] gap-y-4 cursor-default"
    >
      <button type="button" className="flex-none">
        Manual Entry
      </button>
      <button onClick={() => navigate(location)} type="button" className="flex-none">
        Upload
      </button>
    </div>
  );
};

export default GenerateMenu;
