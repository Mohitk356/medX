"use client";

import React, { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TagManager from 'react-gtm-module'

function Providers({ children }) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 10000 } } })
  );

  useEffect(()=>{
    TagManager.initialize({
      gtmId:"GTM-WNM97FH"
    })
    TagManager.initialize({
      gtmId:"GTM-N3S27J3"
    })
  },[])

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
