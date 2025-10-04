import { getAppDisplayName, getAppVersion, getContributors } from '@/common';

export const useWelcome = () => {
  const message = getAppDisplayName();
  const version = getAppVersion();
  const contributors = getContributors();

  return {
    message,
    version,
    contributors,
  };
};
