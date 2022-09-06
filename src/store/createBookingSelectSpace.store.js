import { combine } from 'zustand/middleware';
import create from 'zustand';

const initialValues = [];

const useCreateBookingSelectSpaceState = create(
  combine(
    {
      selectedSpace: initialValues,
    },
    set => ({
      setSelectedSpace: selectedSpace => {
        set(() => ({
          selectedSpace,
        }));
      },
    }),
  ),
);

export default useCreateBookingSelectSpaceState;
