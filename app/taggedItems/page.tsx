import React from "react";
import getQueryClient from "../../utils/getQueryClient";
import { fetchTaggedItems } from "../../utils/bannerLink/bannerLinking";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "../../utils/hydrate.client";
import TaggedItemsComponent from "../../components/TaggedItemsClient/TaggedItemsComponent";

const TaggedItems = async ({ params, searchParams }) => {
  let ids = JSON.parse(searchParams.ids);
  let type = searchParams?.type;

  const queryClient: any = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["taggedItems", type],
    queryFn: () => fetchTaggedItems({ type, ids }),
    cacheTime: 60 * 60 * 3,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <TaggedItemsComponent params={params} searchQuery={searchParams} />
    </Hydrate>
  );
};

export default TaggedItems;
