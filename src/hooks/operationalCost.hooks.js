import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addOperationalCost,
  fetchOperationalCost,
  updateOperationalCost,
} from '../requests/operationalCost.requests';

export const useFetchOperationalCost = (inventoryId, enabled = true) => {
  const queryClient = useQueryClient();

  return useQuery(
    ['operational-cost', inventoryId],
    async () => {
      const res = await fetchOperationalCost(inventoryId);
      return res?.data;
    },
    { enabled, onSuccess: () => queryClient.invalidateQueries(['inventory-by-id', inventoryId]) },
  );
};

export const useAddOperationalCost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async data => {
      const res = await addOperationalCost(data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['operational-cost']);
        showNotification({
          title: 'Operational cost created successfully',
          color: 'green',
        });
      },
      onError: err =>
        showNotification({
          title: err?.message,
          color: 'red',
        }),
    },
  );
};

export const useUpdateOperationalCost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, data }) => {
      const res = await updateOperationalCost(id, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['operational-cost']);
        showNotification({
          title: 'Operational cost updated successfully',
          color: 'green',
        });
      },
      onError: err =>
        showNotification({
          title: err?.message,
          color: 'red',
        }),
    },
  );
};