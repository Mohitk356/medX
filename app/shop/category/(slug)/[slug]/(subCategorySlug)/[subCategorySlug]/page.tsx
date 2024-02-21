import { dehydrate } from "@tanstack/react-query";
import {
  fetchBySlug,
  fetchCategoryProducts,
} from "../../../../../../../utils/databaseService";
import getQueryClient from "../../../../../../../utils/getQueryClient";
import SubCategoryProductComponent from "../../../../../../../components/subCategoryProductComponent/SubCategoryProductComponent";
import Hydrate from "../../../../../../../utils/hydrate.client";

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

const SubCategoryProducts = async ({ params }) => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["shop", "category", params?.slug, params?.subCategorySlug],
    queryFn: () =>
      fetchCategoryProducts({
        slug: params?.slug,
        subCatSlug: params?.subCategorySlug,
      }),
    cacheTime: 60 * 60 * 3,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <SubCategoryProductComponent params={params} />
    </Hydrate>
  );
};

export default SubCategoryProducts;
