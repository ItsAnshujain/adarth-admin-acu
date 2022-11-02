import { Image, Text } from '@mantine/core';
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
      <div className="border-radius-full">
        <Image
          src={image || UserImage}
          alt="profile pic"
          height={80}
          width={80}
          className="bg-gray-450 rounded-full"
        />
      </div>
      <div className="flex flex-col justify-between">
        <Text className="text-xl font-bold capitalize" lineClamp={2}>
          {name}
        </Text>
        <p className="text-[#914EFB]">{roleTypes.Role[role] || 'NA'}</p>
        <p>{company}</p>
      </div>
    </div>
    <div className="flex flex-col gap-1 mt-4">
      <div className="flex items-center">
        <Mail size={18} />
        <p className="ml-2 mb-1 text-[#2938F7] text-sm">{email}</p>
      </div>
      <div className="flex items-center">
        <Phone size={18} />
        <p className="ml-2 text-sm">{number}</p>
      </div>
    </div>
  </div>
);

export default UserCard;
