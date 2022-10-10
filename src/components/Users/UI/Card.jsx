import { Image } from '@mantine/core';
import UserImage from '../../../assets/placeholders/user.png';

const UserCard = ({
  name = 'NA',
  role = 'NA',
  company = 'NA',
  email = 'NA',
  phone = 'NA',
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
        <p className="text-xl font-bold capitalize">{name}</p>
        <p className="text-[#914EFB] capitalize">{role}</p>
        <p>{company}</p>
      </div>
    </div>
    <div className="flex flex-col gap-1 mt-4">
      <p className="text-[#2938F7] text-sm">{email}</p>
      <p>{phone}</p>
    </div>
  </div>
);

export default UserCard;
