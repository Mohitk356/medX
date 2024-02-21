import React from "react";
import getQueryClient from "../../utils/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";
import { fetchUserWishListProducts } from "../../utils/databaseService";
import Wishlist from "./Wishlist";
import { cookies } from "next/dist/client/components/headers";

export const metadata = {
  title: "My Wishlist - MedX",
};

const WishlistServer = async () => {
  const queryClient: any = getQueryClient();
  const cookie = cookies().get("uid");

  await queryClient.prefetchQuery(["wishlist-products"], () =>
    fetchUserWishListProducts(cookie)
  );

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <Wishlist cookie={cookie}></Wishlist>
    </Hydrate>
  );
};

export default WishlistServer;
