"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHomeSections,
  fetchUserWishList,
} from "../../utils/databaseService";
import BannerSlider from "./widgets/BannerSlider";
import ImageBanner from "./widgets/ImageBanner";
import CategoriesSlider from "./widgets/CategoriesSlider";
import ProductCarousel from "./widgets/ProductCarousel";
import Vendors from "./widgets/Vendors";
import ProductList from "./widgets/ProductList";
import Services from "./widgets/Services";
import ImageBlock from "./widgets/ImageBlock";
import TextBlock from "./widgets/TextBlock";
// import BrandSlider from "./widgets/BrandSlider";
import Brands from "./widgets/Brands";
import CustomCategoriies from "./widgets/CustomCategoriies";
import Articles from "./widgets/Articles";
import Loading from "../../app/loading";
import { useMediaQuery } from "@mui/material";

// import StoreLinks from "./widgets/StoreLinks";

const StoreLinks = dynamic(() => import("./widgets/StoreLinks"), {
  loading: () => <Loading />,
});
// const StoreLinks = dynamic(() => import("./widgets/StoreLinks"), {
//   loading: () => <Loading />,
// });

const HomeComponent = () => {
  const { data: homeData } = useQuery({
    queryKey: ["homeSections"],
    queryFn: fetchHomeSections,
  });

  const matches = useMediaQuery("(max-width: 768px)");

  function renderWidgets(section, idx) {
    switch (section?.widgetType) {
      case "banner-slider":
        return <BannerSlider myKey={section?.widgetID} section={section} />;
      case "image-banner":
        return <ImageBanner myKey={section?.widgetID} section={section} />;
      case "product-carousel":
        return <ProductCarousel myKey={section?.widgetID} section={section} />;
      // // fetchProductCarousel(section, regionId);
      case "categories":
        return <CategoriesSlider myKey={section?.widgetID} section={section} />;
      // fetchCategories(section, regionId);
      case "vendors":
        return <Vendors myKey={section?.widgetID} section={section} />;
      // fetchVendors(section, regionId);
      case "text-block":
        return <TextBlock myKey={section?.widgetID} section={section} />;
      // fetchTextBlock(section, regionId);
      case "product-list":
        return <ProductList myKey={section?.widgetID} section={section} />;
      // fetchProductList(section, regionId);
      case "image-block":
        return <ImageBlock myKey={section?.widgetID} section={section} />;
      // fetchImageBlock(section, regionId);
      case "video-block":
        return (
          <ImageBlock
            myKey={section?.widgetID}
            section={section}
            isVideo={true}
          />
        );
      case "brands":
        // <CategoriesSlider myKey={section?.widgetID} section={section}/>
        // return <BrandSlider myKey={section?.widgetID} section={section} isBrand={true} />;
        return (
          <Brands myKey={section?.widgetID} section={section} isBrand={true} />
        );
      case "services":
        return <Services section={section} myKey={section?.widgetID} />;

      case "disease":
        return (
          <CustomCategoriies myKey={section?.widgetID} section={section} />
        );
      case "nutrition":
        return (
          <CustomCategoriies myKey={section?.widgetID} section={section} />
        );
      case "articles":
        return <Articles myKey={section?.widgetID} section={section} />;
      case "playStore":
        return <StoreLinks myKey={section?.widgetID} section={section} />;
      default:
    }
  }

  return (
    // <StripeWrapper>
    <div className="w-full">
      <div className="w-full flex flex-col gap-10 lg:gap-16">
        {homeData &&
          homeData?.homeSections?.sections?.map((section: any, idx: any) => {
            if (section?.location == "all" || section?.location === "web") {
              if (matches) {
                if (idx === 0) {
                  return renderWidgets(
                    homeData?.homeSections?.sections[idx + 1],
                    idx + 1
                  );
                }

                if (idx === 1) {
                  return renderWidgets(
                    homeData?.homeSections?.sections[idx - 1],
                    idx - 1
                  );
                }

                return renderWidgets(section, idx);
              } else {
                return renderWidgets(section, idx);
              }
            }
            // return <div key={idx}></div>;
          })}
        {/* <div><</div> */}
        {/* <BrandSlider section="brands"/> */}
      </div>
    </div>
    // </StripeWrapper>
  );
};

export default HomeComponent;
