import { useQuery } from '@tanstack/react-query';
import { campaigns } from '../requests/campaigns.request';
//

// eslint-disable-next-line import/prefer-default-export
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
