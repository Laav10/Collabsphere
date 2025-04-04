import { AppProps } from 'next/app';
import { UserProvider } from '../lib/usercontext';
import "@/app/globals.css" // If you have global styles

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
    