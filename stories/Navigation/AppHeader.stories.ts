import type { Meta, StoryObj } from '@storybook/react';

import AppHeader from '@/components/app-header';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof AppHeader> = {
  title: 'Navigation/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const AppHeaderStory: Story = {};