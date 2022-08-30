const UserCard = ({ name, designation, company, email, phone, image }) => (
  <div className="mr-[19px] border rounded-md p-4 mb-10 cursor-pointer">
    <div className="flex gap-4">
      <div className="border-radius-full">
        <img src={image} alt="profile pic" />
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-xl font-bold">{name}</p>
        <p className="text-[#914EFB]">{designation}</p>
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