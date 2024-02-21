import { dehydrate } from "@tanstack/react-query";
import { fetchCategories } from "../../utils/databaseService";
import getQueryClient from "../../utils/getQueryClient";
import Hydrate from "../../utils/hydrate.client";
import CategoryPageComponent from "./CategoryPageComponent";

export const metadata = {
  title: "Categories - MedX"
}

const CategoryPage = async () => {
  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery(["categories"], fetchCategories);

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <CategoryPageComponent />
    </Hydrate>
  );
};

export default CategoryPage;
