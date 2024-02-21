"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMuscleShowPage } from "../../utils/databaseService";

import { useMediaQuery } from "@mui/material";
import StoreLinks from "../../components/HomePage/widgets/StoreLinks";
import MuscleShowBannerSlider from "../../components/muscleShow/muscleShowWidgets/MuscleShowBannerSlider";
import MuscleShowBrands from "../../components/muscleShow/muscleShowWidgets/MuscleShowBrands";
import MuscleShowHowItWorks from "../../components/muscleShow/muscleShowWidgets/MuscleShowHowItWorks";
import MuscleShowImageBanner from "../../components/muscleShow/muscleShowWidgets/MuscleShowImageBanner";
import MuscleShowImageBlock from "../../components/muscleShow/muscleShowWidgets/MuscleShowImageBlock";
import MuscleShowNewsletter from "../../components/muscleShow/muscleShowWidgets/MuscleShowNewsletter";
import MuscleShowProductCarousel from "../../components/muscleShow/muscleShowWidgets/MuscleShowProductCarousel";
import MuscleShowProductList from "../../components/muscleShow/muscleShowWidgets/MuscleShowProductList";
import MuscleShowServices from "../../components/muscleShow/muscleShowWidgets/MuscleShowServices";
import MuscleShowTextBlock from "../../components/muscleShow/muscleShowWidgets/MuscleShowTextBlock";
import MuscleShowVendors from "../../components/muscleShow/muscleShowWidgets/MuscleShowVendors";
import MuscleShowCategoriesSlider from "../../components/muscleShow/muscleShowWidgets/MuslceShowCategoriesSlider";

const MuscleShowComponent = () => {
  const { data: homeData } = useQuery({
    queryKey: ["muscle-show-2023"],
    queryFn: fetchMuscleShowPage,
  });

 

  const matches = useMediaQuery("(max-width: 768px)");

  function renderWidgets(section, idx) {
    switch (section?.widgetType) {
      case "banner-slider":
        return (
          <MuscleShowBannerSlider myKey={section?.widgetID} section={section} />
        );
      case "image-banner":
        return (
          <MuscleShowImageBanner myKey={section?.widgetID} section={section} />
        );
        case "how-it-works":
        return (
          // <MuscleShowImageBanner myKey={section?.widgetID} section={section} />
          <MuscleShowHowItWorks />
        );
      case "product-carousel":
        return (
          <MuscleShowProductCarousel
            myKey={section?.widgetID}
            section={section}
          />
        );
      // // // fetchProductCarousel(section, regionId);
      case "categories":
        return (
          <MuscleShowCategoriesSlider
            myKey={section?.widgetID}
            section={section}
          />
        );
      // fetchCategories(section, regionId);
      case "vendors":
        return (
          <MuscleShowVendors myKey={section?.widgetID} section={section} />
        );
      // fetchVendors(section, regionId);
      case "text-block":
        return (
          <MuscleShowTextBlock myKey={section?.widgetID} section={section} />
        );
      case "newsletter":
        return (
          <MuscleShowNewsletter myKey={section?.widgetID} section={section} />
        );
      // fetchTextBlock(section, regionId);
      case "product-list":
        return (
          <MuscleShowProductList myKey={section?.widgetID} section={section} />
        );
      // fetchProductList(section, regionId);
      case "image-block":
        return (
          <MuscleShowImageBlock myKey={section?.widgetID} section={section} />
        );
      // fetchImageBlock(section, regionId);
      case "video-block":
        return (
          <MuscleShowImageBlock
            myKey={section?.widgetID}
            section={section}
            isVideo={true}
          />
        );
      case "brands":
        return (
          <MuscleShowBrands
            myKey={section?.widgetID}
            section={section}
            isBrand={true}
          />
        );
      case "services":
        return (
          <MuscleShowServices section={section} myKey={section?.widgetID} />
        );

      case "playStore":
        return <StoreLinks myKey={section?.widgetID} section={section} />;
      default:
        return <></>;
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

export default MuscleShowComponent;
