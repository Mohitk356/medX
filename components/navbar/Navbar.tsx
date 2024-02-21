import {
  fetchCategories,
  fetchMenus,
  getUserData,
} from "../../utils/databaseService";
import getQueryClient from "../../utils/getQueryClient";
import { cookies } from "next/dist/client/components/headers";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";
import NavbarClient from "./NavbarClient";
import { usePathname } from "next/navigation";
import { headers } from "next/headers";
import Head from "next/head";
import Script from "next/script";

const Navbar = async () => {
  const queryClient = getQueryClient();
  const cookie = cookies().get("uid");
  await queryClient.prefetchQuery(["categories"], fetchCategories);
  await queryClient.prefetchQuery(["userData"], () => getUserData(cookie));
  await queryClient.prefetchQuery(["menuItems"], () => fetchMenus());
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <NavbarClient cookie={cookie} />
    </Hydrate>
  );
};

export default Navbar;
