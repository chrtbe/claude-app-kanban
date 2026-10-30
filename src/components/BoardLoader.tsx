"use client";

import dynamic from "next/dynamic";

// The board reads localStorage, so it only renders in the browser.
export const BoardLoader = dynamic(() => import("./Board").then((m) => m.Board), {
  ssr: false,
});
