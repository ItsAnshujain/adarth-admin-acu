import { Button, Image } from '@mantine/core';
import { useRef } from 'react';
import { Calendar } from 'react-feather';
import { Dropzone } from '@mantine/dropzone';
import CustomBadge from '../../../shared/Badge';
import toIndianCurrency from '../../../../utils/currencyFormat';
import uploadIcon from '../../../../assets/upload.svg';
import NoData from '../../../shared/NoData';
import { useUpdateCampaignMedia } from '../../../../hooks/campaigns.hooks';
import { useUploadFile } from '../../../../hooks/upload.hooks';

const styles = {
  visibility: 'hidden',
};
const Places = ({ data }) => {
  const { mutateAsync: upload, isLoading } = useUploadFile();
  const { mutate: update, isLoading: isUpdating } = useUpdateCampaignMedia();
  const openRef = useRef(null);
  const handleSubmit = link => {
    update({ id: data?._id, placeId: data?._id, data: { media: link } });
  };

  const handleUpload = async params => {
    const formData = new FormData();
    formData.append('files', params?.[0]);
    const res = await upload(formData);

    if (res?.[0].Location) {
      handleSubmit(res[0].Location);
    }
  };

  return (
    <div className="flex gap-4 p-4 shadow-md bg-white mb-2">
      <div>
        {data?.basicInformation?.spacePhotos ? (
          <Image src={data?.basicInformation?.spacePhotos} alt="banner" height={140} width={140} />
        ) : (
          <Image src={null} withPlaceholder height={140} width={140} fit="contain" />
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full mb-2">
          <CustomBadge
            className="bg-green-200 text-green-700 tracking-wider"
            radius="lg"
            variant="filled"
            text={data.isUnderMaintenance ? 'Under maintenance' : 'Available'}
            size="md"
          />
          <div className="flex gap-2 items-center">
            <Dropzone openRef={openRef} style={styles} onDrop={handleUpload} multiple={false}>
              {/* children */}
            </Dropzone>
            <Button
              onClick={() => openRef.current()}
              disabled={isUpdating || isLoading}
              className="py-1 px-2 ml-1 h-[20%] flex items-center gap-2 border border-black rounded-md text-black font-medium text-base"
            >
              <span className="mr-1">Upload File</span>
              <img src={uploadIcon} alt="Upload" className="mr-1" />
            </Button>

            <div className="flex gap-2 border p-2 rounded-md">
              <Calendar />
              <span> {data?.startDate || <NoData type="na" />}</span>
            </div>
            <div className="flex gap-2 border p-2 rounded-md">
              <Calendar />
              <span>{data?.endDate || <NoData type="na" />}</span>
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
            <p className="font-bold">{toIndianCurrency(data?.basicInformation?.price || 0)}</p>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Health Update</p>
              <p>{data?.health || <NoData type="na" />}</p>
            </div>
          </div>
          <div>
            <div>
              <p className="mb-2 text-sm font-light text-slate-400">Format Support</p>
              <p>{data?.basicInformation?.supportedMedia || <NoData type="na" />}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-2 text-sm font-light text-slate-400">Illumination</p>
              <p>{data?.specifications?.illumination?.name || <NoData type="na" />}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;
