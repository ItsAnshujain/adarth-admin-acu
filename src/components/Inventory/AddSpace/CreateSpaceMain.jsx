import { useNavigate } from 'react-router-dom';
import { Chip, Button } from '@mantine/core';
import { useState } from 'react';
import classNames from 'classnames';
import BasicInfo from './BasicInformation';
import Specification from './Specification';
import Location from './Location';
import SuccessModal from '../../shared/Modal';
import left from '../../../assets/back.svg';
import right from '../../../assets/front.svg';
import Preview from './Preview';

const initialState = ['Basic Information', 'Specifications', 'Location'];

const MainArea = () => {
  const navigate = useNavigate();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const [formData, setFormData] = useState({
    spacename: '',
    landlord: '',
    category: '',
    mediatype: '',
    supportedmedia: '',
    price: '',
    description: '',
  });

  const getForm = () =>
    formPage === 1 ? (
      <BasicInfo formData={formData} setFormData={setFormData} />
    ) : formPage === 2 ? (
      <Specification formData={formData} setFormData={setFormData} />
    ) : formPage === 3 ? (
      <Location formData={formData} setFormData={setFormData} />
    ) : (
      <Preview formData={formData} />
    );

  return (
    <>
      <div className="h-20 border-b border-gray-450 flex justify-between items-center">
        <div className="flex gap-6 pl-5 relative">
          {initialState.map((val, index) => (
            <Chip
              className={classNames(
                `relative ${
                  formPage >= 3 &&
                  index === 1 &&
                  'after:content-[""] after:absolute after:h-[2px] after:w-8 after:top-[50%] after:bg-purple-450 before:content-[""] before:absolute before:h-[2px] before:-left-6 before:w-6 before:top-[50%] before:bg-purple-450'
                }
                ${
                  formPage === 2 &&
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
                  backgroundColor: index + 2 <= formPage ? '#4B0DAF' : 'white',
                  color: index + 2 <= formPage ? 'white' : 'black',
                },
              })}
              checked
              variant="filled"
              color="gray"
              radius="xs"
              size="md"
            >
              <span className={classNames(`${index + 1 <= formPage ? 'text-purple-450' : ''}`)}>
                {val}
              </span>
            </Chip>
          ))}
        </div>
        <div className="flex gap-4 pr-7">
          <Button
            onClick={() => {
              if (formPage === 1) {
                navigate('/inventory');
              } else {
                setFormPage(formPage - 1);
              }
            }}
            className={classNames(`bg-black ${formPage === 1 ? 'order-1' : 'order-2'} `)}
          >
            <img className="mr-2" src={left} alt="back-arrow" />
            Back
          </Button>
          <Button
            className={classNames(
              `border-black radius-md text-black ${formPage === 1 ? 'order-2' : 'order-1'}`,
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (formPage <= 2) setFormPage(formPage + 1);
              if (formPage === 4) {
                setOpenSuccessModal(true);
                return;
              }
              setFormPage(formPage + 1);
            }}
            className="bg-purple-450 order-3"
          >
            {formPage === 3 ? 'Preview' : formPage === 4 ? 'Save' : 'Next'}
            {formPage < 3 && <img className="ml-1" src={right} alt="right-arrow" />}
          </Button>
        </div>
      </div>
      <div>
        <div>
          <form>{getForm()}</form>
        </div>
      </div>
      <SuccessModal open={openSuccessModal} setOpenSuccessModal={setOpenSuccessModal} id={1} />
    </>
  );
};

export default MainArea;
