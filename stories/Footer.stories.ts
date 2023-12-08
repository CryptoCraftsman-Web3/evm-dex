import type { Meta, StoryObj } from '@storybook/react';

import Footer from '../components/footer';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Footer> = {
  component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};