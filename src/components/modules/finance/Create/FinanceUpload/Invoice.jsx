import React, { useEffect } from 'react';
import { useFormContext } from '../../../../../context/formContext';
import NumberInput from '../../../../shared/NumberInput';
import TextInput from '../../../../shared/TextInput';

const styles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
    padding: 8,
  },
};

const Invoice = ({ totalPrice }) => {
  const { errors, setFieldValue } = useFormContext();

  useEffect(() => {
    setFieldValue('total', totalPrice);
  }, [totalPrice]);

  return (
    <>
      <div className="pl-5 pr-7 pt-4 pb-8 border-b">
        <div className="grid grid-cols-2 gap-4">
          <NumberInput
            styles={styles}
            label="Invoice No"
            name="invoiceNo"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
        </div>
      </div>
      <div className="px-5 pt-4 pb-5 border-b">
        <p className="font-bold text-2xl pb-2">To</p>
        <div className="grid grid-cols-2 gap-5">
          <TextInput
            styles={styles}
            label="Supplier Name"
            name="supplierName"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Supplier Ref"
            name="supplierRefNo"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 border-b">
        <p className="font-bold text-2xl pb-2">Buyer Details</p>
        <div className="grid grid-cols-2  gap-5">
          <TextInput
            styles={styles}
            label="Buyer Name"
            name="buyerName"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Buyer's Order No."
            name="buyerOrderNumber"
            withAsterisk
            placeholder="Write..."
            errors={errors}
          />
          <TextInput
            styles={styles}
            label="Amount Chargeable"
            name="total"
            placeholder="Write..."
            readOnly
            disabled
          />
        </div>
      </div>
    </>
  );
};

export default Invoice;