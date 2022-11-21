import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createInventory,
  csvImport,
  deleteInventory,
  deleteInventoryById,
  fetchInventory,
  fetchInventoryById,
  updateInventory,
} from '../requests/inventory.requests';

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async data => {
      const res = await createInventory(data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);

        showNotification({
          title: 'Inventory Successfully Added',
          message: 'Thank you for adding the inventory',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useFetchInventory = (query, enabled = true) =>
  useQuery(
    ['inventory', query],
    async () => {
      const res = await fetchInventory(query);
      return res?.data;
    },
    { enabled },
  );

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ inventoryId, data }) => {
      const res = await updateInventory(inventoryId, data);
      return res;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);

        showNotification({
          title: 'Inventory updated successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useFetchInventoryById = (inventoryId, enabled = true) =>
  useQuery(
    ['inventory-by-id', inventoryId],
    async () => {
      const res = await fetchInventoryById(inventoryId);
      return res?.data;
    },
    { enabled },
  );

export const useDeleteInventoryById = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ inventoryId }) => {
      const res = await deleteInventoryById(inventoryId);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);
        showNotification({
          title: 'Inventory deleted successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async data => {
      const query =
        data?.length === 1 ? `/${data[0]}` : `?${data.map(item => `id=${item}`).join('&')}`;
      // single id takes url param and multiple ids take query params
      const res = await deleteInventory(query);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['inventory']);

        showNotification({
          title: 'Inventory deleted successfully',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
};

export const useCsvImport = () =>
  useMutation(
    async data => {
      const res = csvImport(data);
      return res.data;
    },
    {
      onSuccess: () => {
        showNotification({
          title: 'File Successfully Imorted',
          color: 'green',
        });
      },
      onError: err => {
        showNotification({
          title: err?.message,
          color: 'red',
        });
      },
    },
  );
