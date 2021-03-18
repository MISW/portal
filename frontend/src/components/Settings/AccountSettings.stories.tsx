import React from "react";
import type { Story, Meta } from "@storybook/react";
import { AccountSettings } from "./AccountSettings";

type Args = React.ComponentProps<typeof AccountSettings>;

const Template: Story<Args> = (args) => <AccountSettings {...args} />;

const defaultArgs: Args = {
  onSubmit: (v) => {
    console.log(v);
  },
  canEditName: false,
  defaultName: "みす ちゃん",
  defaultKana: "ミス チャン",
  defaultSex: "female",
  defaultPhoneNumber: "0000000000",
};

export default {
  title: "Settings/Account",
  component: AccountSettings,
  args: defaultArgs,
} as Meta<Args>;

export const Default = Template.bind({});
export const Admin = Template.bind({});
Admin.args = {
  ...defaultArgs,
  canEditName: true,
};
