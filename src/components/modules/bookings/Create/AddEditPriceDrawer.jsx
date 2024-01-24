import { Carousel } from '@mantine/carousel';
import { Button, Checkbox, Divider, Drawer } from '@mantine/core';
import { useEffect, useMemo, useState, useCallback } from 'react';
import * as yup from 'yup';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledNumberInput from '../../../shared/FormInputs/Controlled/ControlledNumberInput';
import { indianCurrencyInDecimals } from '../../../../utils';

const schema = yup.object({
  displayCostPerMonth: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Display cost per month is required'),
  displayCostGstPercentage: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Gst is required'),
  totalDisplayCost: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Total display cost is required'),
  displayCostPerSqFt: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Display cost per sq. ft. is required'),
  tradedAmount: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Traded Amount is required'),
  printingCostPerSqft: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Printing cost per sq. ft. is required'),
  printingGstPercentage: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Gst is required'),
  mountingGstPercentage: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Gst is required'),
  totalPrintingCost: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Total printing cost is required'),
  mountingCostPerSqft: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Mounting cost per sq. ft. is required'),
  totalMountingCost: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Total mounting cost is required'),
  oneTimeInstallationCost: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('One-time installation cost is required'),
  monthlyAdditionalCost: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Monthly additional cost is required'),
  otherCharges: yup
    .number()
    .typeError('Must be a number')
    .nullable()
    .required('Other Charges is required'),
});

const defaultValues = {
  displayCostPerMonth: 0,
  displayCostGstPercentage: 0,
  totalDisplayCost: 0,
  displayCostPerSqFt: 0,
  tradedAmount: 0,
  printingCostPerSqft: 0,
  printingGstPercentage: 0,
  mountingGstPercentage: 0,
  totalPrintingCost: 0,
  mountingCostPerSqft: 0,
  totalMountingCost: 0,
  oneTimeInstallationCost: 0,
  monthlyAdditionalCost: 0,
  otherCharges: 0,
  applyPrintingMountingCostForAll: true,
};

const AddEditPriceDrawer = ({
  isOpened,
  onClose,
  selectedInventories,
  styles = {},
  selectedInventoryId,
  type,
}) => {
  const formContext = useFormContext();
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const [activeSlide, setActiveSlide] = useState();

  const watchDisplayCostPerMonth = form.watch('displayCostPerMonth');
  const watchDisplayCostPerSqFt = form.watch('displayCostPerSqFt');
  const watchDisplayCostGstPercentage = form.watch('displayCostGstPercentage');

  const watchPrintingCostPerSqft = form.watch('printingCostPerSqft');
  const watchMountingCostPerSqft = form.watch('mountingCostPerSqft');
  const watchPrintingGstPercentage = form.watch('printingGstPercentage');
  const watchMountingGstPercentage = form.watch('mountingGstPercentage');

  const watchApplyPrintingMountingCostForAll = form.watch('applyPrintingMountingCostForAll');

  const calculateTotalMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const dayDiff = end.getDate() - start.getDate() + 1;

    const totalMonths = yearDiff * 12 + monthDiff;

    const fractionOfMonth = dayDiff / new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();

    return totalMonths + fractionOfMonth;
  };

  const selectedInventory = useMemo(
    () => selectedInventories?.[activeSlide || 0],
    [selectedInventories, activeSlide],
  );

  const totalMonths = useMemo(
    () => calculateTotalMonths(selectedInventory?.startDate, selectedInventory?.endDate),
    [selectedInventory?.startDate, selectedInventory?.endDate],
  );

  const totalArea = useMemo(
    () =>
      selectedInventory?.dimension?.reduce(
        (accumulator, dimension) => accumulator + dimension.height * dimension.width,
        0,
      ) || 0,
    [selectedInventory?.dimension],
  );

  const {
    totalDisplayCost,
    tradedAmount,
    totalPrintingCost,
    totalMountingCost,
    oneTimeInstallationCost,
    monthlyAdditionalCost,
    otherCharges,
  } = form.watch();

  const totalPrice = useMemo(
    () =>
      totalDisplayCost +
      tradedAmount +
      totalPrintingCost +
      totalMountingCost +
      oneTimeInstallationCost +
      monthlyAdditionalCost -
      otherCharges,
    [
      totalDisplayCost,
      tradedAmount,
      totalPrintingCost,
      totalMountingCost,
      oneTimeInstallationCost,
      monthlyAdditionalCost,
      otherCharges,
    ],
  );

  const onChangeDisplayCostPerMonth = useCallback(() => {
    const displayCostPerMonth = watchDisplayCostPerMonth * totalMonths || 0;
    form.setValue(
      'totalDisplayCost',
      displayCostPerMonth + displayCostPerMonth * ((watchDisplayCostGstPercentage || 0) / 100),
    );
    form.setValue('displayCostPerSqFt', (watchDisplayCostPerMonth || 0) / totalArea);
  }, [watchDisplayCostPerMonth, watchDisplayCostGstPercentage]);

  const onChangeDisplayCostPerSqFt = useCallback(() => {
    const displayCostPerSqFt = watchDisplayCostPerSqFt * totalArea || 0;

    form.setValue(
      'totalDisplayCost',
      displayCostPerSqFt + displayCostPerSqFt * ((watchDisplayCostGstPercentage || 0) / 100),
    );
    form.setValue('displayCostPerMonth', (watchDisplayCostPerSqFt || 0) * totalArea);
  }, [watchDisplayCostPerSqFt, watchDisplayCostGstPercentage]);

  const onChangeDisplayCostPercentage = useCallback(() => {
    const displayCostPerSqFt = watchDisplayCostPerSqFt * totalArea || 0;

    form.setValue(
      'totalDisplayCost',
      displayCostPerSqFt + displayCostPerSqFt * ((watchDisplayCostGstPercentage || 0) / 100),
    );
    form.setValue('displayCostPerMonth', (watchDisplayCostPerSqFt || 0) * totalArea);
  }, [watchDisplayCostPerSqFt, watchDisplayCostPerMonth, watchDisplayCostGstPercentage]);

  useEffect(() => {
    const printingCost = (watchPrintingCostPerSqft * totalArea) / totalMonths || 0;
    form.setValue(
      'totalPrintingCost',
      printingCost + printingCost * ((watchPrintingGstPercentage || 0) / 100),
    );
  }, [watchPrintingCostPerSqft, watchPrintingGstPercentage]);

  useEffect(() => {
    const mountingCost = (watchMountingCostPerSqft * totalArea) / totalMonths || 0;
    form.setValue(
      'totalMountingCost',
      mountingCost + mountingCost * ((watchMountingGstPercentage || 0) / 100),
    );
  }, [watchMountingCostPerSqft, watchMountingGstPercentage]);
  const watchPlace = formContext.watch('place');

  const onSubmit = async formData => {
    if (type === 'bookings') {
      formContext.setValue(
        'place',
        watchPlace?.map(place =>
          place?._id === (activeSlide ? selectedInventory?._id : selectedInventoryId)
            ? {
                ...place,
                displayCostPerMonth: formData.displayCostPerMonth,
                totalDisplayCost: formData.totalDisplayCost,
                displayCostPerSqFt: formData.displayCostPerSqFt,
                displayCostGstPercentage: formData.displayCostGstPercentage,
                displayCostGst: formData.displayCostGst,
                printingCostPerSqft: formData.printingCostPerSqft,
                printingGstPercentage: formData.printingGstPercentage,
                printingGst: formData.printingGst,
                totalPrintingCost: formData.totalPrintingCost,
                mountingCostPerSqft: formData.mountingCostPerSqft,
                mountingGstPercentage: formData.mountingGstPercentage,
                mountingGst: formData.mountingGst,
                totalMountingCost: formData.totalMountingCost,
                oneTimeInstallationCost: formData.oneTimeInstallationCost,
                monthlyAdditionalCost: formData.monthlyAdditionalCost,
                otherCharges: formData.otherCharges,
                tradedAmount: formData.tradedAmount,
                subjectToExtension: true,
                price: totalPrice,
                totalArea,
                discountOn: '',
                discountedDisplayCost: 0,
                discountedTotalPrice: 0,

                priceChanged: true,
              }
            : watchApplyPrintingMountingCostForAll
            ? {
                ...place,
                printingCostPerSqft: formData.printingCostPerSqft,
                printingGst: formData.printingGst,
                totalPrintingCost: formData.totalPrintingCost,
                mountingCostPerSqft: formData.mountingCostPerSqft,
                mountingGst: formData.mountingGst,
                totalMountingCost: formData.totalMountingCost,
                totalPrice:
                  place.totalDisplayCost ||
                  0 + place.tradedAmount ||
                  0 + formData.totalPrintingCost ||
                  0 + formData.totalMountingCost ||
                  0 + place.oneTimeInstallationCost ||
                  0 + place.monthlyAdditionalCost ||
                  0 - place.otherCharges ||
                  0,
              }
            : place,
        ),
      );
    } else {
      formContext.setValue(
        'spaces',
        selectedInventories?.map(place =>
          place?._id === (activeSlide ? selectedInventory?._id : selectedInventoryId)
            ? {
                ...place,
                displayCostPerMonth: formData.displayCostPerMonth,
                totalDisplayCost: formData.totalDisplayCost,
                displayCostPerSqFt: formData.displayCostPerSqFt,
                displayCostGstPercentage: formData.displayCostGstPercentage,
                displayCostGst: formData.displayCostGst,
                printingCostPerSqft: formData.printingCostPerSqft,
                printingGstPercentage: formData.printingGstPercentage,
                printingGst: formData.printingGst,
                totalPrintingCost: formData.totalPrintingCost,
                mountingCostPerSqft: formData.mountingCostPerSqft,
                mountingGstPercentage: formData.mountingGstPercentage,
                mountingGst: formData.mountingGst,
                totalMountingCost: formData.totalMountingCost,
                oneTimeInstallationCost: formData.oneTimeInstallationCost,
                monthlyAdditionalCost: formData.monthlyAdditionalCost,
                otherCharges: formData.otherCharges,
                tradedAmount: formData.tradedAmount,
                subjectToExtension: true,
                price: totalPrice,
                totalArea,
                discountOn: '',
                discountedDisplayCost: 0,
                discountedTotalPrice: 0,

                priceChanged: true,
              }
            : watchApplyPrintingMountingCostForAll
            ? {
                ...place,
                printingCostPerSqft: formData.printingCostPerSqft,
                printingGst: formData.printingGst,
                totalPrintingCost: formData.totalPrintingCost,
                mountingCostPerSqft: formData.mountingCostPerSqft,
                mountingGst: formData.mountingGst,
                totalMountingCost: formData.totalMountingCost,
                price:
                  place.totalDisplayCost ||
                  0 + place.tradedAmount ||
                  0 + formData.totalPrintingCost ||
                  0 + formData.totalMountingCost ||
                  0 + place.oneTimeInstallationCost ||
                  0 + place.monthlyAdditionalCost ||
                  0 - place.otherCharges ||
                  0,
              }
            : place,
        ),
      );
    }

    onClose();
    form.reset();
  };

  useEffect(() => {
    if (selectedInventory?.company || selectedInventory?.priceChanged || selectedInventory?.price) {
      form.reset({
        displayCostPerMonth: selectedInventory.displayCostPerMonth || 0,
        totalDisplayCost: selectedInventory.totalDisplayCost || 0,
        displayCostPerSqFt: selectedInventory.displayCostPerSqFt || 0,
        displayCostGstPercentage: selectedInventory.displayCostGstPercentage || 0,
        displayCostGst: selectedInventory.displayCostGst || 0,
        printingCostPerSqft: selectedInventory.printingCostPerSqft || 0,
        printingGstPercentage: selectedInventory.printingGstPercentage || 0,
        printingGst: selectedInventory.printingGst || 0,
        totalPrintingCost: selectedInventory.totalPrintingCost || 0,
        mountingCostPerSqft: selectedInventory.mountingCostPerSqft || 0,
        mountingGstPercentage: selectedInventory.mountingGstPercentage || 0,
        mountingGst: selectedInventory.mountingGst || 0,
        totalMountingCost: selectedInventory.totalMountingCost || 0,
        oneTimeInstallationCost: selectedInventory.oneTimeInstallationCost || 0,
        monthlyAdditionalCost: selectedInventory.monthlyAdditionalCost || 0,
        otherCharges: selectedInventory.otherCharges || 0,
        tradedAmount: selectedInventory.tradedAmount || 0,
        applyPrintingMountingCostForAll: true,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [selectedInventory, activeSlide]);

  useEffect(() => {
    const currentIndex = selectedInventories?.findIndex(inv => inv?._id === selectedInventoryId);
    if (currentIndex >= 0) {
      const itemToMove = selectedInventories.splice(currentIndex, 1)[0];
      selectedInventories.unshift(itemToMove);
    }
  }, [selectedInventoryId]);

  return (
    <Drawer
      className="overflow-auto"
      overlayOpacity={0.1}
      overlayBlur={0}
      size="xl"
      position="right"
      opened={isOpened}
      styles={styles}
      title="Price Breakdown"
      onClose={onClose}
      classNames={{
        title: 'text-xl font-semibold',
        header: 'px-6 mb-0 z-20 h-16 sticky top-0 bg-white',
        closeButton: 'text-black',
      }}
    >
      <div className="sticky top-16 bg-white z-10">
        <Divider className="pt-4" />
        <Carousel
          align="center"
          height={170}
          loop
          controlsOffset="lg"
          initialSlide={0}
          nextControlIcon={<ChevronRight size={25} className="rounded-full" />}
          previousControlIcon={<ChevronLeft size={25} className="rounded-full" />}
          classNames={{
            controls: 'bg-none',
            control: 'border-none',
          }}
          onSlideChange={setActiveSlide}
        >
          {selectedInventories?.map(inventory => (
            <Carousel.Slide>
              <div className="bg-gray-200 h-full rounded-lg p-4 w-3/4 m-auto flex flex-col g">
                <div className="text-xl">{inventory.spaceName}</div>
                <div className="text-lg text-gray-400">
                  City <span className="text-black">{inventory.location}</span>
                </div>
                <div className="text-lg text-gray-400">
                  Dimension{' '}
                  <span className="text-black">
                    {inventory.dimension
                      ?.map(dimension => `${dimension.height}ft x ${dimension.width}ft`)
                      .join(',')}
                  </span>
                  <div className="text-lg text-gray-400 p-0 m-0">(WxH)</div>
                </div>
                <div className="text-lg text-gray-400">
                  Area <span className="text-black">{totalArea} sq.ft.</span>
                </div>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
        <Divider className="my-4" />
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={e => {
            e.stopPropagation();

            return form.handleSubmit(onSubmit)(e);
          }}
        >
          <div className="h-fit overflow-auto">
            <div className="border border-yellow-350 bg-yellow-250 m-6 p-4 rounded-md flex flex-col gap-4">
              <div>
                <div className="text-lg font-bold">Apply Display Cost</div>
                <div className="text-gray-500 text-base">
                  Please select either Display Cost (per month) or Display Cost (per sq. ft.)
                </div>
              </div>
              <div className="text-base font-bold">Display Cost (per month)</div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <ControlledNumberInput
                    precision={2}
                    label="Cost"
                    name="displayCostPerMonth"
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-4/5"
                    thousandSeparator=","
                    onKeyDown={onChangeDisplayCostPerMonth}
                  />
                  <ControlledNumberInput
                    precision={2}
                    label="GST"
                    name="displayCostGstPercentage"
                    min={0}
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-1/5"
                    rightSection="%"
                    onKeyDown={onChangeDisplayCostPercentage}
                  />
                </div>
                <ControlledNumberInput
                  precision={2}
                  label="Total"
                  name="totalDisplayCost"
                  disabled
                  hideControls
                  classNames={{ label: 'text-base font-bold' }}
                  thousandSeparator=","
                />
              </div>
              <div className="text-base font-bold">Display Cost (per sq. ft.)</div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <ControlledNumberInput
                    precision={2}
                    label="Cost"
                    name="displayCostPerSqFt"
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-4/5"
                    thousandSeparator=","
                    onKeyDown={onChangeDisplayCostPerSqFt}
                  />
                  <ControlledNumberInput
                    precision={2}
                    label="GST"
                    name="displayCostGstPercentage"
                    min={0}
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-1/5"
                    rightSection="%"
                    onKeyDown={onChangeDisplayCostPercentage}
                  />
                </div>
                <ControlledNumberInput
                  precision={2}
                  label="Total"
                  name="totalDisplayCost"
                  disabled
                  hideControls
                  classNames={{ label: 'text-base font-bold' }}
                  thousandSeparator=","
                />
              </div>

              <ControlledNumberInput
                precision={2}
                label="Traded Amount"
                name="tradedAmount"
                hideControls
                classNames={{ label: 'text-base font-bold' }}
              />
            </div>
            <div className="border border-blue-200 bg-blue-100 m-6 p-4 rounded-md flex flex-col gap-4">
              <Checkbox
                name="applyPrintingMountingCostForAll"
                label="Apply for all selected inventories"
                classNames={{ label: 'text-base font-bold' }}
                checked={form.getValues('applyPrintingMountingCostForAll')}
                onChange={() =>
                  form.setValue(
                    'applyPrintingMountingCostForAll',
                    !watchApplyPrintingMountingCostForAll,
                  )
                }
              />
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <ControlledNumberInput
                    precision={2}
                    label="Printing Cost (per sq. ft.)"
                    name="printingCostPerSqft"
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-4/5"
                  />
                  <ControlledNumberInput
                    precision={2}
                    label="GST"
                    name="printingGstPercentage"
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-1/5"
                    rightSection="%"
                  />
                </div>
                <ControlledNumberInput
                  precision={2}
                  label="Total Printing Cost"
                  name="totalPrintingCost"
                  disabled
                  hideControls
                  classNames={{ label: 'text-base font-bold' }}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <ControlledNumberInput
                    precision={2}
                    label="Mounting Cost (per sq. ft.)"
                    name="mountingCostPerSqft"
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-4/5"
                  />
                  <ControlledNumberInput
                    precision={2}
                    label="GST"
                    name="mountingGstPercentage"
                    hideControls
                    classNames={{ label: 'text-base font-bold' }}
                    className="w-1/5"
                    rightSection="%"
                  />
                </div>
                <ControlledNumberInput
                  precision={2}
                  label="Total Mounting Cost"
                  name="totalMountingCost"
                  disabled
                  hideControls
                  classNames={{ label: 'text-base font-bold' }}
                />
              </div>
            </div>
            <div className="border border-purple-350 bg-purple-100 m-6 p-4 rounded-md flex flex-col gap-4">
              <div className="text-base font-bold">
                Miscellaneous{' '}
                <span className="text-xs font-normal italic"> ** inclusive of GST</span>
              </div>
              <ControlledNumberInput
                precision={2}
                label="One-time Installation Cost"
                name="oneTimeInstallationCost"
                hideControls
                classNames={{ label: 'text-base font-bold' }}
              />
              <ControlledNumberInput
                precision={2}
                label="Monthly Additional Cost"
                name="monthlyAdditionalCost"
                hideControls
                classNames={{ label: 'text-base font-bold' }}
              />
              <ControlledNumberInput
                precision={2}
                label="Other Charges (-)"
                name="otherCharges"
                hideControls
                classNames={{ label: 'text-base font-bold' }}
              />
            </div>
          </div>
          <div className="sticky bottom-0 z-10 bg-white p-6 pt-2 flex flex-col gap-6">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">Total Price</div>
              <div className="text-xl text-purple-450 font-semibold">
                {indianCurrencyInDecimals(totalPrice)}
              </div>
            </div>
            <div className="flex justify-between">
              <Button className="bg-black order-3 px-20 font-medium" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-purple-450 order-3 px-20 font-medium" type="submit">
                Confirm
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default AddEditPriceDrawer;
