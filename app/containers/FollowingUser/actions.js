import { UNFOLLOW_USER } from './constants';

export function unfollowUser(username) {
  return {
    type: UNFOLLOW_USER,
    data: username,
  };
}
