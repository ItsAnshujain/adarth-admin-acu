import create from 'zustand';
import { combine, persist } from 'zustand/middleware';

const initialValue = {
  inventory: 'list',
  proposal: 'list',
  campaign: 'list',
};

const useLayoutView = create(
  persist(
    combine(
      {
        activeLayout: initialValue,
      },
      set => ({
        setActiveLayout: activeLayout => set(() => ({ activeLayout })),
      }),
    ),
    { name: 'layout_type' },
  ),
);

export default useLayoutView;
