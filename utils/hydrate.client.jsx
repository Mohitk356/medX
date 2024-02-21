"use client";

import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";

function Hydrate(props) {
    return <RQHydrate {...props} />;
}

export default Hydrate;
