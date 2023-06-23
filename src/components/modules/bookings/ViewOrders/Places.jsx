import { ActionIcon, Badge, Box, Button, Chip, HoverCard, Image, Select } from '@mantine/core';
import { useMemo, useRef } from 'react';
import { Calendar, ChevronDown, Eye } from 'react-feather';
import { Dropzone } from '@mantine/dropzone';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import ReactPlayer from 'react-player';
import { useModals } from '@mantine/modals';
import { Link } from 'react-router-dom';
import toIndianCurrency from '../../../../utils/currencyFormat';
import uploadIcon from '../../../../assets/upload.svg';
import uploadWhiteIcon from '../../../../assets/upload-white.svg';
import NoData from '../../../shared/NoData';
import {
  useUpdateCampaignMedia,
  useUpdateCampaignStatus,
} from '../../../../apis/queries/campaigns.queries';
import { useUploadFile } from '../../../../apis/queries/upload.queries';
import { useFetchMasters } from '../../../../apis/queries/masters.queries';
import {
  checkMountingStats,
  checkPrintingStats,
  serialize,
  supportedTypes,
} from '../../../../utils';
import modalConfig from '../../../../utils/modalConfig';

const updatedSupportedTypes = [...supportedTypes, 'MP4'];
const updatedModalConfig = { ...modalConfig, size: 'xl' };

const statusSelectStyle = {
  rightSection: { pointerEvents: 'none' },
};

const styles = {
  visibility: 'hidden',
};

const DATE_FORMAT = 'DD-MM-YYYY';

const Places = ({ data, campaignId, bookingId, hasPaymentType }) => {
  const modals = useModals();
  const queryClient = useQueryClient();
  const { mutateAsync: upload, isLoading } = useUploadFile();
  const { mutate: update, isLoading: isUpdating } = useUpdateCampaignMedia();
  const printingStatusData = useFetchMasters(
    serialize({
      type: 'printing_status',
      parentId: null,
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'desc',
    }),
  );

  const mountStatusData = useFetchMasters(
    serialize({
      type: 'mounting_status',
      parentId: null,
      page: 1,
      limit: 100,
      sortBy: 'name',
      sortOrder: 'desc',
    }),
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
        disabled: checkPrintingStats(data?.currentStatus?.printingStatus, item?.name),
      }));
    }

    return [];
  }, [printingStatusData]);

  const mountList = useMemo(() => {
    if (mountStatusData?.data?.docs?.length) {
      return mountStatusData.data.docs.map(item => ({
        label: item?.name,
        value: item?.name,
        disabled: checkMountingStats(data?.currentStatus?.mountingStatus, item?.name),
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

  const toggleMediaPreviewModal = path =>
    modals.openContextModal('basic', {
      title: 'Preview',
      innerProps: {
        modalBody: (
          <Box>
            {path && !path?.includes(['mp4']) ? (
              <Image src={path} height={400} width="100%" alt="preview" fit="contain" />
            ) : (
              <ReactPlayer url={`${path}#t=0.1`} width="100%" height="100%" />
            )}
          </Box>
        ),
      },
      ...updatedModalConfig,
    });

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
            <Dropzone
              openRef={openRef}
              style={styles}
              onDrop={handleUpload}
              multiple={false}
              maxSize={5000000}
            >
              {/* children */}
            </Dropzone>
            <HoverCard>
              <HoverCard.Target>
                <Button
                  onClick={() => openRef.current()}
                  disabled={isUpdating || isLoading}
                  loading={isUpdating || isLoading}
                  className={classNames(
                    data?.media
                      ? 'bg-gradient-to-r from-green-300 bg-green-500'
                      : 'secondary-button',
                  )}
                  rightIcon={
                    <img
                      src={data?.media ? uploadWhiteIcon : uploadIcon}
                      alt="Upload"
                      className="mr-1"
                    />
                  }
                >
                  {data?.media ? (
                    <>
                      <Chip
                        classNames={{
                          checkIcon: data?.media ? 'text-white' : 'text-black',
                          label: 'bg-transparent',
                        }}
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
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <div className="text-sm flex flex-col">
                  <span className="font-bold text-gray-500">Supported types</span>
                  <div className="mt-1">
                    {updatedSupportedTypes.map(item => (
                      <Badge key={uuidv4()} className="mr-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-1 font-bold text-gray-500">Video size cannot be more than 5MB</p>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            {data?.media ? (
              <ActionIcon
                title="Preview Media"
                onClick={() => toggleMediaPreviewModal(data?.media)}
              >
                <Eye />
              </ActionIcon>
            ) : null}
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
                value={
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
                value={
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
                  data?.currentStatus?.printingStatus?.toLowerCase() === 'in progress' ||
                  data?.currentStatus?.mountingStatus?.toLowerCase() === 'completed'
                }
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-light text-slate-400">Format Support</p>
              <p>{data?.basicInformation?.supportedMedia || <NoData type="na" />}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Illumination</p>
              <p>{data?.specifications?.illuminations?.name || <NoData type="na" />}</p>
            </div>

            <Link
              to={`/inventory/view-details/${data?._id}?tabType=operational-cost&bookingId=${bookingId}`}
              className="primary-button w-fit self-center my-auto px-3 py-2 rounded-md font-medium hover:shadow-md"
            >
              Add Operational Cost
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;