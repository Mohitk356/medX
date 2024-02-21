import React from "react";
import getQueryClient from "../../../utils/getQueryClient";
import { handleTypesenseSearch } from "../../../config/typesense";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../../utils/hydrate.client";
import ProductTagClient from "../ProductTagClient";

export async function generateMetadata({ params, searchParams }) {
  // read route params
  const slug =
    params?.slug?.length !== 0 ? params?.slug[0]?.split("-").join(" ") : "";
  return {
    title: slug || "MedX",
  };
}

const ProductTag = async ({ params }) => {
  //   console.log("PARAMS", params?.slug);
  const slug =
    params?.slug?.length !== 0 ? params?.slug[0]?.split("-").join(" ") : "";

  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["search", slug],
    queryFn: () => handleTypesenseSearch(slug),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ProductTagClient slug={slug} />
    </Hydrate>
  );
};

export default ProductTag;
