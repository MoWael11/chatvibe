'use client';

import { SessionProvider as NextauthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  return <NextauthSessionProvider>{children}</NextauthSessionProvider>;
};
