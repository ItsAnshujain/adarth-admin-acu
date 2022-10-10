import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUsers,
  deleteUsers,
  fetchUsers,
  fetchUsersById,
  updateUsers,
} from '../requests/users.requests';

export const useFetchUsers = (query, enabled = true) =>
  useQuery(
    ['users', query],
    async () => {
      const res = await fetchUsers(query);
      return res?.data;
    },
    {
      enabled,
    },
  );

export const useFetchUsersById = (usersById, enabled = true) =>
  useQuery(
    ['users-by-id', usersById],
    async () => {
      const res = await fetchUsersById(usersById);
      return res?.data;
    },
    {
      enabled,
    },
  );

export const useCreateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async data => {
      const res = await createUsers(data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        showNotification({
          title: 'Add User',
          message: 'User created successfully',
          autoClose: 3000,
          color: 'green',
        });
      },
    },
    {
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          autoClose: 3000,
          color: 'red',
        });
      },
    },
  );
};

export const useUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ userId, data }) => {
      const res = await updateUsers(userId, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        showNotification({
          title: 'Update User',
          message: 'User updated successfully',
          autoClose: 3000,
          color: 'green',
        });
      },
    },
    {
      onError: err => {
        showNotification({
          title: 'Error',
          message: err?.message,
          autoClose: 3000,
          color: 'red',
        });
      },
    },
  );
};

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ userId, data }) => {
      const res = await deleteUsers(userId, data);
      return res?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    },
    {
      onError: () => {},
    },
  );
};