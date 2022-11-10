import { Button, Image, Menu } from '@mantine/core';
import { ArrowLeft, Mail } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import link from '../../../assets/link.svg';
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
          <Menu shadow="md">
            <Menu.Target>
              <Button className="bg-black">Share</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item className="flex gap-2" icon={<Mail className="text-[#969EA1]" />}>
                <span className="text-gray-400 text-lg">Send Email</span>
              </Menu.Item>
              <Menu.Item
                className="flex gap-2"
                icon={<Image src={whatsapp} alt="whatsapp" height={24} width={24} />}
              >
                <span className="text-gray-400 text-lg">Whatsapp</span>
              </Menu.Item>
              <Menu.Item
                className="flex gap-2 border p-2 rounded-md w-44"
                icon={<Image className="flex-none" src={link} alt="link" height={24} width={24} />}
              >
                <span className="text-gray-400 text-lg">Copy Link</span>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
