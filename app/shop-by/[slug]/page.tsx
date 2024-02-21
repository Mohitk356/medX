import React from "react";
import getQueryClient from "../../../utils/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import { fetchSimilarProductsForCart } from "../../../config/typesense";
import Hydrate from "../../../utils/hydrate.client";
import ShopByClient from "../ShopByClient";
import { fetchBySlug } from "../../../utils/databaseService";


const ShopBy = async ({ params }) => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["shop-by", params?.slug],
    queryFn: () =>
      fetchSimilarProductsForCart({ searchKeywords: [params?.slug] }),
    cacheTime: 60 * 60 * 3,
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <ShopByClient params={params} />
    </Hydrate>
  );
};

export default ShopBy;
