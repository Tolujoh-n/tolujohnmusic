import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';

export const useSiteSettings = () =>
  useQuery({
    queryKey: ['site-settings'],
    queryFn: PublicAPI.getSiteSettings,
    staleTime: 60_000,
  });
