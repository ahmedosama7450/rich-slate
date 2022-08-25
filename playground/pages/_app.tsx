import "../styles/index.css";
import { OverwindProvider } from "overwind-ui";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <OverwindProvider>
      <Component {...pageProps} />
    </OverwindProvider>
  );
}

export default MyApp;
