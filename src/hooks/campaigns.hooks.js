import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  campaign,
  campaigns,
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from '../requests/campaigns.request';

export const useCampaigns = (query, enabled = true) =>
  useQuery(
    ['campaigns', query],
    async () => {
      const res = await campaigns(query);
      return res.data;
    },
    {
      enabled,
    },
  );

export const useCampaign = (id, enabled = true) =>
  useQuery(
    ['campaign', id],
    async () => {
      const res = await campaign(id);
      return res.data;
    },
    {
      enabled: !!id && enabled,
    },
  );

export const useCreateCampaign = () =>
  useMutation(
    async data => {
      const res = await createCampaign(data);
      return res.data;
    },
    {
      onSuccess: data => {
        showNotification({
          title: data?.message,
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

export const useUpdateCampaign = () =>
  useMutation(
    async ({ id, data }) => {
      const res = await updateCampaign(id, data);
      return res.data;
    },
    {
      onSuccess: data => {
        showNotification({
          title: data?.message,
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

export const useDeleteCampaign = () =>
  useMutation(
    async query => {
      const res = await deleteCampaign(query);
      return res.data;
    },
    {
      onSuccess: data => {
        showNotification({
          title: data?.message,
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
