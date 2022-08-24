import { combine } from 'zustand/middleware';
import create from 'zustand';

const initialValues = new Array(9).fill(false);
initialValues[0] = true;

const useSideBarState = create(
  combine(
    {
      color: initialValues,
    },
    set => ({
      setColor: index =>
        set(state => {
          const newColor = [...state.color];
          newColor.fill(false);
          newColor[index] = true;
          return { color: newColor };
        }),
    }),
  ),
);

export default useSideBarState;
