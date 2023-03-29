import { Avatar } from '@mantine/core';
import { Phone, Mail } from 'react-feather';
import UserImage from '../../../assets/placeholders/user.png';
import { roleTypes } from '../../../utils';

const UserCard = ({
  name = 'NA',
  role = 'NA',
  company = 'NA',
  email = 'NA',
  number = 'NA',
  image,
}) => (
  <div className="border rounded-md p-4 cursor-pointer">
    <div className="flex gap-4">
      <Avatar size="xl" src={image || UserImage} className="rounded-full" />
      <div className="flex flex-col justify-between overflow-hidden overflow-ellipsis">
        <p
          className="text-xl font-bold capitalize overflow-x-hidden overflow-ellipsis"
          title={name}
        >
          {name}
        </p>
        <p className="text-[#914EFB]">{roleTypes[role] || 'NA'}</p>
        <p>{company}</p>
      </div>
    </div>
    <div className="flex flex-col gap-1 mt-4">
      <div className="flex items-center">
        <Mail size={18} />
        <p
          className="ml-2 mb-1 text-[#2938F7] text-sm overflow-x-hidden overflow-ellipsis"
          title={email}
        >
          {email}
        </p>
      </div>
      <div className="flex items-center">
        <Phone size={18} />
        <p className="ml-2 text-sm">{number}</p>
      </div>
    </div>
  </div>
);

export default UserCard;
