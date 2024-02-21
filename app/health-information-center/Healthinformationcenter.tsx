"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import sports from "../../images/sports.jpg";
import Singlepostitem from "../../components/singlepostitem/Singlepostitem";
import { fetchArticles } from "../../utils/databaseService";

const posts = [
  {
    image: sports,
    heading: "Sports Supplements and Its Importance",
    date: "Octtober, 18 2023",
    text: "Quos unde voluptas illo deserunt unde. At totam est explicabo earum voluptas. Minus consequatur voluptatem non. Quis voluptatem et et sint. Neque aliquam vestibulum morbi blandit.",
    slug: "Sports-Supplements-and-Its-Importance",
  },
  {
    image: sports,
    heading: "Sports Supplements and Its Importance",
    date: "Octtober 18, 2023",
    text: "Quos unde voluptas illo deserunt unde. At totam est explicabo earum voluptas. Minus consequatur voluptatem non. Quis voluptatem et et sint. Neque aliquam vestibulum morbi blandit.",
    slug: "Sports-Supplements-and-Its-Importance",
  },
  {
    image: sports,
    heading: "Sports Supplements and Its Importance",
    date: "Octtober, 18 2023",
    text: "Quos unde voluptas illo deserunt unde. At totam est explicabo earum voluptas. Minus consequatur voluptatem non. Quis voluptatem et et sint. Neque aliquam vestibulum morbi blandit.",
    slug: "Sports-Supplements-and-Its-Importance",
  },
  {
    image: sports,
    heading: "Sports Supplements and Its Importance",
    date: "Octtober, 18 2023",
    text: "Quos unde voluptas illo deserunt unde. At totam est explicabo earum voluptas. Minus consequatur voluptatem non. Quis voluptatem et et sint. Neque aliquam vestibulum morbi blandit.",
    slug: "Sports-Supplements-and-Its-Importance",
  },
  {
    image: sports,
    heading: "Sports Supplements and Its Importance",
    date: "Octtober, 18 2023",
    text: "Quos unde voluptas illo deserunt unde. At totam est explicabo earum voluptas. Minus consequatur voluptatem non. Quis voluptatem et et sint. Neque aliquam vestibulum morbi blandit.",
    slug: "Sports-Supplements-and-Its-Importance",
  },
  {
    image: sports,
    heading: "Sports Supplements and Its Importance",
    date: "Octtober, 18 2023",
    text: "Quos unde voluptas illo deserunt unde. At totam est explicabo earum voluptas. Minus consequatur voluptatem non. Quis voluptatem et et sint. Neque aliquam vestibulum morbi blandit.",
    slug: "Sports-Supplements-and-Its-Importance",
  },
];

const Healthinfomationcenter = ({ cookie }) => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  return (
    <div className="px-body py-6">
      <h1 className=" text-xl sm:text-2xl md:text-3xl font-semibold">
        Health Information Center
      </h1>
      <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {/*  */}
        {articles &&
          articles?.map((singlepost: any) => {
            return (
              <div key={singlepost.id} className="h-full">
                <Singlepostitem post={singlepost} id={singlepost.id} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Healthinfomationcenter;
