import React from "react";
import CategoryProductComponent from "../../../../components/categoryProduct/CategoryProductComponent";
import Hydrate from "../../../../utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import getQueryClient from "../../../../utils/getQueryClient";
import {
  fetchBySlug,
  fetchCategoryProducts,
} from "../../../../utils/databaseService";

export async function generateMetadata({ params, searchParams }) {
  // read route params
  const id = params?.slug;
  try {
    const data: any = await fetchBySlug({
      collectionName: "categories",
      collectionSlug: id,
    });

    if (data) {
      let metaData = {
        title: data?.data?.metaData?.pageTitle,
        description: data?.data?.metaData?.metaDescription,
      };
      if (data?.data?.metaData?.metaKeywords) {
        metaData["keywords"] = data?.data?.metaData?.metaKeywords;
      }
      return metaData;
    } else {
      return {
        title: "MedX",
      };
    }
  } catch (error) {
    return {
      title: "MedX",
    };
  }
}

const CategoryProducts = async ({ params }) => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["shop", "category", params?.slug],
    queryFn: () => fetchCategoryProducts({ slug: params?.slug }),
    cacheTime: 60 * 60 * 3,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <CategoryProductComponent params={params} />
    </Hydrate>
  );
};
export default CategoryProducts;
