"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loading from "../../../../../../loading";

const page = ({ params }) => {
  const router = useRouter();
  useEffect(() => {
    router?.push(`/shop/category/${params?.slug}/${params?.subCategorySlug}/${params?.subSubCategorySlug}`)
  }, []);
  return (
    <div>
      <Loading />
    </div>
  );
};

export default page;
