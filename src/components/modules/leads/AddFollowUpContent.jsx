import { Button, Image } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import ControlledSelect from '../../shared/FormInputs/Controlled/ControlledSelect';
import ControlledTextarea from '../../shared/FormInputs/Controlled/ControlledTextarea';
import { leadCommunicationTypeOptions, leadStageOptions } from '../../../utils/constants';
import useUserStore from '../../../store/user.store';
import { useInfiniteUsers } from '../../../apis/queries/users.queries';
import DropdownWithHandler from '../../shared/SelectDropdown/DropdownWithHandler';
import ControlledDatePickerInput from '../../shared/FormInputs/Controlled/ControlledDatePickerInput';
import CalendarIcon from '../../../assets/calendar.svg';
import useAddFollowUp from '../../../apis/queries/followup.queries';

const AddFollowUpContent = ({ onCancel, leadId }) => {
  const addFollowUpHandler = useAddFollowUp();
  const queryClient = useQueryClient();
  const form = useForm();
  const userId = useUserStore(state => state.id);
  const user = queryClient.getQueryData(['users-by-id', userId]);

  const usersQuery = useInfiniteUsers({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    filter: 'team',
  });

  const memoizedUsers = useMemo(
    () =>
      usersQuery.data?.pages
        .reduce((acc, { docs }) => [...acc, ...docs], [])
        .map(doc => ({
          ...doc,
          label: doc.name,
          value: doc._id,
        })) || [],
    [usersQuery?.data],
  );

  const usersDropdown = useMemo(
    () =>
      DropdownWithHandler(
        () => usersQuery.fetchNextPage(),
        usersQuery.isFetchingNextPage,
        usersQuery.hasNextPage,
      ),
    [usersQuery?.data],
  );

  const onSubmit = form.handleSubmit(formData => {
    const {
      primaryInCharge,
      secondaryInCharge,
      leadStage,
      communicationType,
      notes,
      followUpDate,
      nextFollowUpDate,
    } = formData;

    if (
      !primaryInCharge &&
      !secondaryInCharge &&
      !leadStage &&
      !communicationType &&
      !notes &&
      !followUpDate &&
      !nextFollowUpDate
    ) {
      showNotification({
        message: 'Please fill the form',
        color: 'red',
      });
      return;
    }

    if (primaryInCharge === secondaryInCharge) {
      showNotification({
        message: 'Primary and Secondary Incharge should not be same.',
        color: 'red',
      });
      return;
    }

    const data = {
      leadStage,
      communicationType,
      followUpDate: followUpDate ? dayjs(followUpDate).endOf('day').toISOString() : undefined,
      notes: notes || undefined,
      nextFollowUpDate: nextFollowUpDate
        ? dayjs(nextFollowUpDate).endOf('day').toISOString()
        : null,
      primaryInCharge,
      secondaryInCharge,
      id: leadId,
    };

    addFollowUpHandler.mutate(data, {
      onSuccess: () => {
        showNotification({
          message: 'Follow Up added successfully',
        });
        onCancel();
      },
    });
  });

  useEffect(() => {
    form.setValue('primaryInCharge', user?._id);
    form.setValue('leadStage', leadStageOptions[0].value);
    form.setValue('communicationType', leadCommunicationTypeOptions[0].value);
    form.setValue('followUpDate', dayjs());
  }, [user]);

  const labelClass = 'font-bold text-base';
  const datePickerClass = { icon: 'flex justify-end w-full pr-2', input: 'pl-2' };

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="pb-4">
          <div className="text-xl font-bold w-full py-4">Basic Information</div>
          <div className="grid grid-cols-2 gap-4">
            <ControlledSelect
              searchable
              placeholder="Select..."
              name="leadStage"
              label="Lead Stage"
              data={leadStageOptions}
              classNames={{ label: labelClass }}
            />
            <ControlledSelect
              searchable
              placeholder="Select..."
              name="communicationType"
              label="Communication Type"
              data={leadCommunicationTypeOptions}
              classNames={{ label: labelClass }}
            />
            <ControlledDatePickerInput
              name="followUpDate"
              label="Follow Up Date"
              classNames={{ label: labelClass, ...datePickerClass }}
              icon={<Image src={CalendarIcon} alt="icon" width={20} />}
            />
            <ControlledDatePickerInput
              name="nextFollowUpDate"
              label="Next Follow Up Date"
              classNames={{ label: labelClass, ...datePickerClass }}
              icon={<Image src={CalendarIcon} alt="icon" width={20} />}
            />
            <ControlledSelect
              searchable
              placeholder="Select..."
              name="primaryInCharge"
              label="Primary Incharge"
              data={
                user._id && memoizedUsers?.filter(item => item.value === user._id).length <= 0
                  ? [
                      ...memoizedUsers,
                      {
                        value: user._id,
                        label: user.name,
                      },
                    ] || []
                  : memoizedUsers || []
              }
              dropdownComponent={usersDropdown}
              classNames={{ label: labelClass }}
            />
            <ControlledSelect
              clearable
              searchable
              placeholder="Select..."
              name="secondaryInCharge"
              label="Secondary Incharge"
              data={
                user._id && memoizedUsers?.filter(item => item.value === user._id).length <= 0
                  ? [
                      ...memoizedUsers,
                      {
                        value: user._id,
                        label: user.name,
                      },
                    ] || []
                  : memoizedUsers || []
              }
              dropdownComponent={usersDropdown}
              classNames={{ label: labelClass }}
            />
          </div>
          <ControlledTextarea
            name="notes"
            label="Notes"
            minRows={4}
            className="pt-4"
            classNames={{ label: labelClass }}
          />
          <div className="py-4 flex gap-4 justify-end">
            <Button
              variant="default"
              color="dark"
              className="font-normal bg-black text-white"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-purple-450 font-normal text-white"
              loading={addFollowUpHandler.isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddFollowUpContent;
