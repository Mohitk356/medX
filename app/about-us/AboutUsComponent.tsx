"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchAboutUs } from "../../utils/databaseService";

const AboutUsComponent = () => {
  const { data: aboutUs } = useQuery({
    queryKey: ["about-us"],
    queryFn: () => fetchAboutUs(),
    keepPreviousData: true,
  });
  return (
    <>
      {aboutUs && (
        <div className="px-body" dangerouslySetInnerHTML={{ __html: aboutUs?.pageContent }} />
      )}
    </>
  );
};

export default AboutUsComponent;
