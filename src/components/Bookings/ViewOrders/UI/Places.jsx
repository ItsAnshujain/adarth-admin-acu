import { Button, Image, Select } from '@mantine/core';
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

const Places = ({ data, campaignId, bookingId }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: upload, isLoading } = useUploadFile();
  const { mutate: update, isLoading: isUpdating } = useUpdateCampaignMedia();
  const printingStatusData = useFetchMasters(
    serialize({ type: 'printing_status', parentId: null, page: 1, limit: 100 }),
  );

  const mountStatusData = useFetchMasters(
    serialize({ type: 'mounting_status', parentId: null, page: 1, limit: 100 }),
  );

  const { mutate: updateCampaignStatus } = useUpdateCampaignStatus();

  const openRef = useRef(null);
  const handleSubmit = link => {
    update({ id: campaignId, placeId: data?._id, data: { media: link } });
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
      return printingStatusData.data.docs.map(item => item.name);
    }

    return [];
  }, [printingStatusData]);

  const mountList = useMemo(() => {
    if (mountStatusData?.data?.docs?.length) {
      return mountStatusData.data.docs.map(item => item.name);
    }

    return [];
  }, [mountStatusData]);

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
              className="py-1 px-2 ml-1 h-[20%] flex items-center gap-2 border border-black rounded-md text-black font-medium text-base"
            >
              <span className="mr-1">Upload File</span>
              <img src={uploadIcon} alt="Upload" className="mr-1" />
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
                defaultValue={data?.currentStatus?.printingStatus}
                onChange={val => {
                  updateCampaignStatus(
                    {
                      id: campaignId,
                      placeId: data?._id,
                      data: { printingStatus: val },
                    },
                    {
                      onSuccess: () => queryClient.invalidateQueries(['booking-by-id', bookingId]),
                    },
                  );
                }}
                data={printList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
              />
            </div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Health Update</p>
              <p>{`${data?.health}%` || <NoData type="na" />}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm text-slate-400">Mounting Status</p>
              <Select
                className="mr-2 w-[200px]"
                defaultValue={data?.currentStatus?.mountingStatus}
                onChange={val =>
                  updateCampaignStatus(
                    {
                      id: campaignId,
                      placeId: data?._id,
                      data: { mountingStatus: val },
                    },
                    {
                      onSuccess: () => queryClient.invalidateQueries(['booking-by-id', bookingId]),
                    },
                  )
                }
                data={mountList}
                styles={statusSelectStyle}
                rightSection={<ChevronDown size={16} className="mt-[1px] mr-1" />}
                rightSectionWidth={40}
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
