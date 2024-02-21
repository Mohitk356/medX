import React from "react";
import getQueryClient from "../../../utils/getQueryClient";
import { fetchSingleProduct } from "../../../utils/databaseService";
import Hydrate from "../../../utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import ProductInfo from "../../../components/singleProduct/ProductInfo";
import Head from "next/head";

export async function generateMetadata({ params, searchParams }) {
  // read route params
  const slug = params?.slug?.length !== 0 ? params?.slug[0] : "";

  const product: any = await fetchSingleProduct(slug);

  if (product?.metaData && !!product?.metaData) {
    let metaData = {
      title: product?.metaData?.pageTitle,
      description: product?.metaData?.metaDescription,
    };
    if (product?.metaData?.metaKeywords) {
      metaData["keywords"] = product?.metaData?.metaKeywords;
    }

    metaData["alternates"] = {
      canonical: `https://www.medxpharmacy.com/product/${slug}`,
    };

    return metaData;
  }
  return {
    title: product?.prodName || "MedX",
    alternates: {
      canonical: `https://www.medxpharmacy.com/product/${slug}`,
    },
  };
}

const ProductInfoPage = async ({ params }) => {
  const slug = params?.slug?.length !== 0 ? params?.slug[0] : "";

  const queryClient: any = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchSingleProduct(slug),
    cacheTime: 60 * 60 * 3,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ProductInfo params={params} />
    </Hydrate>
  );
};

export default ProductInfoPage;
