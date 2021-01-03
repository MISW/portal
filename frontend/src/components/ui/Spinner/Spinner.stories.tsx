import React from "react";
import type { Meta, Story } from "@storybook/react";
import { Spinner } from "./Spinner";

type Args = React.ComponentProps<typeof Spinner>;

export default {
  title: "UI/Spinner",
  component: Spinner,
} as Meta<Args>;

const Template: Story<Args> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});
