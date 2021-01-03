import React, { useLayoutEffect } from "react";
import type { DecoratorFn } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

const DarkModeWrapper: React.FC = ({ children }) => {
  const darkMode = useDarkMode();

  useLayoutEffect(() => {
    const classList = document.querySelector("html").classList;
    if (darkMode) {
      classList.add("dark");
    } else {
      classList.remove("dark");
    }
    return () => {
      classList.remove("dark");
    };
  }, [darkMode]);

  return <>{children}</>;
};

export const withDarkMode: DecoratorFn = (renderStory) => (
  <DarkModeWrapper>{renderStory()}</DarkModeWrapper>
);
