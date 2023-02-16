import { Button, Image, Menu } from '@mantine/core';
import { ArrowLeft, Mail, Link as LinkIcon } from 'react-feather';
import { Link, useNavigate, useParams } from 'react-router-dom';
import whatsapp from '../../../assets/whatsapp.svg';

const Header = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleBack = () => navigate('/proposals');

  return (
    <div className="h-[60px] border-b border-gray-450 flex justify-between items-center pl-5 pr-5">
      <div>
        <ArrowLeft className="cursor-pointer" onClick={handleBack} />
      </div>
      <div className="flex gap-4">
        <Button className="border-black text-black radius-md">Download PDF</Button>
        <div className="relative">
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <Button className="bg-black">Share</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<Mail className="text-[#969EA1] h-5" />}>
                <span className="text-gray-400 font-medium text-base">Send Email</span>
              </Menu.Item>
              <Menu.Item icon={<Image src={whatsapp} alt="whatsapp" className="h-4 ml-1" />}>
                <span className="text-gray-400 font-medium text-base">Whatsapp</span>
              </Menu.Item>
              <Menu.Item icon={<LinkIcon className="h-4" color="#969EA1" />}>
                <span className="text-gray-400 font-medium text-base">Copy Link</span>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div>
          <Link
            to={`/proposals/edit-details/${id}`}
            className="bg-purple-450 flex items-center text-white rounded-md px-4 h-full font-bold text-sm"
          >
            Edit Proposal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
