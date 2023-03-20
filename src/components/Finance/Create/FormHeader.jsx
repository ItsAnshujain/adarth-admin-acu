import { Button } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../../context/formContext';
import { orderTitle } from '../../../utils';

const FormHeader = ({
  type,
  isGeneratePurchaseOrderLoading,
  isGenerateReleaseOrderLoading,
  isGenerateInvoiceLoading,
  isGenerateManualPurchaseOrderLoading,
  isGenerateManualReleaseOrderLoading,
  isGenerateManualInvoiceLoading,
  handleFormSubmit = () => {},
}) => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);
  const { onSubmit } = useFormContext();

  return (
    <header className="h-[60px] border-b flex items-center justify-between pl-5 pr-7 sticky top-0 z-50 bg-white">
      <p className="font-bold text-lg">{`Create ${orderTitle[type]}`}</p>
      <div className="flex gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={
            isGeneratePurchaseOrderLoading ||
            isGenerateReleaseOrderLoading ||
            isGenerateInvoiceLoading ||
            isGenerateManualPurchaseOrderLoading ||
            isGenerateManualReleaseOrderLoading ||
            isGenerateManualInvoiceLoading
          }
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={onSubmit(e => handleFormSubmit(e, 'preview'))}
          className="primary-button mr-2"
          variant="filled"
          loading={
            isGeneratePurchaseOrderLoading ||
            isGenerateReleaseOrderLoading ||
            isGenerateInvoiceLoading ||
            isGenerateManualPurchaseOrderLoading ||
            isGenerateManualReleaseOrderLoading ||
            isGenerateManualInvoiceLoading
          }
          disabled={
            isGeneratePurchaseOrderLoading ||
            isGenerateReleaseOrderLoading ||
            isGenerateInvoiceLoading ||
            isGenerateManualPurchaseOrderLoading ||
            isGenerateManualReleaseOrderLoading ||
            isGenerateManualInvoiceLoading
          }
        >
          Create
        </Button>
      </div>
    </header>
  );
};

export default FormHeader;
