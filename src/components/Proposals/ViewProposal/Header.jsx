import { Button } from '@mantine/core';
import { ArrowLeft, Mail } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import link from '../../../assets/link.svg';
import whatsapp from '../../../assets/whatsapp.svg';

const Header = ({ showShare, setShowShare }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const id = pathname.split('/')[3];

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <div>
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        />
      </div>
      <div className="flex gap-4">
        <Button className="border-black text-black radius-md">Download PDF</Button>
        <div className="relative">
          <Button
            onClick={e => {
              e.stopPropagation();
              setShowShare(!showShare);
            }}
            className="bg-black"
          >
            Share
          </Button>
          {showShare && (
            <div className="absolute flex flex-col text-gray-400 bg-white border w-max p-4 gap-4 -translate-x-32 shadow-xl rounded-md">
              <div className="flex gap-2">
                <Mail className="text-[#969EA1]" />
                <span className="flex-none">Send Email</span>
              </div>
              <div className="flex gap-2">
                <img className="flex-none" src={whatsapp} alt="whatsapp" />
                <span className="flex-none">Whatsapp</span>
              </div>
              <div className="flex gap-2 border p-2 rounded-md w-44">
                <img className="flex-none" src={link} alt="link" />
                <span className="flex-none">Copy Link</span>
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={() => navigate(`/proposals/edit-details/${id}`)}
          className="bg-purple-450 order-3"
        >
          Edit Proposal
        </Button>
      </div>
    </div>
  );
};

export default Header;
