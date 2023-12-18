import type { Meta, StoryObj } from '@storybook/react';

import SwapInput from '../../components/swap-input/swap-input';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Swap/SwapInput',
  component: SwapInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof SwapInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Empty: Story = {};

export const TokenSelected: Story = {
  args: {
    token: {
      symbol: 'ETH',
      name: 'Ethereum',
      address: '0x00000000'
    }
  }
};
