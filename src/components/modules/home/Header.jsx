const Header = ({ text }) => (
  <div className="h-[60px] border-b border-gray-450 flex items-center">
    <div className="pl-5">
      <p className="text-lg font-bold">{text}</p>
    </div>
  </div>
);

export default Header;
