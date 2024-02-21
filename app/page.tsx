import { dehydrate } from "@tanstack/react-query";
import HomeComponent from "../components/HomePage/HomeComponent";
import { fetchHomeSections } from "../utils/databaseService";
import getQueryClient from "../utils/getQueryClient";
import Hydrate from "../utils/hydrate.client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { headers } from "next/headers";
import Script from "next/script";

// import Loading from "./";

// export const revalidate = 600;

export async function generateMetadata({ params, searchParams }) {
  // read route params
  const data = (await getDoc(doc(db, "settings", "seo"))).data();

  if (data) {
    let metaData = {
      title: data?.pageTitle,
      description: data?.metaDescription,
      keywords: data?.metaKeywords,
      alternates: {
        canonical: "https://www.medxpharmacy.com/",
      },
    };

    return metaData;
  } else {
    return {
      title: "MedX",
      alternates: {
        canonical: `https://www.medxpharmacy.com/`,
      },
    };
  }
}

export default async function Home() {
  const headersList = headers();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["homeSections"], fetchHomeSections);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Script id="fb-pixel">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '893965312416574');
            fbq('track', 'PageView');
           `}
        </Script>
    
            <noscript
            dangerouslySetInnerHTML={{
              __html: `
              <img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=893965312416574&ev=PageView&noscript=1"
              />
              `,
            }}
          />
            
      <HomeComponent />
    </Hydrate>
  );
}
