import classNames from 'classnames';
import { Mail } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import SidebarExpandableButton from './SidebarExpandableButton';

const SidebarButton = ({ text, index, color, clickHandler, setOpened }) => {
  const navigate = useNavigate();
  if (index === 4) {
    const dataObj = {
      content: ['Category', 'Brands', 'Industry', 'Illumination'],
      label: text,
    };
    return (
      <div className="ml-4 p-0 border">
        <SidebarExpandableButton sidebarText={text} item={dataObj} setOpened={setOpened} />
      </div>
    );
  }

  if (index === 6) {
    const dataObj = {
      content: ['Campaign Report', 'Revenue Reports', 'Inventory Report'],
      label: text,
    };

    return (
      <div className="ml-4 p-0 border">
        <SidebarExpandableButton sidebarText={text} item={dataObj} setOpened={setOpened} />
      </div>
    );
  }

  return (
    <div className="ml-4 flex w-full">
      <button
        onClick={() => {
          clickHandler(index);
          navigate(`/${text.toLowerCase()}`);
          if (setOpened) setOpened(false);
        }}
        className="p-2 border-gray-450 border flex w-full max-w-[210px] lg:max-w-[140px] xl:max-w-[215px]"
        type="button"
      >
        <Mail
          className={classNames(`mr-2 h-5 ${color[index] ? 'text-[#914EFB]' : 'text-[#969EA1]'}`)}
        />
        <span
          className={classNames(
            color[index] ? 'text-purple-450' : 'text-gray-400',
            'font-medium text-sm',
          )}
        >
          {text}
        </span>
      </button>
    </div>
  );
};

export default SidebarButton;
