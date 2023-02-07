import { Button, Chip, Image, Select } from '@mantine/core';
import { useMemo, useRef } from 'react';
import { Calendar, ChevronDown } from 'react-feather';
import { Dropzone } from '@mantine/dropzone';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import toIndianCurrency from '../../../../utils/currencyFormat';
import uploadIcon from '../../../../assets/upload.svg';
import NoData from '../../../shared/NoData';
import { useUpdateCampaignMedia, useUpdateCampaignStatus } from '../../../../hooks/campaigns.hooks';
import { useUploadFile } from '../../../../hooks/upload.hooks';
import { useFetchMasters } from '../../../../hooks/masters.hooks';
import { serialize } from '../../../../utils';

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const styles = {
  visibility: 'hidden',
};

const DATE_FORMAT = 'DD-MM-YYYY';

const Places = ({ data, campaignId, bookingId, hasPaymentType }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: upload, isLoading } = useUploadFile();
  const { mutate: update, isLoading: isUpdating } = useUpdateCampaignMedia();
  const printingStatusData = useFetchMasters(
    serialize({ type: 'printing_status', parentId: null, page: 1, limit: 100 }),
  );

  const mountStatusData = useFetchMasters(
    serialize({ type: 'mounting_status', parentId: null, page: 1, limit: 100 }),
  );

  const { mutate: updateCampaignStatus, isLoading: isUpdateCampaignStatusLoading } =
    useUpdateCampaignStatus();

  const openRef = useRef(null);
  const handleSubmit = link => {
    update(
      { id: campaignId, placeId: data?._id, data: { media: link } },
      { onSuccess: () => queryClient.invalidateQueries(['booking-by-id', bookingId]) },
    );
  };

  const handleUpload = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);

    if (res?.[0].Location) {
      handleSubmit(res[0].Location);
    }
  };

  const printList = useMemo(() => {
    if (printingStatusData?.data?.docs?.length) {
      return printingStatusData.data.docs.map(item => ({
        label: item?.name,
        value: item?.name,
        disabled: Object.keys(data?.printingStatus || {}).includes(item?.name?.toLowerCase()),
      }));
    }

    return [];
  }, [printingStatusData]);

  const mountList = useMemo(() => {
    if (mountStatusData?.data?.docs?.length) {
      return mountStatusData.data.docs.map(item => ({
        label: item?.name,
        value: item?.name,
        disabled: Object.keys(data?.mountingStatus || {}).includes(item?.name?.toLowerCase()),
      }));
    }

    return [];
  }, [mountStatusData]);

  const handleCampaignStatusUpdate = (val, statusKey) => {
    if (data) {
      updateCampaignStatus(
        {
          id: campaignId,
          placeId: data?._id,
          data: { [statusKey]: val },
        },
        {
          onSuccess: () => queryClient.invalidateQueries(['booking-by-id', bookingId]),
        },
      );
    }
  };

  return (
    <div className="flex gap-4 p-4 shadow-md bg-white mb-2">
      <div className="flex items-center">
        {data?.basicInformation?.spacePhoto ? (
          <Image src={data?.basicInformation?.spacePhoto} alt="banner" height={140} width={140} />
        ) : (
          <Image src={null} withPlaceholder height={140} width={140} fit="contain" />
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-end items-center w-full mb-2">
          <div className="flex gap-2 items-center">
            <Dropzone openRef={openRef} style={styles} onDrop={handleUpload} multiple={false}>
              {/* children */}
            </Dropzone>
            <Button
              onClick={() => openRef.current()}
              disabled={isUpdating || isLoading}
              loading={isUpdating || isLoading}
              className="secondary-button"
              rightIcon={<img src={uploadIcon} alt="Upload" className="mr-1" />}
            >
              {data?.media ? (
                <>
                  <Chip
                    classNames={{ checkIcon: 'text-black', label: 'bg-transparent' }}
                    checked
                    variant="filled"
                    color="green"
                    radius="lg"
                    size="xs"
                  />
                  {isLoading ? 'Uploading' : 'Uploaded'}
                </>
              ) : isLoading ? (
                'Uploading'
              ) : (
                'Upload'
              )}
            </Button>
            <div className="flex gap-2 p-2 rounded-md">
              <Calendar />
              <span>
                {data?.startDate ? dayjs(data.startDate).format(DATE_FORMAT) : <NoData type="na" />}
              </span>
            </div>
            -
            <div className="flex gap-2 p-2 rounded-md">
              <Calendar />
              <span>
                {data?.endDate ? dayjs(data.endDate).format(DATE_FORMAT) : <NoData type="na" />}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div>
            <p className="mb-2 font-bold">
              {data?.basicInformation?.spaceName || <NoData type="na" />}
            </p>
            <p className="mb-2 text-sm font-light text-slate-400">
              {data?.location?.address || <NoData type="na" />}
            </p>
            <p className="font-bold">
              {data?.basicInformation?.price
                ? toIndianCurrency(Number.parseInt(data.basicInformation.price, 10))
                : 0}
            </p>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm text-slate-400">Printing Status</p>
              <Select
                className="mr-2 w-[200px]"
                defaultValue={
                  data?.currentStatus?.printingStatus
                    ? data.currentStatus.printingStatus.charAt(0).toUpperCase() +
                      data.currentStatus.printingStatus.slice(1)
                    : ''
                }
                onChange={val => handleCampaignStatusUpdate(val, 'printingStatus')}
                data={printList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                disabled={
                  isUpdateCampaignStatusLoading ||
                  !hasPaymentType ||
                  data?.currentStatus?.printingStatus?.toLowerCase() === 'completed'
                }
              />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Health Update</p>
              <p>{`${data?.health || 0}%` || <NoData type="na" />}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm text-slate-400">Mounting Status</p>
              <Select
                className="mr-2 w-[200px]"
                defaultValue={
                  data?.currentStatus?.mountingStatus
                    ? data.currentStatus.mountingStatus.charAt(0).toUpperCase() +
                      data.currentStatus.mountingStatus.slice(1)
                    : ''
                }
                onChange={val => handleCampaignStatusUpdate(val, 'mountingStatus')}
                data={mountList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
                disabled={
                  isUpdateCampaignStatusLoading ||
                  data?.currentStatus?.printingStatus?.toLowerCase() === 'upcoming' ||
                  data?.currentStatus?.printingStatus?.toLowerCase() === 'print' ||
                  data?.currentStatus?.mountingStatus?.toLowerCase() === 'completed'
                }
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-light text-slate-400">Format Support</p>
              <p>{data?.basicInformation?.supportedMedia || <NoData type="na" />}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Illumination</p>
              <p>{data?.specifications?.illuminations?.name || <NoData type="na" />}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;
