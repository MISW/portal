import React, { useState } from 'react';
import type { Meta, Story } from '@storybook/react'
import { Select } from './Select';

export default {
  title: 'UI/Select'
} as Meta;

export const Normal: Story = () => {
  const [state, setState] = useState('');

  return (
    <Select className="w-40 bg-gray-200 dark:bg-gray-800" value={state} onChange={(ev) => setState(ev.target.value)}>
      <option value="" tabIndex={-1}>---</option>
      <option value="dog">犬</option>
      <option value="cat">猫</option>
      <option value="molcar">モルカー</option>
    </Select>
  )
}