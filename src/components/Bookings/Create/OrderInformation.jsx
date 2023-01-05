import { useFormContext } from '../../../context/formContext';
import TextInput from '../../shared/TextInput';
import Textarea from '../../shared/TextareaInput';

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

const textAreaStyles = {
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    letterSpacing: '0.5px',
  },
  input: {
    borderRadius: 0,
    padding: 8,
    height: '187px',
  },
};

const OrderInfo = () => {
  const { errors } = useFormContext();

  return (
    <div className="pl-5 pr-7 mt-4">
      <p className="text-xl font-bold">Order Information</p>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <TextInput
          styles={styles}
          label="Campaign Name"
          name="campaignName"
          withAsterisk
          placeholder="Write..."
          errors={errors}
        />

        <div>
          <Textarea
            styles={textAreaStyles}
            label="Description"
            name="description"
            placeholder="Maximun 200 characters"
            errors={errors}
            maxLength={200}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
