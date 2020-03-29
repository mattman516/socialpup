import {
  TOGGLE_CREATE_WALK_MODAL
} from './constants';

// action to save walk to db
export const toggleCreateWalkModal = (walk) => ({
  type: TOGGLE_CREATE_WALK_MODAL,
  data: walk
});
