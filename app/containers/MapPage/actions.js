import {
  SET_WALK,
  FETCH_WALKS,
  SET_WALK_LIST,
  DELETE_WALK,
  SET_OTHERS_WALK_LIST,
  FETCH_ALL_WALKS,
  FETCH_FOLLOWED_WALKS,
  UNSUBSCRIBE_TO_WALKS,
  SUBSCRIBE_TO_WALKS
} from './constants';

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
// action to trigger walk list download
export const fetchFollowedWalks = () => ({
  type: FETCH_FOLLOWED_WALKS,
});
// action to trigger walk list download
export const fetchAllWalks = () => ({
  type: FETCH_ALL_WALKS,
});
// action to set other walk list
export const setOthersWalkList = walks => ({
  type: SET_OTHERS_WALK_LIST,
  data: walks,
});

// action to unsubscribe to walks
export const subscribeToWalks = () => ({
  type: SUBSCRIBE_TO_WALKS
})
// action to unsubscribe to walks
export const unsubscribeToWalks = () => ({
  type: UNSUBSCRIBE_TO_WALKS
})
