import { goalActions } from './goals';
import { storyActions } from './story';
import { metadataActions } from './tools';

// Export actions as an array instead of an object
export const actions = [
  ...goalActions,
  ...storyActions,
  ...metadataActions,
]; 