import { dehydrate } from "@tanstack/react-query";
import CategoryProductComponent from "../../../components/categoryProduct/CategoryProductComponent";
import {
  fetchBrandProducts,
  getBrandData,
} from "../../../utils/databaseService";
import getQueryClient from "../../../utils/getQueryClient";
import Hydrate from "../../../utils/hydrate.client";

export async function generateMetadata({ params, searchParams }) {
  // read route params

  const brand: any = await getBrandData({ slug: params?.slug });
  if (brand?.metaData && !!brand?.metaData) {
    let metaData = {
      title: brand?.metaData?.pageTitle,
      description: brand?.metaData?.metaDescription,
    };
    if (brand?.metaData?.metaKeywords) {
      metaData["keywords"] = brand?.metaData?.metaKeywords;
    }
    metaData["alternates"] = {
      canonical: `https://www.medxpharmacy.com/product-category/brands/${params?.slug}`,
    };
    return metaData;
  }
  return {
    title: "MedX",
    alternates: {
      canonical: `https://www.medxpharmacy.com/product-category/brands/${params?.slug}`,
    },
  };
}

const CategoryProducts = async ({ params }) => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["brand-product", params?.slug],
    queryFn: () => fetchBrandProducts({ slug: params?.slug }),
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
