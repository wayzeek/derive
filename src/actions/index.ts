import { goalActions } from './goals';
import { storyActions } from './story';

// Export actions as an array instead of an object
export const actions = [
  ...goalActions,
  ...storyActions,
]; 