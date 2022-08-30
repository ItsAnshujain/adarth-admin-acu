import { useId, useState } from 'react';
import { Accordion } from '@mantine/core';
import classNames from 'classnames';
import { Mail } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import useSideBarState from '../../store/sidebar.store';

const AccordionLabel = props => {
  const { label, sidebarText, color, setColor } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    if (label === 'Reports') {
      navigate(`/${sidebarText.toLowerCase()}/campaign`);
      setColor(6);
    } else if (label === 'Masters') {
      navigate(`/${sidebarText.toLowerCase()}/category`);
      setColor(4);
    }
  };
  return (
    <div aria-hidden onClick={handleClick} className="flex">
      <Mail
        className={classNames(
          `h-5 ${
            (sidebarText === 'Reports' && color[6]) || (sidebarText === 'Masters' && color[4])
              ? 'text-purple-450'
              : 'text-[#969EA1]'
          }`,
        )}
      />
      <span className="text-gray-400 font-medium text-sm ml-2">{label}</span>{' '}
    </div>
  );
};

// TODO : add Links to text field in Accordion Item
const SidebarExpandableButton = ({ item, setOpened, sidebarText }) => {
  const id = useId();
  const { reports, masters, setReportColor, setMasterColor, setColor, color } = useSideBarState(
    state => ({
      reports: state.reports,
      masters: state.masters,
      setReportColor: state.setReportColor,
      setMasterColor: state.setMasterColor,
      color: state.color,
      setColor: state.setColor,
    }),
  );

  const navigate = useNavigate();

  return (
    <Accordion
      className={classNames(
        `${setOpened ? 'w-[207px]' : 'w-[213px]'} lg:max-w-[139px] xl:max-w-[213px]`,
      )}
      styles={theme => ({
        item: {
          border: 'none',
        },
        chevron: {
          color: theme.colors.gray[5],
          padding: '0px',
          margin: '0px',
        },
      })}
      sx={theme => ({
        backgroundColor: sidebarText === 'Reports' && color[6] ? '#F9FAFD' : theme.colors.white,
        'button': {
          padding: '8px',
        },
      })}
      chevronPosition="right"
    >
      <Accordion.Item value={id}>
        <Accordion.Control>
          <AccordionLabel {...item} sidebarText={sidebarText} color={color} setColor={setColor} />
        </Accordion.Control>
        <Accordion.Panel>
          <div className="ml-5">
            {item.content.map((text, index) => (
              <button
                type="button"
                onClick={() => {
                  if (sidebarText === 'Reports') {
                    setReportColor(index);
                  } else if (sidebarText === 'Masters') {
                    setMasterColor(index);
                  }

                  if (index === 0 && sidebarText === 'Reports') {
                    navigate(`/${sidebarText.toLowerCase()}/campaign`);
                  } else if (index === 1 && sidebarText === 'Reports') {
                    navigate(`/${sidebarText.toLowerCase()}/revenue`);
                  } else if (index === 2 && sidebarText === 'Reports') {
                    navigate(`/${sidebarText.toLowerCase()}/inventory`);
                  } else if (index === 0 && sidebarText === 'Masters') {
                    navigate(`/${sidebarText.toLowerCase()}/category`);
                  } else if (index === 1 && sidebarText === 'Masters') {
                    navigate(`/${sidebarText.toLowerCase()}/brand`);
                  }
                  // } else if (index === 2 && sidebarText === 'Masters') {
                  //   navigate(`/${sidebarText.toLowerCase()}/industry`);
                  // } else if (index === 3 && sidebarText === 'Masters') {
                  //   navigate(`/${sidebarText.toLowerCase()}/illumination`);
                  // }
                  // Used in smaller screens only
                  if (setOpened) setOpened(false);
                }}
                key={text}
                className={classNames(
                  ` font-medium text-xs block mt-0.5 ${
                    (sidebarText === 'Reports' && reports[index]) ||
                    (sidebarText === 'Masters' && masters[index])
                      ? 'text-black'
                      : 'text-gray-400'
                  }`,
                )}
              >
                {text}
              </button>
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default SidebarExpandableButton;
