import getQueryClient from "../../utils/getQueryClient";
import {
  fetchCategories,
  fetchHomeSections,
  fetchMuscleShowPage,
  getStoreDetails,
} from "../../utils/databaseService";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";
import HomeComponent from "../../components/HomePage/HomeComponent";
import MuscleShowComponent from "./MuscleShowComponent";
// import Loading from "./";

// export const dynamic = "force-dynamic";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["muscle-show-2023"], fetchMuscleShowPage);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <MuscleShowComponent />
    </Hydrate>
  );
}
