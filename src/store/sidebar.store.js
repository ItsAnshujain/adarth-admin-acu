import { combine } from 'zustand/middleware';
import create from 'zustand';

const initialValues = new Array(9).fill(false);
initialValues[0] = true;
const reportValues = new Array(3).fill(false);
reportValues[0] = true;
const masterValues = new Array(4).fill(false);
masterValues[0] = true;

const useSideBarState = create(
  combine(
    {
      color: initialValues,
      reports: reportValues,
      masters: masterValues,
    },
    set => ({
      setColor: index =>
        set(state => {
          const newColor = [...state.color];
          newColor.fill(false);
          newColor[index] = true;
          return { color: newColor };
        }),
      setReportColor: index =>
        set(state => {
          const newColor = [...state.reports];
          newColor.fill(false);
          newColor[index] = true;
          return { reports: newColor };
        }),
      setMasterColor: index =>
        set(state => {
          const newColor = [...state.masters];
          newColor.fill(false);
          newColor[index] = true;
          return { masters: newColor };
        }),
    }),
  ),
);

export default useSideBarState;
