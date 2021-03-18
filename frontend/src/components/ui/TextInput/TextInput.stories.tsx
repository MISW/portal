import React, { useState } from "react";
import type { Meta, Story } from "@storybook/react";
import { TextInput } from "./TextInput";

export default {
  title: "UI/TextInput",
} as Meta;

export const Normal: Story = () => {
  const [text, setText] = useState("");

  return (
    <TextInput
      className="bg-gray-200 dark:bg-gray-800"
      placeholder="placeholder"
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};
