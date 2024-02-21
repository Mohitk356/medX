"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Breadcrumbs, Typography } from "@mui/material";

const _defaultGetTextGenerator = (param, query) => null;
const _defaultGetDefaultTextGenerator = (path, _) => path;

// Pulled out the path part breakdown because its
// going to be used by both `asPath` and `pathname`
const generatePathParts = (pathStr) => {
  const pathWithoutQuery = pathStr.split("?")[0];
  return pathWithoutQuery.split("/").filter((v) => v.length > 0);
};

export default function NextBreadcrumbs({
  getTextGenerator = _defaultGetTextGenerator,
  getDefaultTextGenerator = _defaultGetDefaultTextGenerator,
}) {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      console.log(pathname);
      let arr = pathname
        .split("/")
        .filter((val) => val !== "category")
        .filter((val) => val !== "shop")
        .filter((val) => val);
     
        let breadCrumbs=[]

        for (const item of arr) {
          
        }

      return [
        { href: "/", text: "Home" },
        { href: "/back", text: "asv" },
        { href: "/back", text: "asv" },
      ];
    },
    [getTextGenerator, getDefaultTextGenerator]
  );

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((crumb, idx) => (
        <Crumb
          textGenerator={undefined}
          {...crumb}
          key={idx}
          last={idx === breadcrumbs.length - 1}
        />
      ))}
    </Breadcrumbs>
  );
}

function Crumb({ text: defaultText, textGenerator, href, last = false }) {
  const [text, setText] = React.useState(defaultText);

  async function execute() {
    if (!Boolean(textGenerator)) {
      return;
    }
    // Run the text generator and set the text again
    const finalText = await textGenerator();
    setText(finalText);
  }

  useEffect(() => {
    execute();
  }, [textGenerator]);

  if (last) {
    return <Typography color="text.primary">{text}</Typography>;
  }

  return (
    <Link color="inherit" href={href}>
      {text}
    </Link>
  );
}
