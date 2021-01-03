import React from "react";
import type { Meta, Story } from "@storybook/react";
import { Header } from "./Header";

type Component = typeof Header;
type Args = React.ComponentProps<Component>;

export default {
  title: "Header",
  component: Header,
  argTypes: {
    logout: {
      action: "logout",
    },
  },
} as Meta<Args>;

const Template: Story<Args> = (args) => <Header {...args} />;

export const Logout = Template.bind({});

export const Login = Template.bind({});
Login.args = {
  userName: "mischan",
};

export const Admin = Template.bind({});
Admin.args = {
  userName: "mischan",
  isAdmin: true,
};
