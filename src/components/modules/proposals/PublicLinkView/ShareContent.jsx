import { ChevronDown } from 'react-feather';
import { Button } from '@mantine/core';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';
import { OBJECT_FIT_LIST_V2 } from '../../../../utils/constants';
import ControlledSelect from '../../../shared/FormInputs/Controlled/ControlledSelect';
import ControlledTextInput from '../../../shared/FormInputs/Controlled/ControlledTextInput';
import { useGeneratePublicProposal } from '../../../../apis/queries/proposal.queries';
import { downloadPdf, serialize } from '../../../../utils';

const ShareContent = ({ fileType, proposalId, clientCompanyName, onClose }) => {
  const form = useForm();
  const genProposalHandler = useGeneratePublicProposal();

  const download = form.handleSubmit(async formData => {
    const payload = {
      format: fileType,
      shareVia: 'copy_link',
      to: '',
      cc: '',
      name: '',
      aspectRatio: formData.aspectRatio?.split(';')[0] || 'fill',
      templateType: formData.aspectRatio?.split(';')[1] || 'generic',
      clientCompanyName,
      subject: formData.subject,
    };

    await genProposalHandler.mutateAsync(
      { proposalId, queries: serialize({ utcOffset: dayjs().utcOffset() }), payload },
      {
        onSuccess: res => {
          downloadPdf(res.link[fileType]);
          showNotification({
            title: 'Download successful',
            color: 'green',
          });
          onClose();
          form.reset();
        },
      },
    );
  });

  return (
    <FormProvider {...form}>
      <form>
        <div>
          <div>
            <p className="font-medium text-xl mb-2">Select a template</p>
            <ControlledSelect
              name="aspectRatio"
              data={OBJECT_FIT_LIST_V2}
              placeholder="Select..."
              rightSection={<ChevronDown size={16} />}
              className="mb-2"
              defaultValue="fill;generic"
            />
          </div>
          {fileType === 'Excel' ? (
            <div>
              <p className="font-medium text-xl mb-2">Subject</p>
              <ControlledTextInput name="subject" placeholder="Enter..." className="mb-2" />
            </div>
          ) : null}
          <Button
            className="secondary-button font-medium text-base mt-2 mb-4 w-full"
            type="submit"
            loading={genProposalHandler.isLoading}
            disabled={genProposalHandler.isLoading}
            onClick={download}
          >
            Download
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ShareContent;
