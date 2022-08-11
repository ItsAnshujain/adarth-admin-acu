import { Accordion } from '@mantine/core';
import classNames from 'classnames';
import { useId } from 'react';
import { Mail } from 'react-feather';

const AccordionLabel = ({ label }) => (
  <div className="flex">
    <Mail className="h-5 text-[#969EA1]" />
    <span className="text-gray-400 font-medium text-sm ml-2">{label}</span>{' '}
  </div>
);

// TODO : add Links to text field in Accordion Item
const SidebarExpandableButton = ({ item, setOpened }) => {
  const id = useId();

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
            {item.content.map(text => (
              <button
                type="button"
                onClick={() => setOpened && setOpened(false)}
                key={text}
                className="text-gray-400 font-medium text-sm block"
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
