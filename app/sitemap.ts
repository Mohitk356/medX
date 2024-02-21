import { MetadataRoute } from "next";
import flatMap from "lodash/flatMap";
import { getActiveDocs } from "../utils/utilities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.medxpharmacy.com/";

  const staticPages = [
    {
      url: "https://www.medxpharmacy.com",
    },
    {
      url: "https://www.medxpharmacy.com/category",
    },
    {
      url: "https://www.medxpharmacy.com/about-us",
    },
    {
      url: "https://www.medxpharmacy.com/contact-us",
    },
    {
      url: "https://www.medxpharmacy.com/careers",
    },
    {
      url: "https://www.medxpharmacy.com/why-choose-us",
    },
    {
      url: "https://www.medxpharmacy.com/store-locations",
    },
    {
      url: "https://www.medxpharmacy.com/become-a-partner",
    },
    {
      url: "https://www.medxpharmacy.com/customer-help",
    },
    { url: "https://www.medxpharmacy.com/delivery-&amp;-shipping" },
    { url: "https://www.medxpharmacy.com/return-&amp;-refund" },
    { url: "https://www.medxpharmacy.com/terms-&amp;-conditions" },
    { url: "https://www.medxpharmacy.com/privacy-policy" },
    { url: "https://www.medxpharmacy.com/health-information-center" },
    { url: "https://www.medxpharmacy.com/upload-prescription" },
  ];



  // const categories: any = await getActiveDocs("categories");
  // const products: any = await getActiveDocs("products");
  // const subcategories: any = await getActiveDocs("subcategories");
  // const subSubcategories: any = await getActiveDocs("subsubcategories");
  // const blogs: any = await getActiveDocs("articles");

  const promiseArr = [getActiveDocs("categories"), getActiveDocs("products"), getActiveDocs("subcategories"), getActiveDocs("subsubcategories"), getActiveDocs("articles"), getActiveDocs("brands")]
  const values = await Promise.allSettled(promiseArr);
  const data = values.map((val: any) => val?.value);


  return [
    ...staticPages,
    ...data[0],
    ...data[1],
    ...data[2],
    ...data[3],
    ...data[4],
    ...data[5]
  ];
  //   return flatMap([...staticPages, ...dynamicPostsPaths]);
}
