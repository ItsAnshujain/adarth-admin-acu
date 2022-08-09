import { Chip, Button } from '@mantine/core';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import back from '../../../assets/back.svg';
import front from '../../../assets/front.svg';

const initialState = ['Basic Information', 'Specifications', 'Location'];

const Header = ({ setFormStep, formStep, setOpenSuccessModal }) => {
  const navigate = useNavigate();
  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center">
      <div className="flex gap-6 pl-5 relative">
        {initialState.map((val, index) => (
          <Chip
            className={classNames(
              `relative ${
                formStep >= 3 &&
                index === 1 &&
                'after:content-[""] after:absolute after:h-[2px] after:w-8 after:top-[50%] after:bg-purple-450 before:content-[""] before:absolute before:h-[2px] before:-left-6 before:w-6 before:top-[50%] before:bg-purple-450'
              }
                ${
                  formStep === 2 &&
                  index === 1 &&
                  'before:content-[""] before:absolute before:h-[2px] before:-left-6 before:w-6 before:top-[50%] before:bg-purple-450'
                }`,
            )}
            key={val}
            styles={() => ({
              checkIcon: {
                position: 'absolute',
                top: '6px',
                padding: '2px',
                height: '20px',
                width: '20px',
                borderRadius: '100px',
                backgroundColor: index + 2 <= formStep ? '#4B0DAF' : 'white',
                color: index + 2 <= formStep ? 'white' : 'black',
              },
            })}
            checked
            variant="filled"
            color="gray"
            radius="xs"
            size="md"
          >
            <span className={classNames(`${index + 1 <= formStep ? 'text-purple-450' : ''}`)}>
              {val}
            </span>
          </Chip>
        ))}
      </div>
      <div className="flex gap-4 pr-7">
        <Button className="border-black radius-md text-black">Cancel</Button>
        <Button
          onClick={() => {
            if (formStep === 1) {
              navigate('/inventory');
            } else {
              setFormStep(formStep - 1);
            }
          }}
          className="bg-black"
        >
          <img className="mr-2" src={back} alt="back-arrow" />
          Back
        </Button>

        <Button
          onClick={() => {
            if (formStep <= 2) setFormStep(formStep + 1);
            if (formStep === 4) {
              setOpenSuccessModal(true);
              return;
            }
            setFormStep(formStep + 1);
          }}
          className="bg-purple-450 order-3"
        >
          {formStep === 3 ? 'Preview' : formStep === 4 ? 'Save' : 'Next'}
          {formStep < 3 && <img className="ml-1" src={front} alt="right-arrow" />}
        </Button>
      </div>
    </div>
  );
};

export default Header;
