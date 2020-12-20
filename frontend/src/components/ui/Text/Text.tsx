import React from "react";

/**
 * 注釈っぽい色を当てる
 */
export const Caption: React.FC = ({ children }) => (
  <span className="text-gray-600 dark:text-gray-400">{children}</span>
);
