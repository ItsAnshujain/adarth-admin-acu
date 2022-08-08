import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import SidebarExpandableButton from './SidebarExpandableButton';
import Mail from '../../assets/Icons/Mail';

const SidebarButton = ({ text, index, color, clickHandler }) => {
  const navigate = useNavigate();
  if (index === 4 || index === 6 || index === 7) {
    const dataObj = { content: ['Hey', 'Dude', 'Whatsup'], label: text };
    return (
      <div className="ml-4 p-0 w-44 border">
        <SidebarExpandableButton item={dataObj} />
      </div>
    );
  }

  return (
    <div className="ml-4 flex">
      <button
        onClick={() => {
          clickHandler(index);
          navigate(`/${text.toLowerCase()}`);
        }}
        className={classNames(
          'p-2 border-gray-450 border flex sm:w-auto md:w-44',
          color[index] ? 'text-purple-450' : '',
        )}
        type="button"
      >
        <div className="mr-2">
          <Mail stroke={`${color[index] ? '#914EFB' : '#969EA1'}`} />
        </div>
        {text}
      </button>
    </div>
  );
};

export default SidebarButton;
