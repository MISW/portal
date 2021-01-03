import React from "react";
import type { DecoratorFn } from "@storybook/react";
import type { NextRouter } from "next/router";
import { RouterContext } from "next/dist/next-server/lib/router-context";

const mockRouter: Partial<NextRouter> = {
  push: () => Promise.resolve(false),
  prefetch: () => new Promise(() => {}),
};

export const withMockRouter: DecoratorFn = (renderStory) => (
  <RouterContext.Provider value={mockRouter as any}>
    {renderStory()}
  </RouterContext.Provider>
);
