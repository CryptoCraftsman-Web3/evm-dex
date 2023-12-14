import type { Meta, StoryObj } from '@storybook/react';

import Footer from '@/components/footer';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Footer> = {
  title: 'Navigation/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const FooterStory: Story = {};