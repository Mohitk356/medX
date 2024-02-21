import React from "react";
import getQueryClient from "../../utils/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";
import StoreLocationsClient from "./StoreLocationsClient";
import { fetchStorLocations } from "../../utils/databaseService";
import { cookies } from "next/dist/client/components/headers";

export const metadata = {
  title: "Store Locations - MedX",
};

const StoreLocations = async () => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery(["storeLocations"], fetchStorLocations);
  const cookie = cookies().get("uid");

  console.log({ cookie });

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <StoreLocationsClient cookie={cookie} />
    </Hydrate>
  );
};

export default StoreLocations;
