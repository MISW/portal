import "tailwindcss/tailwind.css";
import "../src/styles/global.css";
import type { DecoratorFn } from "@storybook/react";
import { themes } from "@storybook/theming";
import { withMockRouter } from "./withMockRouter";
import { withDarkMode } from "./withDarkMode";

export const decorators: DecoratorFn[] = [withDarkMode, withMockRouter];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  darkMode: {
    dark: { ...themes.dark, appBg: "black" },
    light: { ...themes.dark, appBg: "black" },
  },
};
