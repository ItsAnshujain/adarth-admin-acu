import { Chip, Button } from '@mantine/core';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import back from '../../../assets/back.svg';
import front from '../../../assets/front.svg';

const initialState = ['Basic Information', 'Specifications'];

const Header = ({ setFormStep, formStep, setOpenSuccessModal }) => {
  const navigate = useNavigate();
  return (
    <div className="h-20 border-b border-gray-450 flex justify-between items-center w-full">
      <div className="flex gap-6 pl-5 relative">
        {initialState.map((val, index) => (
          <Chip
            className={classNames(
              `relative ${
                formStep > 1 &&
                index === 0 &&
                'after:content-[""] after:absolute after:h-[2px] after:w-8 after:top-[50%] after:bg-purple-450'
              } `,
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
                backgroundColor: index + 1 <= formStep ? '#4B0DAF' : 'white',
                color: index + 1 <= formStep ? 'white' : 'black',
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

      <div className="flex gap-4 pr-7 ">
        <Button className="border-black text-black radius-md">Cancel</Button>
        <Button
          onClick={() => {
            if (formStep === 1) {
              navigate('/proposals');
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
            if (formStep < 2) setFormStep(formStep + 1);
            if (formStep === 2) {
              setOpenSuccessModal(true);
            }
          }}
          className="bg-purple-450 order-3"
        >
          {formStep === 2 ? 'Save' : 'Next'}
          {formStep < 2 && <img className="ml-1" src={front} alt="right-arrow" />}
        </Button>
      </div>
    </div>
  );
};

export default Header;
