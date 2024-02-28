import { useQuery } from '@tanstack/react-query';
import { onApiError } from '../../utils';
import fetchContacts from '../requests/contacts.requests';

const useContacts = (query, enabled = true) =>
  useQuery({
    queryKey: ['contacts', query],
    queryFn: async () => {
      const res = await fetchContacts(query);
      return res?.data;
    },
    enabled,
    onError: onApiError,
  });

export default useContacts;
