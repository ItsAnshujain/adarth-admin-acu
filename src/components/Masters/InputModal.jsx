import { Modal } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { ControlledFormTextInput } from '../Input/FormInput';
import { useCreateMaster, useUpdateMaster } from '../../hooks/masters.hooks';

const defaultValues = {
  name: '',
};

const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
});

const InputModal = ({ opened, setOpened, isEdit = false, masterData }) => {
  const { pathname } = useLocation();
  const { mutate: create, isLoading, isSuccess } = useCreateMaster();
  const {
    mutate: edit,
    isLoading: isUpdateMasterLoading,
    isSuccess: isUpdateMasterSuccess,
  } = useUpdateMaster();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const onSubmit = formData => {
    let data = {};
    const arr = pathname.split('/');
    if (arr.includes('masters')) {
      const type = arr[arr.length - 1];
      data = { ...formData, type };
      if (isEdit) {
        edit({ masterId: masterData?._id, data });
      } else {
        create(data);
      }

      if (isSuccess || isUpdateMasterSuccess) setOpened(false);
    }
  };

  React.useEffect(() => {
    if (isEdit) {
      setValue('name', masterData?.name);
    }
  }, [isEdit]);

  return (
    <Modal
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '20px',
        },
      }}
      size="lg"
      title={`${isEdit ? 'Edit' : 'Add'} ${pathname.includes('brand') ? 'Brand' : 'Category'}`}
      opened={opened}
      withCloseButton={false}
      centered
    >
      <form className="border-t" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 relative py-3 ">
          <p>{pathname.includes('brand') ? 'Brand' : 'Category'} Name</p>
          <ControlledFormTextInput
            name="name"
            placeholder="Category Name"
            size="lg"
            isLoading={isLoading || isUpdateMasterLoading}
            control={control}
            errors={errors}
          />
          <div className="flex gap-2  justify-end">
            <button
              onClick={() => setOpened(false)}
              type="button"
              className="bg-black text-white  rounded-md text-sm p-2"
              disabled={isLoading || isUpdateMasterLoading}
            >
              Cancel
            </button>
            <button type="submit" className="bg-purple-450 text-white rounded-md text-sm p-2">
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default InputModal;
