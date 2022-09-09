import { combine, persist } from 'zustand/middleware';
import create from 'zustand';
import { USER_TOKEN_ID_KEY } from '../utils/config';

const useTokenIdStore = create(
  persist(
    combine(
      {
        token: null,
      },
      set => ({
        setToken: token => set(() => ({ token })),
      }),
    ),
    {
      name: USER_TOKEN_ID_KEY,
    },
  ),
);

export default useTokenIdStore;
