import { FETCH_USER, SAVE_USER } from './constants';

export function fetchUser() {
  return {
    type: FETCH_USER,
  };
}
export function setUserData() {
  return {
    type: SAVE_USER,
  };
}
