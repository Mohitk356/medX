import React from "react";
import AboutUsComponent from "./AboutUsComponent";
import getQueryClient from "../../utils/getQueryClient";
import { fetchAboutUs } from "../../utils/databaseService";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";


export const metadata = {
  title: "About Us - MedX"
}

const AboutUs = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["about-us"], fetchAboutUs);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <AboutUsComponent />;
    </Hydrate>
  );
};

export default AboutUs;
