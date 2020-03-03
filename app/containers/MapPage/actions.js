import { SET_WALK, FETCH_WALKS, SET_WALK_LIST, DELETE_WALK } from './constants';

// action to save walk to db
export const setWalk = walk => ({
  type: SET_WALK,
  data: walk,
});

// action to trigger walk list download
export const fetchWalks = () => ({
  type: FETCH_WALKS,
});
// action to save walk list to store
export const setWalkList = walkList => ({
  type: SET_WALK_LIST,
  data: walkList,
});
// action to delete specified walk
export const deleteWalk = walk => ({
  type: DELETE_WALK,
  data: walk,
});
