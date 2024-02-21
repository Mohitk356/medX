import React from "react";
import getQueryClient from "../../../../../../utils/getQueryClient";
import {
  fetchBySlug,
  fetchCategoryProducts,
  fetchSubCategories,
} from "../../../../../../utils/databaseService";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../../../../../utils/hydrate.client";
import SubCategoryComponent from "./SubCategoryComponent";

export async function generateMetadata({ params, searchParams }) {
  // read route params
  const id = params?.slug;
  const data: any = await fetchBySlug({
    collectionName: "categories",
    collectionSlug: id,
    subCollection: "subcategories",
    subCollectionSlug: params?.subCategorySlug,
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
}

const SubCategory = async ({ params }) => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["subCategory", params?.slug, params?.subCategorySlug],
    queryFn: () =>
      fetchSubCategories({
        slug: params?.slug,
        subCategorySlug: params?.subCategorySlug,
      }),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <SubCategoryComponent params={params} />
      {/* <SubCategoryProductComponent params={params} /> */}
    </Hydrate>
  );
};

export default SubCategory;
