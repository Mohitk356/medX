import React from "react";
import ProfileClient from "./ProfileClient";
import { cookies } from "next/dist/client/components/headers";
import getQueryClient from "../../utils/getQueryClient";
import {
  fetchCategories,
  getUserData,
  getUserOrders,
} from "../../utils/databaseService";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";

const Profile = async () => {
  const queryClient = getQueryClient();
  const cookie = cookies().get("uid");
  await queryClient.prefetchQuery(["userData"], () => getUserData(cookie));
  await queryClient.prefetchQuery(["userOrders"], () => getUserOrders(cookie));

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ProfileClient cookie={cookie} />
    </Hydrate>
  );
};

export default Profile;
