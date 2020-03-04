/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectFollowers = state => state.followers || initialState;

export const makeSelectUserList = () =>
  createSelector(
    selectFollowers,
    followersState => followersState.userList,
  );
