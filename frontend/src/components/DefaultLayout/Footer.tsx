import React from "react";
import { Caption } from "components/ui";

export const Footer: React.VFC = () => (
  <p className="text-center">
    <Caption>
      Copyright ©{" "}
      <a
        className="hover:underline focus:underline"
        target="_blank"
        rel="noreferrer"
        href="https://misw.jp"
      >
        MISW
      </a>{" "}
      2020.
    </Caption>
  </p>
);
