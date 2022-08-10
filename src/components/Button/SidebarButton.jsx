import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import SidebarExpandableButton from './SidebarExpandableButton';
import Mail from '../../assets/Icons/Mail';

const SidebarButton = ({ text, index, color, clickHandler }) => {
  const navigate = useNavigate();
  if (index === 4 || index === 6 || index === 7) {
    const dataObj = { content: ['Hey', 'Dude', 'Whatsup'], label: text };
    return (
      <div className="ml-4 p-0 border">
        <SidebarExpandableButton item={dataObj} />
      </div>
    );
  }

  return (
    <div className="ml-4 flex w-full">
      <button
        onClick={() => {
          clickHandler(index);
          navigate(`/${text.toLowerCase()}`);
        }}
        className="p-2 border-gray-450 border flex w-full max-w-[210px] lg:max-w-[140px] xl:max-w-[215px]"
        type="button"
      >
        <div className="mr-2">
          <Mail stroke={`${color[index] ? '#914EFB' : '#969EA1'}`} />
        </div>
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
