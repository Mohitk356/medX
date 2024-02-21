import React from "react";
import getQueryClient from "../../utils/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";
import Healthinfomationcenter from "./Healthinformationcenter";
import { fetchArticles, fetchStorLocations } from "../../utils/databaseService";
import { cookies } from "next/dist/client/components/headers";

export const metadata = {
  title: "Health Information Center - MedX",
};

const HealthInformationCenter = async () => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery(["articles"], fetchArticles);
  const cookie = cookies().get("uid");

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Healthinfomationcenter cookie={cookie} />
    </Hydrate>
  );
};

export default HealthInformationCenter;
