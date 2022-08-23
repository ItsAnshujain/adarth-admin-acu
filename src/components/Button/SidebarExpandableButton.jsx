import { useId, useState } from 'react';
import { Accordion } from '@mantine/core';
import classNames from 'classnames';
import { Mail } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const AccordionLabel = ({ label }) => (
  <div className="flex">
    <Mail className="h-5 text-[#969EA1]" />
    <span className="text-gray-400 font-medium text-sm ml-2">{label}</span>{' '}
  </div>
);

// TODO : add Links to text field in Accordion Item
const SidebarExpandableButton = ({ item, setOpened, sidebarText }) => {
  const id = useId();

  const [itemOpened, setItemOpened] = useState(0);
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
        },
      })}
      sx={theme => ({
        backgroundColor: theme.colors.white,
        'button': {
          padding: '8px',
        },
      })}
      chevronPosition="right"
    >
      <Accordion.Item value={id}>
        <Accordion.Control>
          <AccordionLabel {...item} />
        </Accordion.Control>
        <Accordion.Panel>
          <div className="ml-5">
            {item.content.map((text, index) => (
              <button
                type="button"
                onClick={() => {
                  setItemOpened(index);
                  if (index === 0 && sidebarText === 'Reports') {
                    navigate(`/${sidebarText.toLowerCase()}/campaign`);
                  } else if (index === 1 && sidebarText === 'Reports') {
                    navigate(`/${sidebarText.toLowerCase()}/revenue`);
                  } else if (index === 2 && sidebarText === 'Reports') {
                    navigate(`/${sidebarText.toLowerCase()}/inventory`);
                  }
                  // Used in smaller screens only
                  if (setOpened) setOpened(false);
                }}
                key={text}
                className={classNames(
                  ` font-medium text-xs block mt-0.5 ${
                    itemOpened === index ? 'text-black' : 'text-gray-400'
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
