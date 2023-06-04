import {
  ThemedLayoutV2,
  ThemedSiderV2,
  notificationProvider,
} from "@refinedev/antd";
import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";

import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import "bootstrap/dist/css/bootstrap.min.css";
import "@refinedev/antd/dist/reset.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../src/styles.css";
import dataProvider from "@refinedev/simple-rest";
import { authProvider } from "src/authProvider";
import { colors } from "../src/colors";
import { queryClient } from "../src/query";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ContextProvider } from "../src/ContextProvider";
import { NextScript } from "next/document";
import Head from "next/head";
import Script from "next/script";
import AppProvider from "../src/AppProvider";
const API_URL = "https://api.fake-rest.refine.dev";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Header={() => <Header sticky />}
        Sider={() => <ThemedSiderV2 fixed />}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  return (
    <>
      <Script src="https://public.bnbstatic.com/unpkg/growth-widget/cryptoCurrencyWidget@0.0.9.min.js"></Script>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <RefineKbarProvider>
              <ColorModeContextProvider>
                <AppProvider>
                  <div
                    style={{
                      backgroundColor: colors.background,
                      height: "150vh",
                    }}
                  >
                    {renderComponent()}
                  </div>
                </AppProvider>
                <RefineKbar />
                <UnsavedChangesNotifier />
              </ColorModeContextProvider>
            </RefineKbarProvider>
          </Hydrate>
        </QueryClientProvider>
      </ContextProvider>
    </>
  );
}

export default MyApp;
