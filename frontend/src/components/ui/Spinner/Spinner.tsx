import React from "react";

export const Spinner: React.VFC = () => (
  <div
    className="animate-spin w-24 h-24 rounded-full border-solid border-8 border-blue-500"
    style={{
      borderTopColor: "transparent",
    }}
  />
);
