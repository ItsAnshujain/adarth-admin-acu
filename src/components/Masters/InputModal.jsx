import { Menu, Modal } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useLocation, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'react-feather';
import { ControlledFormTextInput } from '../Input/FormInput';
import { useCreateMaster, useFetchMasters, useUpdateMaster } from '../../hooks/masters.hooks';
import { masterTypes, serialize } from '../../utils';

const defaultValues = {
  name: '',
};

const schema = yup.object().shape({
  name: yup.string().trim().required('Category name is required'),
});

const InputModal = ({ opened, setOpened, isEdit = false, masterData }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: 'category',
    parentId: null,
    limit: 10,
    page: 1,
  });
  const [menuValue, setMenuValue] = useState();
  const { data: parentData } = useFetchMasters(serialize(query));

  const { mutate: create, isLoading } = useCreateMaster();
  const { mutate: edit, isLoading: isUpdateMasterLoading } = useUpdateMaster();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  const masterType = useMemo(
    () => masterTypes[searchParams.get('type')],
    [searchParams.get('type')],
  );

  const onSubmit = formData => {
    let data = {};
    const type = searchParams.get('type');
    const parentId = searchParams.get('parentId');
    data = { ...formData, type };
    if (menuValue?.id) {
      data = { ...formData, type, parentId: menuValue?.id };
    } else if (parentId !== 'null') {
      data = { ...formData, type, parentId };
    }
    if (isEdit) {
      edit({ masterId: masterData?._id, data });
    } else {
      create(data);
    }
    reset();
    setOpened(false);
  };

  useEffect(() => {
    if (isEdit) {
      setValue('name', masterData?.name);
    }
  }, [isEdit]);

  useEffect(() => {
    const type = searchParams.get('type');
    setQuery({ ...query, type });
  }, [location.search]);

  return (
    <Modal
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '20px',
        },
      }}
      size="lg"
      title={`${isEdit ? 'Edit' : 'Add'} ${masterType}`}
      opened={opened}
      withCloseButton={false}
      centered
      onClose={() => setOpened(false)}
    >
      <form className="border-t" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 relative py-3 ">
          <p>{masterType} Name</p>
          <ControlledFormTextInput
            name="name"
            placeholder={`${masterType} Name`}
            size="lg"
            isLoading={isLoading || isUpdateMasterLoading}
            control={control}
            errors={errors}
          />
          {searchParams.get('parentId') !== 'null' ? (
            <>
              <p>Parent List</p>
              <Menu shadow="md" width="100%">
                <Menu.Target>
                  <button
                    type="button"
                    className="h-[50px] border-solid text-lg border-2 flex flex-row justify-between items-center px-5 rounded-sm	"
                  >
                    {menuValue?.name || 'Select..'}
                    <ChevronDown className="h-4" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  {parentData?.docs?.map(item => (
                    <Menu.Item
                      onClick={() => {
                        setMenuValue({
                          name: item?.name,
                          id: item?._id,
                        });
                      }}
                      key={item?._id}
                    >
                      <span className="text-base">{item?.name}</span>
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </>
          ) : null}
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
