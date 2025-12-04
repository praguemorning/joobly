'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from '@/lib/store';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Provider>
    </SessionProvider>
  );
}