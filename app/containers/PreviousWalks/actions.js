import { FETCH_USER_LIST, SET_USER_LIST, ADD_FOLLOWER, UPDATE_LOOKBACK } from './constants';

export function fetchAllUsers() {
  return {
    type: FETCH_USER_LIST,
  };
}
export function setUserList(users) {
  return {
    type: SET_USER_LIST,
    data: users
  };
}
export function addFollower(user) {
  return {
    type: ADD_FOLLOWER,
    data: user
  };
}
export function updateLookback(value) {
  return {
    type: UPDATE_LOOKBACK,
    data: value
  };
}
