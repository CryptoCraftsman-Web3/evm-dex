import type { Meta, StoryObj } from '@storybook/react';

import FaqBox from '@/components/home/faq-box';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof FaqBox> = {
  title: 'App/FaqBox',
  component: FaqBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FaqBox>;

export const FaqBoxStory: Story = {
  args: {
    title: 'This is a short question?',
    content: 'This is a long answer to the short question.'
  }
};