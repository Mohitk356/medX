"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchPolicies } from "../../utils/databaseService";
// import AboutUsComponent from "./AboutUsComponent";

const DeliveryShipping = async () => {
  const { data: policies } = useQuery({
    queryKey: ["policies"],
    queryFn: () => fetchPolicies(),
    refetchInterval: 2000,
    keepPreviousData: true,
  });
  return (
    <>
      {policies && (
        <div
          className="px-body"
          dangerouslySetInnerHTML={{ __html: policies?.shipping }}
        />
      )}
    </>
  );
};

export default DeliveryShipping;
