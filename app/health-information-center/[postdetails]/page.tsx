import PostSection from "../../../components/postsection/Postsection";
// import Postrelatedproducts from "@/components/postrelatedproducts/Postrelatedproducts";
// import Postcomments from "@/components/postcomments/Postcomments";
import { fetchSinglePost } from "../../../utils/databaseService";
import getQueryClient from "../../../utils/getQueryClient";
import Hydrate from "../../../utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";

import React from "react";

const PostDetails = async ({ params }: any) => {
  const client = getQueryClient();
  await client.prefetchQuery({
    queryKey: ["articles", params?.postdetails],
    queryFn: () => fetchSinglePost({ postdetails: params?.postdetails }),
  });

  const dehydratedState = dehydrate(client);
  return (
    <Hydrate state={dehydratedState}>
      <PostSection params={params} />
      {/* <Postrelatedproducts params={params} /> */}
      {/* <Postcomments params={params} /> */}
    </Hydrate>
  );
};

export default PostDetails;
